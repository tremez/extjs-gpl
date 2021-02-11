'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const _promisify = (stream) => {
    return async (output) => {
        return new Promise((resolve, reject) => {
            stream.once('error', reject);
            
            if (stream.write(output + '\n')) {
                stream.removeListener('error', reject);
                resolve();
            }
            else {
                stream.once('drain', () => {
                    stream.removeListener('error', reject);
                    resolve();
                });
            }
        });
    };
};

const printStdout = _promisify(process.stdout);
const printStderr = _promisify(process.stderr);

const options = require('./src/options')(printStdout, printStderr);
const run = require('./src/runner')(options, printStdout, printStderr);

options.postBodyLimit = '10mb'; // Ought to be enough for anybody

const app = express();

app.use(bodyParser.json({ limit: options.postBodyLimit }));

run(app);
