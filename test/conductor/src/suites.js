'use strict';

const fs = require('fs');
const path = require('path');

const chunkify = (options) => {
    const runName = options.name;
    const { build, tags } = options;
    const topPath = path.dirname(options.testSuites);
    
    return (suite) => {
        let caps = suite.capabilities;
        
        if (typeof caps === 'string') {
            const text = fs.readFileSync(path.resolve(topPath, suite.capabilities));
            caps = JSON.parse(text);
        }
        
        // eslint-disable-next-line no-unused-vars
        let totalChunks = 0;
        const suiteChunks = [];
        
        caps.forEach(cap => {
            const {
                withSauceConnect, skipAllTests, remoteOptions, pingTimeout,
                testStartTimeout
            } = cap;
            
            delete cap.withSauceConnect;
            delete cap.skipAllTests;
            delete cap.remoteOptions;
            delete cap.pingTimeout;
            delete cap.testStartTimeout;
            
            const addChunk = (chunk, chunks) => {
                const displayName = cap.displayName ||
                        `${cap.platform}@${cap.browserName}@${cap.version}`;
                
                const buildName = runName + (build ? ` build ${build}` : '');
                
                // 1-based "x of y" is much easier to comprehend than
                // technically correct 0-based
                const taskName = `${buildName} ${suite.name}: ${displayName}` +
                                 (chunks > 0 ? ` ${chunk + 1} of ${chunks}` : '');
                
                suiteChunks.push({
                    page: cap.page || suite.page,
                    chunk,
                    chunks,
                    name: taskName,
                    suitePrefix: `${displayName}: ${suite.name}: `, // Historical
                    ...(build ? { build } : {}),
                    ...(withSauceConnect ? { withSauceConnect } : {}),
                    ...(skipAllTests ? { skipAllTests } : {}),
                    ...(pingTimeout ? { pingTimeout } : {}),
                    ...(testStartTimeout ? { testStartTimeout } : {}),
                    browserCapabilities: {
                        ...(options.sessionOptions || {}),
                        ...cap,
                        // These properties are not exactly capabilities
                        // but they are logged in session metadata.
                        // Comes handy sometimes to verify which session was which
                        // in case of runner failures.
                        name: taskName,
                        chunk,
                        chunks,
                        ...(tags && tags.length ? { tags } : {}),
                    },
                    runnerOptions: {
                        ...(options.remoteOptions || {}),
                        ...(remoteOptions || {}),
                    },
                });
    
                totalChunks++;
            };
            
            if ('chunks' in cap) {
                const chunks = +cap.chunks;
                
                for (let chunk = 0; chunk < chunks; chunk++) {
                    addChunk(chunk, chunks);
                }
            }
            else {
                addChunk(0, 0);
            }
        });
        
        return suiteChunks;
    };
};

module.exports = async (options) => {
    const { printStdout, printStderr, abort } = options;
    
    const testConfig = JSON.parse(fs.readFileSync(options.testSuites));
    
    const preTest = testConfig['pre-test'] ? testConfig['pre-test'] : [];
    const suites = Array.isArray(testConfig) ? testConfig : testConfig.suites;
    
    if (!Array.isArray(suites)) {
        await printStderr("Expected array of test suites or an object with 'suites' property!");
        abort();
    }
    
    const preTestChunks = preTest.map(chunkify(options));
    const chunks = suites.map(chunkify(options));
    
    await printStdout(`Total ${chunks.length} chunks in ${suites.length} test suite(s)`);
    
    return {
        preTest: [].concat(...preTestChunks),
        chunks: [].concat(...chunks),
    };
};
