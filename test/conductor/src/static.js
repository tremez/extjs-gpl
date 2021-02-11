'use strict';

const fs = require('fs');

// Nginx has a nasty habit of trying to open error_log at hardcoded path immediately
// after starting, before any configuration kicked in. This path usually is not
// world-writable so Nginx will complain loudly.
// It is also _ridiculously_ verbose. Srsly, [error] log entry on every ENOENT?
const stderr_filter_re = new RegExp(
    '^[^\\[]+' +
        '(?:' +
            '(?:\\[alert\\] could not open error log file)' +
        '|' +
            '(?:\\[\\w+\\].*?open\\(\\).*?failed \\(2\\: No such file)' +
        ')'
);

module.exports = (app, options) => {
    const { printStdout, printStderr, abort } = options;
    const { start_process, stop_process } = require('./process')(printStdout, printStderr);
    const pid_file = `/tmp/nginx-${process.pid}.pid`;
    
    const start_nginx = async (options) => {
        const { path, args, timeout } = options.nginx;
        const conf_text = get_nginx_conf(options, pid_file);
        
        // Node fs is missing mkstemp
        const nginx_conf = `/tmp/nginx-${process.pid}.conf`;
        
        fs.writeFileSync(nginx_conf, conf_text);
        
        await printStdout(`Starting Nginx process from ${path}...`);
        
        const nginx = await start_process({
            path: path,
            args: ['-c', nginx_conf, ...(args || [])],
            
            pid_file,
            timeout,
            
            // We don't really want stdout (and it shouldn't happen anyway)
            onStdout: () => {},
            
            onStderr: (lines) => {
                lines.split('\n').forEach(line => {
                    if (line !== '' && !stderr_filter_re.test(line)) {
                        // We don't need to wait until this is printed
                        printStderr(`Nginx stderr output: ${line}`);
                    }
                });
            },
            
            onClose: (code) => {
                if (code > 0) {
                    printStderr(`Nginx process quit unexpectedly with code ${code}!`);
                    abort();
                }
            },
        });
        
        if (fs.existsSync(nginx_conf)) {
            fs.unlinkSync(nginx_conf);
        }
        
        return nginx;
    };
    
    const stop_nginx = async (nginx) => {
        await printStdout(`Stopping Nginx process with pid ${nginx.pid}...`);
        await stop_process(nginx);
        
        if (fs.existsSync(pid_file)) {
            fs.unlinkSync(pid_file);
        }
    };

    let nginx;
    
    const appListen = app.listen;
    const appClose = app.close;
    
    app.listen = async (port, cb) => {
        if (options.nginx.path) {
            await printStdout(`Using Nginx server in reverse proxy configuration, ` +
                              `document root at ${options.staticRoot}`);
            
            try {
                nginx = await start_nginx(options);
            }
            catch (e) {
                await printStderr(`Failed to start Nginx server. Falling back to ` +
                                  `Express server with document root at ${options.staticRoot}`);
                options.listenPort = port;
            }
        }
        else {
            await printStdout(`Using Express static server with document root ` +
                              `at ${options.staticRoot}`);
        }
        
        if (!nginx) {
            const express = require('express');
            app.use(express.static(options.staticRoot));
        }
        
        try {
            appListen.call(app, options.listenPort, cb);
        }
        catch (e) {
            await printStderr("Failed to start Express server" +
                              (e ? `: ${e.message}!` : "!"));
            
            abort(e);
        }
    };
    
    app.close = async (cb) => {
        if (nginx) {
            try {
                await stop_nginx(nginx);
            }
            catch (e) {
                await printStderr("Error stopping Nginx process" +
                                  (e ? `: ${e.message}!` : "!"));
            }
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

// Keep it down for readability but hoist so it's visible from above
// eslint-disable-next-line vars-on-top
var get_nginx_conf = (options, pid_file) => {
    if (!options.listenHost || !options.listenPort) {
        throw new Error("listenHost and listenPort options are mandatory!");
    }
    
    if (options.listenPort < 1025) {
        throw new Error("listenPort should be greater than 1024!");
    }
    
    if (!options.staticRoot) {
        throw new Error("staticRoot option is mandatory!");
    }
    
    if (!options.sessionLocation) {
        throw new Error("sessionLocation option is missing!");
    }
    
    const nginxHost = options.listenHost;
    const nginxPort = options.listenPort;
    
    // TODO Use unix sockets instead, they're somewhat faster
    options.listenHost = '127.0.0.1';
    options.listenPort = nginxPort + 10000;
    
    const postBodyLimit = (options.postBodyLimit || '10mb')
                          .replace(/mb/i, 'M')
                          .replace(/kb/i, 'k');
    
    return `\
error_log stderr crit;
pid ${pid_file};
daemon off;

master_process off;
worker_processes 1;

events {
    worker_connections 1024;
}

http {
    types {
        text/html                             html htm shtml;
        text/css                              css;
        text/xml                              xml;
        text/plain                            txt;
        image/gif                             gif;
        image/jpeg                            jpeg jpg;
        application/javascript                js;
        application/json                      json;
        image/png                             png;
        image/x-icon                          ico;
        image/x-ms-bmp                        bmp;
        image/svg+xml                         svg svgz;
        application/font-woff                 woff;
        application/java-archive              jar war ear;
        application/msword                    doc;
        application/pdf                       pdf;
        application/postscript                ps eps ai;
        application/rtf                       rtf;
        application/vnd.ms-excel              xls;
        application/vnd.ms-fontobject         eot;
        application/vnd.ms-powerpoint         ppt;
        application/vnd.google-earth.kml+xml  kml;
        application/vnd.google-earth.kmz      kmz;
        application/x-shockwave-flash         swf;
        application/x-x509-ca-cert            der pem crt;
        application/x-xpinstall               xpi;
        application/xhtml+xml                 xhtml;
        application/zip                       zip;
        application/octet-stream              bin exe dll;
        application/vnd.openxmlformats-officedocument.wordprocessingml.document    docx;
        application/vnd.openxmlformats-officedocument.spreadsheetml.sheet          xlsx;
        application/vnd.openxmlformats-officedocument.presentationml.presentation  pptx;
        audio/mpeg                            mp3;
        audio/ogg                             ogg;
        video/mp4                             mp4;
        video/mpeg                            mpeg mpg;
        video/x-m4v                           m4v;
    }
    
    default_type application/octet-stream;
    
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 120;
    
    gzip on;
    gzip_http_version 1.1;
    gzip_types text/plain text/css text/xml text/javascript
               application/javascript application/json application/xml
               application/font-woff application/vnd.ms-fontobject
               application/xhtml+xml image/svg+xml;
    
    access_log off;
    
    server {
        listen ${nginxHost}:${nginxPort} default_server;
        server_name static;
        
        access_log off;
        error_log stderr error;
        
        client_body_buffer_size ${postBodyLimit};
        client_max_body_size ${postBodyLimit};
        
        location / {
            root ${options.staticRoot};
            index index.html index.htm;
        }
        
        location ${options.sessionLocation} {
            proxy_set_header   X-Real-IP  $remote_addr;
            proxy_set_header   Host       $http_host;
            proxy_set_header   Connection "";
            proxy_http_version 1.1;
            proxy_pass http://${options.listenHost}:${options.listenPort}${options.sessionLocation};
            keepalive_timeout 300;
            proxy_send_timeout 300;
            proxy_read_timeout 300;
            send_timeout 300;
        }
    }
}
`;
};
