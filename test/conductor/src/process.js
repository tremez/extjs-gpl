'use strict';

const fs = require('fs');
const child_process = require('child_process');

module.exports = (printStdout, printStderr) => {
    const start_process = async (options) => {
        const { path, args, pid_file, timeout, onStdout, onStderr, onClose } = options;
        
        const child = child_process.spawn(path, args);
        child._path = path;
        
        const promised_pid = new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                printStderr(`Timed out waiting for process with pid ${child.pid} to start!`);
                fail();
            }, timeout || 30000);
            
            const cleanup = () => {
                clearTimeout(timer);
                child.removeListener('close', _closeHandler);
                child.removeListener('error', _errorHandler);
            };
            
            const fail = () => {
                cleanup();
                reject();
            };
            
            const _closeHandler = (code) => {
                printStderr(`ERROR: Process ${child.pid} failed to start, code: ${code}`);
                fail();
            };
            
            const _errorHandler = (error) => {
                printStderr(`ERROR: Process ${child.pid} failed to execute: ${error}`);
                fail();
            };
            
            // fs.watchFile fails to fire listeners consistently between OS X and Linux,
            // and much lauded Chokidar fails to fire events at all.
            // This is absolutely ridiculous but I just can't find a reliable way
            // to watch a pid file other than manually polling stat... ¯\_(ツ)_/¯
            const _pidWatcher = () => {
                try {
                    // Sync is ok here, we're blocking until process is started anyway
                    const stats = fs.statSync(pid_file);
                    
                    if (stats.ino !== 0 && stats.mode !== 0) {
                        cleanup();
                        resolve();
                        
                        return;
                    }
                }
                catch (e) {
                    // Might not exist yet
                    if (e.code !== 'ENOENT') {
                        printStderr(
                            `ERROR: Failed to read pid file for process ${child.pid}: ${e}`
                        );
                        
                        fail();
                        
                        return;
                    }
                }
                
                setTimeout(_pidWatcher, 100);
            };
            
            // These are one-time startup handlers
            child.once('error', _errorHandler);
            child.once('close', _closeHandler);
            
            // We do fast polling because process is expected to start quickly
            setTimeout(_pidWatcher, 100);
        });
        
        // We always add listeners on stdout and stderr to consume child process output.
        // Not doing so might cause it to block on pipe write.
        child.stdout.on('data', (data) => {
            if (onStdout) {
                onStdout(data.toString());
            }
        });
        
        child.stderr.on('data', (data) => {
            if (onStderr) {
                onStderr(data.toString());
            }
        });
        
        await promised_pid;
        
        // We use close vs exit here to capture all child output.
        child._onClose = onClose;
        child.once('close', onClose);
        
        return child;
    };
    
    const stop_process = async (child, timeout) => {
        if (child.killed) {
            printStderr(`Process ${child.pid} is already stopped!`);
            
            return true;
        }
        
        child.removeListener('close', child._onClose);
        child._onClose = null;
        
        const pid = child.pid;
        
        try {
            process.kill(child.pid, 0);
        }
        catch (e) {
            return true;
        }
        
        const killed = new Promise((resolve, reject) => {
            let timer;
            
            const levels = [{
                desc: 'stop gracefully', signal: 'SIGTERM',
            }, {
                desc: 'stop again', signal: 'SIGKILL',
            }, {
                desc: 'stop for real! Giving up',
            }];
            
            const waitForIt = (level) => {
                timer = setTimeout(() => {
                    if (child.killed) {
                        return true;
                    }
                    
                    const { desc, signal } = levels[level];
                    
                    if (desc) {
                        printStderr(`Timed out waiting for process with pid ${pid} to ` +
                                    `${desc}.` + (signal ? ` Trying ${signal}...` : ''));
                    }
                    
                    if (signal) {
                        waitForIt(level + 1);
                        process.kill(pid, signal);
                    }
                    else {
                        fail();
                    }
                }, timeout || 30000);
            };
            
            const cleanup = () => {
                clearTimeout(timer);
                child.removeListener('error', _errorHandler);
            };
            
            const fail = () => {
                cleanup();
                reject();
            };
            
            child.once('close', () => {
                cleanup();
                resolve();
            });
            
            let _errorHandler = (err) => {
                printStderr(`Failed to kill process with pid ${pid}` +
                            (err ? `: ${err}.` : '.') + " Trying SIGKILL...");
                
                // This *should not* happen but...
                _errorHandler = () => {
                    printStderr(`Failed to kill process with pid ${pid} ` +
                                `with SIGKILL! Giving up.`);
                    fail();
                };
                
                child.once('error', _errorHandler);
                
                process.kill(pid, 'SIGKILL');
            };
            
            child.once('error', _errorHandler);
            
            waitForIt(0);
            process.kill(pid, 'SIGINT');
        });
        
        await killed;
        
        return true;
    };

    return {
        start_process,
        stop_process,
    };
};
