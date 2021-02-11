'use strict';

const fs = require('fs');

module.exports = (app, options) => {
    if (!options.sauceConnect.path) {
        return app;
    }
    
    const sauceLabs = options.sauceLabs;
    
    if (!sauceLabs || !sauceLabs.user || !sauceLabs.key) {
        throw new Error("Sauce Connect requires username and password!");
    }
    
    const { printStdout, printStderr, abort } = options;
    const { start_process, stop_process } = require('./process')(printStdout, printStderr);
    const pid_file = `/tmp/sauceconnect-${process.pid}.pid`;
    let sc_output = [];

    const start_tunnel = async (options) => {
        const { path, timeout } = options.sauceConnect;
        
        await printStdout(`Starting SauceConnect process from ${path}...`);
        
        return await start_process({
            ...options.sauceConnect,
            args: [
                '-u', options.sauceLabs.user,
                '-k', options.sauceLabs.key,
                '-t', options.publicHost,
                '--readyfile', pid_file,
                '-l', '/dev/null', // SauceConnect is verbose to the point of slowing down!
                ...(options.sauceConnect.args || []), // allow to override from command line
            ],
            
            timeout,
            pid_file,
            
            // There shouldn't be anything interesting on stdout but we collect it
            // for diagnostic purposes
            onStdout: (lines) => {
                sc_output = [].concat(sc_output, lines);
            },
            
            onStderr: (lines) => {
                printStderr(`SauceConnect stderr: `, lines);
            },
            
            onClose: (code) => {
                printStderr(`SauceConnect process quit unexpectedly with code ${code}. ` +
                            `Aborting tests.`);
                abort();
            }
        });
    };
    
    const stop_tunnel = async (sc) => {
        await printStdout(`Stopping SauceConnect process with pid ${sc.pid}...`);
        await stop_process(sc);
        
        if (fs.existsSync(pid_file)) {
            fs.unlinkSync(pid_file);
        }
    };
    
    let sauceConnect;
    
    const appListen = app.listen;
    const appClose = app.close;
    
    app.listen = async (port, cb) => {
        try {
            const host = options.publicHost;
            
            // If there are dots in publicHost we assume it's either IP address
            // or fully qualified host name. Neither will work with SauceConnect.
            if (!/^localhost/.test(host) && host.indexOf('.') > -1) {
                // We can't use `localhost` for publicHost because some host OS
                // define `localhost` for both IPv4 127.0.0.1 and IPv6 ::1,
                // and some browsers (Safari!) will optimistically try to use IPv6 first.
                // SauceConnect listens on 127.0.0.1 so trying ::1 results in
                // confusing "Cannot connect to server" errors.
                options.publicHost = 'localhost.localdomain';
            }
            
            sauceConnect = await start_tunnel(options);
            
            // If we get here then SauceConnect has started. We need to change
            // connection options because tunnel configuration is different.
            options.publicPort += 10000; // To avoid collisions with 8888 and such
            options.listenPort = options.publicPort;
            options.hub = `http://${sauceLabs.user}:${sauceLabs.key}@localhost:4445/wd/hub`;
            options.disableCacheBuster = true;
            options.sauceConnect.args.push('-t', options.publicHost);
            options.sauceConnectStarted = true;
            
            appListen.call(app, options.listenPort, cb);
        }
        catch (e) {
            await printStderr("Error starting SauceConnect process" +
                              (e ? `: {e.message}` : '!'));
            await printStderr("SauceConnect diagnostic output:\n" + sc_output.join("\n"));
            
            // If SauceConnect was requested but we can't start it, full stop.
            process.exit(1);
        }
    };
    
    app.close = async (cb) => {
        try {
            await stop_tunnel(sauceConnect);
        }
        catch (e) {
            await printStderr("Error stopping SauceConnect process" +
                              (e ? `: ${e.message}` : '!'));
        }
        
        if (appClose) {
            appClose.call(app, cb);
        }
        else if (cb) {
            cb();
        }
    };
    
    return app;
};
