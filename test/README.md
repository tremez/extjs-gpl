# Jazzman: a virtuoso test player

## TODOs
* TODO: remove this duplicated code and run code from https://github.com/sencha/jazzman
* TODO: Enhance the jazzman execution so that it's a node binary process, which can be run from command line. It's currently being executed through a node on the command line in the play.sh file. 

## Reference

* https://github.com/sencha/jazzman - Jazzman
* https://github.com/sencha/teamcity-agents/blob/master/README.md#saucelabs - Saucelabs proxy config notes for build agent

## About 
Started as a fork of [Jasmine test framework](https://jasmine.github.io/) 1.x, Jazzman has evolved
to something much more advanced. Besides adding numerous added features, bug fixes, and performance
improvements, Jazzman also includes iframe based environment to execute tests in live browsers
acquired from a cloud provider (we use SauceLabs internally at Sencha).

## Some major differences with Jasmine:

* Full support for Jasmine 1.x pseudo-synchronous API
* Partial support for Jasmine 2.x fully asynchronous API (minor incompatibilities remain TODO)
* Dependency awareness via new topSuite() describe block
* Deferred describe block execution to allow processing and loading test dependencies
* Fully asynchronous result reporting
* Resource allocation and deallocation control
* Focus and keyboard management helpers
* Browser based test page for efficient local development and optimized CI execution
* Node based conductor to run CI tests in the cloud

## TODO

Some features we plan for the future:

* Better Jasmine 2.x API support
* Support for non-browser environments
* NPM package for easier redistribution
