'use strict';

const webdriver = require('selenium-webdriver');
const request = require('request-promise-native');

const tcEscape = (text) =>
    text.replace(/\|/g, '||')
        .replace(/\]/g, "|]")
        .replace(/\[/g, "|[")
        .replace(/\r/g, "|r")
        .replace(/\n/g, "|n")
        .replace(/'/g, "|'");

class Task {
    constructor(testUnit) {
        Object.entries(testUnit).forEach(entry => this[entry[0]] = entry[1]);
        this.suitesFinished = 0;
        this.specsFinished = 0;
    }

    async setup(finishCallback) {
        this.finishCallback = finishCallback;
        
        const driverBuilder =
            new webdriver.Builder().withCapabilities(this.browserCapabilities);
        
        if (this.hub != null) {
            driverBuilder.usingServer(this.hub);
        }
        
        let sessionId;
        
        try {
            this.driver = await driverBuilder.build();
        
            const session = await this.driver.getSession();
            sessionId = this.id = session.getId();
            
            await this.log(`Task ${this.name} started with WebDriver session id: ${sessionId}`);
        }
        catch (e) {
            await this.finish(`Task ${this.name} failed to start with driver error`, e);
            
            return null;
        }
        
        return sessionId;
    }
    
    async run(commandURL, resultURL) {
        const options = {
            commandURL: commandURL,
            resultURL: resultURL,
            ...(this.runnerOptions || {}),
        };
        
        const parts = [
            `remote-test=${encodeURIComponent(JSON.stringify(options))}`,
        ];
        
        if (this.chunks > 0) {
            // Historically not URL encoded
            parts.push(`chunkify=${this.chunk}/${this.chunks}`);
        }
        
        if (this.disableCacheBuster) {
            parts.push('disableCacheBuster=true');
        }
        
        if (this.skipAllTests) {
            parts.push('skip-all-tests=true');
        }
        
        const remoteURL = this.page.replace('{host}', this.publicHost)
                                   .replace('{port}', this.publicPort) +
                                   '?' + parts.join('&');
        
        try {
            await this.log(`Task ${this.name} remote browser session dispatched at ${remoteURL}`);
            await this.driver.get(remoteURL);
            
            this.lastMessageAt = Date.now();
            this.keepAlive();
            
            if (this.testStartTimeout) {
                const timeoutSec = Math.ceil(this.testStartTimeout / 1000);
                await this.log(`Task ${this.name} test start timeout set for ${timeoutSec} seconds`);
                
                this.testStartTimer = setTimeout(
                    () => this.finish(
                        `Task ${this.id} failed to start tests in ${timeoutSec} seconds`,
                        new Error("Timed out")
                    ),
                    this.testStartTimeout
                );
            }
        }
        catch (e) {
            await this.finish(`Task ${this.name} failed to run with error`, e);
        }
    }
    
    async abort(reason) {
        await this.finish(`Task ${this.name} was aborted`, new Error(reason || "Aborted"));
    }
    
    async keepAlive() {
        if (this.keepaliveTimer) {
            clearTimeout(this.keepaliveTimer);
            this.keepaliveTimer = null;
        }
        
        if (Date.now() - this.lastMessageAt > this.pingInterval) {
            await this.log(`Task ${this.name} last communicated with browser ` +
                           `${Math.ceil(this.pingInterval / 1000)}s ago, ` +
                           `issuing keepalive ping`);
            
            try {
                const delay = await this.ping();
                
                await this.log(`Task ${this.name} driver keepalive ping took ${delay} ms`);
            }
            catch (e) {
                setImmediate(
                    () => this.finish(`Task ${this.name} driver keepalive ping failed with error`, e)
                );
                
                return;
            }
            
            this.lastMessageAt = Date.now();
        }
        
        this.keepaliveTimer = setTimeout(() => this.keepAlive(), this.pingInterval);
    }
    
    async ping() {
        const start = Date.now();
        const pingTimeout = this.pingTimeout || 30000;
        
        const pingPromise = new Promise((resolve, reject) => {
            // Vanilla Promises are not cancelable :(
            let timedOut;
            
            this.pingTimer = setTimeout(() => {
                this.pingTimer = null;
                timedOut = true;
                reject(new Error(`Timed out after ${Math.ceil(pingTimeout / 1000)} seconds`));
            }, pingTimeout);
            
            this.driver
                .executeScript('return true;')
                .then(() => {
                    if (timedOut) {
                        return;
                    }
                    
                    clearTimeout(this.pingTimer);
                    this.pingTimer = null;
                    
                    resolve();
                })
                .catch((err) => {
                    if (timedOut || !this.pingTimer) {
                        return;
                    }
                    
                    clearTimeout(this.pingTimer);
                    this.pingTimer = null;
                    
                    reject(err);
                });
        });
        
        await pingPromise;
        
        return Date.now() - start;
    }
    
    async processMessages(messages) {
        // Receiving a message means the browser is alive and chuggling on.
        // It might so happen that it would miss a ping which will then fail
        // otherwise normal session (iOS and Android are especially prone to that)
        if (this.pingTimer) {
            clearTimeout(this.pingTimer);
            this.pingTimer = null;
        }
        
        if (!Array.isArray(messages)) {
            messages = [messages];
        }
        
        let output, finished, failed;
        
        if (messages.length) {
            output = messages.map(msg => this.formatMessage(msg));
            
            // formatMessage above has a side effect of setting initialPlan
            // and finishPlan properties on `this`
            if (this.finishPlan) {
                finished = true;
                
                if (!this.skipAllTests) {
                    const initial = this.initialPlan;
                    const current = this.finishPlan;
                    
                    const wantFinished = Math.max(initial.totalSpecs, current.totalSpecs);
                    const haveFinished = Math.max(current.finishedSpecs, this.specsFinished);
                    
                    failed = haveFinished < wantFinished;
                    
                    if (failed && this.enforceTestPlan) {
                        const planFailed = this.formatFailedPlan(wantFinished, haveFinished);
                        const runnerFinished = output.pop();
                        
                        output = [].concat(output, planFailed, runnerFinished);
                    }
                }
            }
            
        }
        
        this.lastMessageAt = Date.now();
        
        try {
            if (output) {
                await this.printMessage(output.join("\n"));
                
            }
            
            if (finished) {
                setImmediate(() => this.finish());
            }
        }
        catch (e) {
            setImmediate(() => this.finish(`Task ${this.name} failed to ping browser`, e));
            
            return false;
        }
        
        return true;
    }

    async driverCommand(command) {
        // See above
        if (this.pingTimer) {
            clearTimeout(this.pingTimer);
            this.pingTimer = null;
        }
        
        this.lastMessageAt = Date.now();
        
        switch (command.type) {
            case 'click':
                await this.log(
                    `Task ${this.name} WebDriver command: click on ${command.elementId}`
                );
                
                return this.driver.findElement(webdriver.By.id(command.elementId)).click();
            
            case 'switchTo':
                await this.log(
                    `Task ${this.name} WebDriver command: switch to frame ${command.frame}`
                );
                
                return this.driver.switchTo(command);
            
            default:
                await this.log(
                    `Task ${this.name} received unsupported WebDriver command: ${command.type}`,
                    'warning'
                );
                
                break;
        }
    }

    formatMessage(message) {
        let type = message.type,
            plan;
        
        delete message.type;
        
        switch (type) {
            case 'message':
                message.text = `Task ${this.name}: ${message.text}`;
                break;
            
            case 'testRunnerStarted':
                clearTimeout(this.testStartTimer);
                this.testStartTimer = null;
                
                this.initialPlan = plan = message.plan;
                delete message.plan;
                
                message.message = `Task ${this.name}: Test runner started` +
                    (plan
                        ? ` with ${plan.enabledSpecs} enabled specs, ` +
                            `${plan.disabledSpecs} disabled specs (${plan.totalSpecs} total)`
                        : ''
                    );
                break;
            
            case 'testRunnerFinished':
                this.finishPlan = plan = message.plan;
                delete message.plan;
                
                message.message = `Task ${this.name}: Test runner finished` +
                    (plan
                        ? `: ${plan.finishedSpecs} specs finished out of ` +
                            `${plan.enabledSpecs} enabled, skipped ${plan.disabledSpecs} ` +
                            `disabled specs (${plan.totalSpecs} total)`
                        : ''
                    );
                break;
            
            case 'dependencyLoadStarted':
                message.message = `Task ${this.name}: Started loading test dependencies`;
                break;
            
            case 'dependencyLoadFinished':
                message.message = `Task ${this.name}: Finished loading test dependencies`;
                break;
            
            case 'testSuiteStarted':
                if (message.topSuite) {
                    message.name = this.suitePrefix + message.name;
                    delete message.topSuite;
                }
                
                break;
            
            case 'testSuiteFinished':
                if (message.topSuite) {
                    message.name = this.suitePrefix + message.name;
                    delete message.topSuite;
                }
                
                this.suitesFinished++;
                break;
            
            case 'testFinished':
                this.specsFinished++;
                break;
            
            case 'testFailed':
                // There is a funny collision between what we call a message type
                // and TeamCity message *parameter* called "type". It is only used
                // for expectation failure messages.
                if (message.expected != null && message.actual != null) {
                    message.type = 'comparisonFailure';
                }
                else {
                    delete message.expected;
                    delete message.actual;
                }
                
                if (this.chunks > 0) {
                    message.details = (message.details ? message.details + ' ' : '') +
                                      `Chunk: ${this.chunk}/${this.chunks}`;
                }
                
                break;
        }
        
        const parts = [`flowId='${this.id}'`];
        
        for (let prop in message) {
            const value = message[prop];
            
            if (value != null) {
                parts.push(prop + "='" + tcEscape(value + '') + "'");
            }
        }
        
        return '##teamcity[' + type + ' ' + parts.join(' ') + ']';
    }
    
    formatFailedPlan(wantSpecs, haveSpecs) {
        const { sauceLabs } = this;
        
        const details =
            (sauceLabs && sauceLabs.user ? `https://saucelabs.com/beta/tests/${this.id}` : '');
        
        const messages = [{
            type: 'testSuiteStarted',
            topSuite: true,
            name: 'Test Plan'
        }, {
            type: 'testStarted',
            name: 'should execute all test specs'
        }, {
            type: 'testFailed',
            name: 'should execute all test specs',
            message: `Expected ${wantSpecs} specs to finish but got ${haveSpecs}`,
            ...(details ? { details } : {}),
        }, {
            type: 'testFinished',
            name: 'should execute all test specs',
        }, {
            type: 'testSuiteFinished',
            topSuite: true,
            name: 'Test Plan'
        }];
        
        return messages.map(msg => this.formatMessage(msg));
    }
    
    async log(message, level = 'normal') {
        const msg = this.formatMessage({
            type: 'message',
            status: level.toUpperCase(),
            text: (Array.isArray(message) ? message.join(' ') : message),
        });
        
        return this.printLog(msg);
    }
    
    async logError(prefix, e) {
        const msg = this.formatMessage({
            type: 'message',
            status: 'ERROR',
            text: `${prefix}: ${e.message}`,
            errorDetails: e.stack,
        });
        
        return this.printLog(msg);
    }
    
    async finish(prefix, error) {
        clearTimeout(this.keepaliveTimer);
        clearTimeout(this.testStartTimer);
        
        if (this.finished) {
            return;
        }
        
        this.finished = true;
        
        if (error) {
            if (this.enforceTestPlan) {
                /* eslint-disable indent */
                const totalSpecs = this.finishPlan  ? this.finishPlan.totalSpecs
                                 : this.initialPlan ? this.initialPlan.totalSpecs
                                 :                    0
                                 ;
                /* eslint-enable indent */
                
                const finishedSpecs =
                    this.finishPlan ? this.finishPlan.finishedSpecs : this.specsFinished;
                
                // It is perfectly possible that a driver error happened after the browser
                // has finished test run successfully, so check before failing
                if (finishedSpecs < totalSpecs) {
                    await this.printMessage(this.formatFailedPlan(totalSpecs, finishedSpecs));
                }
            }
            
            await this.logError(`Task ${this.name} finishing with an error, ${prefix}`, error);
        }
        else {
            await this.log(`Task ${this.name} finishing successfully`);
        }
        
        if (this.sauceLabs && this.sauceLabs.user && this.sauceLabs.key) {
            try {
                const { user, key } = this.sauceLabs;
                const passed = !error;
                
                await request({
                    uri: `https://saucelabs.com/rest/v1/${user}/jobs/${this.id}`,
                    method: 'PUT',
                    auth: {
                        user: user,
                        pass: key,
                    },
                    body: {
                        passed: passed,
                        ...(this.build ? { build: this.build } : {}),
                    },
                    json: true,
                });
                
                await this.log(`Task ${this.name} successfully updated ` +
                               `SauceLabs job status to ${passed ? 'PASSED' : 'FAILED'}`);
            }
            catch (e) {
                await this.logError(`Task ${this.name} received error while updating ` +
                                    `SauceLabs job status`, e);
            }
        }
        
        try {
            await this.driver.quit();
        }
        catch (e) {
            await this.logError(`Task ${this.name} received error while closing ` +
                                `WebDriver session`, e);
        }
        finally {
            this.finishCallback({
                suitesFinished: this.suitesFinished,
                specsFinished: this.specsFinished,
            });
        }
    }
}
    
module.exports = Task;
