'use strict';

const url = require('url');
const fs = require('fs');
const getopt = require('commander');

const defaults = {
    nginx: {
        args: [],
        timeout: 10000, // Nginx is fast!
    },
    sauceConnect: {
        args: [
            '--no-autodetect',
            '--no-remove-colliding-tunnels',
        ],
        timeout: 180000,
    },
    sessionOptions: {
        'public': 'team',
        maxDuration: 1200,
        idleTimeout: 1200,
        commandTimeout: 480,
        seleniumVersion: "3.141.59",
        extendedDebugging: true,
    },
    sessionTags: [],
};

const parseArgs = (args, defaults) => [
    ...(defaults || []),
    ...(args.split(' ')),
];

const parseJsonOpts = (str, defaults) => {
    try {
        const opts = JSON.parse(str);
        
        return { ...defaults, ...opts };
    }
    catch (e) {
        throw new Error(`Cannot parse --session-options: ${e}`);
    }
};

const options = [
    ['--name <run name>', 'Name for this test run', /.*/, 'Test run'],
    ['--build <build #>', 'Build number to display in run stats (optional)', /.*/],
    ['--tag <tag>', 'Session tag (optional, can be repeated)', parseArgs, defaults.sessionTags],
    ['--hub <url>', 'WebDriver hub to use', /.*/, 'http://localhost:4444/wd/hub'],
    ['--listen-host <hostname>', 'Host name or IP address to listen on', /.*/, '*'],
    ['--listen-port <port>', 'Port number to listen on', v => +v, 8888],
    ['--public-host <hostname>', 'Host name or IP address to use in test subject URLs',
     /.*/, 'localhost'],
    ['--public-port <port>', 'Port number to use in test subject URLs', v => +v],
    ['--concurrency <number>', 'Max number of concurrent sessions', v => +v, 0],
    ['--ping-interval <ms>', 'Interval between browser keepalive pings', v => +v, 30000],
    ['--ping-timeout <ms>', 'Browser ping timeout', v => +v, 30000],
    ['--test-start-timeout <ms>', 'Interval to wait for tests to start in browser',
     v => +v, 300000],
    ['--static-root <path>', 'Path to static document root directory', v => fs.realpathSync(v)],
    ['--nginx-path <path>', 'Path to Nginx binary', v => fs.realpathSync(v)],
    ['--nginx-args <string>', 'Additional Nginx command line arguments (in quotes)',
     parseArgs, defaults.nginx.args],
    ['--nginx-timeout <ms>', 'Time to allow Nginx to start', v => +v, defaults.nginx.timeout],
    ['--sauce-connect-path <path>', 'Path to SauceConnect binary', v => fs.realpathSync(v)],
    ['--sauce-connect-args <string>', 'Additional SauceConnect command line arguments (in quotes)',
     parseArgs, defaults.sauceConnect.args],
    ['--sauce-connect-timeout <ms>', 'Time to allow SauceConnect to start', v => +v,
     defaults.sauceConnect.timeout],
    ['--session-options <json>', 'Additional session options (JSON string)',
     parseJsonOpts, defaults.sessionOptions],
    ['--enforce-test-plan', 'Track planned vs executed test specs and fail on mismatch'],
];

module.exports = (printStdout, printStderr) => {
    getopt
        .version('0.1.0', '-v, --version')
        .usage('[options] <path to test definitions>');
    
    options.forEach(option => getopt.option.apply(getopt, option));
    
    getopt.parse(process.argv);
    
    const opt = getopt.opts();
    
    if (process.env.TEST_RUN_NAME) {
        opt.name = process.env.TEST_RUN_NAME;
    }
    
    if (process.env.TEST_RUN_BUILD) {
        opt.build = process.env.TEST_RUN_BUILD;
    }
    
    if (process.env.TEST_RUN_TAGS) {
        opt.tag = parseArgs(process.env.TEST_RUN_TAGS, defaults.sessionTags);
    }
    
    opt.tags = opt.tag;
    delete opt.tag;
    
    opt.sauceLabs = opt.sauceLabs || {};
    opt.sauceConnect = opt.sauceConnect || {};
    opt.nginx = opt.nginx || {};
    
    if (opt.sauceConnectPath) {
        opt.sauceConnect.path = opt.sauceConnectPath;
    }
    
    if (opt.sauceConnectArgs) {
        opt.sauceConnect.args = [
            ...(opt.sauceConnect.args || []),
            ...opt.sauceConnectArgs,
        ];
    }
    
    if (opt.sauceConnectTimeout) {
        opt.sauceConnect.timeout = opt.sauceConnectTimeout;
    }
    
    if (opt.nginxPath) {
        opt.nginx.path = opt.nginxPath;
    }
    
    if (opt.nginxArgs) {
        opt.nginx.args = [
            ...(opt.nginx.args || []),
            ...opt.nginxArgs,
        ];
        
    }
    
    if (opt.nginxTimeout) {
        opt.nginx.timeout = opt.nginxTimeout;
    }
    
    delete opt.sauceConnectPath;
    delete opt.sauceConnectArgs;
    delete opt.sauceConnectTimeout;
    delete opt.nginxPath;
    delete opt.nginxArgs;
    delete opt.nginxTimeout;
    
    if (opt.publicPort == null) {
        opt.publicPort = opt.listenPort;
    }
    
    if ((!opt.sauceLabs.user || !opt.sauceLabs.key) && /saucelabs/.test(opt.hub)) {
        const { auth } = url.parse(opt.hub);
        
        if (auth) {
            const [user, key] = auth.split(':');
            
            opt.sauceLabs = opt.sauceLabs || {};
            opt.sauceLabs.user = user;
            opt.sauceLabs.key = key;
        }
    }
    
    if (/saucelabs/.test(opt.hub) && (!opt.sauceLabs.user || !opt.sauceLabs.key)) {
        printStderr("\nSauceLabs configuration requires username and key.");
        getopt.help();
    }
    
    if (opt.sauceConnect.path && (!opt.sauceLabs.user || !opt.sauceLabs.key)) {
        printStderr("\nSauceConnect requires SauceLabs username and key.");
        getopt.help();
    }
    
    if (!opt.staticRoot) {
        printStderr("\nPath to static document root is required!");
        getopt.help();
    }
    
    if (!(opt.concurrency > 0)) {
        printStderr("\nConcurrency argument is required!");
        getopt.help();
    }
    
    opt.testSuites = getopt.args.shift();
    
    if (!opt.testSuites) {
        printStderr("\nPath to test suite definition is required as last argument!");
        getopt.help();
    }
    
    return opt;
};
