'use strict';

const Queue = require('d3-queue');
const Task = require('./task');

module.exports = (options, printStdout, printStderr) => {
    return async (app) => {
        let queue, abortReason;
        
        const abortQueue = (cb) => {
            if (queue) {
                queue.abort();
            }
            
            // Need to check because queue might be aborted from outside of this scope,
            // e.g. when a child process dies.
            if (typeof cb === 'function') {
                cb();
            }
        };
        
        // Not doing this might leave the process hanging by pid
        // until killed dead. We only want to catch signals to ensure
        // clean shutdown, not block them forever.
        const _cleanupSignals = () => {
            process.removeListener('SIGHUP', _hupHandler);
            process.removeListener('SIGINT', _intHandler);
            process.removeListener('SIGTERM', _termHandler);
        };
        
        const _handleSignal = async (signal) => {
            abortReason = `Received ${signal}`;
            await printStderr(`${abortReason}. Aborting queue.`);
            abortQueue(_cleanupSignals);
        };
        
        // We need to log the signal name, it might be useful for troubleshooting test runs.
        const _hupHandler = () => { _handleSignal('SIGHUP') };
        const _intHandler = () => { _handleSignal('SIGINT') };
        const _termHandler = () => { _handleSignal('SIGTERM') };
        
        process.on('SIGHUP', _hupHandler);
        process.on('SIGINT', _intHandler);
        process.on('SIGTERM', _termHandler);
        
        // Options object is mutable by design.
        options.printStdout = printStdout;
        options.printStderr = printStderr;
        options.abort = abortQueue;
        
        // Not configurable
        const sessionURI = '/_session/:sessionId/:messageType';
        options.sessionLocation = '/_session/';
        
        const withTunnel = require('./tunnel');
        const withStatic = require('./static');
        const readSuites = require('./suites');
        
        const server = withTunnel(withStatic(app, options), options);
        const { preTest, chunks } = await readSuites(options);
        
        const taskBySession = {};
        
        server.post(sessionURI, async (req, res) => {
            const { sessionId, messageType } = req.params;
            const task = taskBySession[sessionId];
            
            if (!task) {
                await printStderr(`ERROR: Received request for invalid session: ${sessionId}`);
                res.sendStatus(404);
            }
            
            if (messageType === 'command') {
                try {
                    await task.driverCommand(req.body);
                    res.sendStatus(200);
                }
                catch (e) {
                    await printStderr(`Error executing driver command: ` +
                                      `${e}\n${JSON.stringify(req.body)}`);
                    res.sendStatus(500);
                }
            }
            else {
                const success = await task.processMessages(req.body);
                
                res.sendStatus(success ? 200 : 500);
            }
        });
        
        server.listen(options.listenPort, async () => {
            await printStdout(`Started test runner server on port ${options.listenPort}`);
            
            let scheduled, completed, total;
                
            delete options.abort;
            
            // D3 queue is synchronous so we have to work around it.
            const aborted = [];
            
            const runQueue = async (desc, chunks, queueCallback) => {
                scheduled = completed = 0;
                total = chunks.length;
                
                if (!chunks.length) {
                    setImmediate(queueCallback);
                    return;
                }
                
                await printStdout(`Got ${total} chunks in ${desc} queue, ` +
                                  `dispatching max ${options.concurrency} sessions`);
            
                chunks.forEach(chunk => {
                    if (chunk.withSauceConnect && !options.sauceConnectStarted) {
                        return;
                    }
                    
                    queue.defer((finishCallback) => {
                        // We need to create the task object and return a closure
                        // with its `abort` method so that queue could handle it
                        // (it doesn't believe in Promises). The actual setup/run
                        // process can (and should) be handled asynchronously because
                        // we don't want any significant activity to happen synchronously
                        // at this point. The queue is already running full steam,
                        // test results are coming in, etc.
                        const task = new Task({
                            ...options,
                            ...chunk,
                            printMessage: printStdout,
                            printLog: printStderr,
                        });
                        
                        (async () => {
                            await printStdout(`Setting up job for ${task.name}`);
                            
                            const cb = async (results) => {
                                completed++;
                                
                                await printStdout(`Job ${task.name} completed, removing from queue`);
                                
                                finishCallback(null, results);
                            };
                            
                            // This split into setup/run is a bit awkward but we need session id
                            // to generate callback URLs and this id is not available until
                            // WebDriver instance is allocated (which might take a lot of time).
                            // Moving callback URL logic into the Task would feel even worse.
                            const sessionId = await task.setup(cb);
                            taskBySession[sessionId] = task;
                        
                            const commandURL = sessionURI.replace(/:sessionId/, sessionId)
                                                         .replace(/:messageType/, 'command');
                            const resultURL = sessionURI.replace(/:sessionId/, sessionId)
                                                        .replace(/:messageType/, 'results');
                            
                            task.run(commandURL, resultURL);
                        })();
                        
                        scheduled++;
                        
                        return {
                            // task.abort is async, it returns a Promise
                            abort: () => aborted.push(task.abort(abortReason))
                        };
                    });
                });
                
                queue.awaitAll(queueCallback);
            };
            
            queue = Queue.queue(options.concurrency);
            
            runQueue('pre-test', preTest, (error, results) => {
                let exitCode = 0;
                
                const finishRun = () => {
                    server.close(async () => {
                        await printStdout(`Exiting now with code ${exitCode}.`);
                        process.exit(exitCode);
                    });
                };
                
                if (!error) {
                    queue = Queue.queue(options.concurrency);
                    
                    runQueue('main', chunks, async (error, results) => {
                        if (aborted.length) {
                            await printStderr(`Waiting for ${aborted.length} aborted ` +
                                             `job${aborted.length !== 1 ? 's' : ''} ` +
                                             `to finish...`);
                            await Promise.all(aborted);
                        }
                        
                        if (error) {
                            await printStderr(`Queue run failed with error: ${error}. ` +
                                             `${completed} jobs were completed out of ` +
                                             `${scheduled}.`);
                            exitCode = 1;
                        }
                        else {
                            await printStdout(`Queue completed ${completed} jobs of total ${total}.`);
                        }
                        
                        const res = (results || []).reduce(
                            (acc, res) => ({
                                suitesFinished: acc.suitesFinished + res.suitesFinished,
                                specsFinished: acc.suitesFinished + res.specsFinished,
                            }),
                            {
                                suitesFinished: 0,
                                specsFinished: 0,
                            }
                        );
                        
                        await printStdout(`Queue results: finished ${res.specsFinished} ` +
                                          `test specs in ${res.suitesFinished} suites.`);
                        
                        finishRun();
                    });
                }
                else {
                    finishRun();
                }
            });
        });
    };
};
