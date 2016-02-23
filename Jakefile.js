/* globals jake:false, desc:false, task:false, complete:false, fail:false */

(function() {
	"use strict";

	var semver = require('semver');
	var jshint = require('simplebuild-jshint');
	var karma = require('simplebuild-karma');

	var KARMA_CONFIG = 'karma.conf.js';

	//**** General-purpose tasks

	desc('Start the Karma server (run this first)');
	task('karma', function() {
		console.log('Starting Karma server:');

		karma.start({
			configFile: KARMA_CONFIG
		}, complete, fail);
	}, { async: true });

	desc("Default build");
	task("default", ["version", "lint", 'test'], function() {
		console.log("\n\nBUILD OK");		
	});

	desc("Run a localhost server");
	task("run", function() {
		jake.exec("node node_modules/http-server/bin/http-server src", { interactive: true }, complete);
		console.log("Run http-server here");
	}, { async: true });

	//**** Supporting Tasks */

	desc("Check Node version");
	task("version", function() {
		console.log("Checking Node version: .");

		var packageJson = require('./package.json');
		var expectedVersion = packageJson.engines.node;

		var actualVersion = process.version;
		if (semver.neq(expectedVersion, actualVersion)) {
			fail("Incorrect Node version: expected " + expectedVersion + ", but was " + actualVersion);
		}
	});
 
	desc("Lint Javascript code");	
	task("lint", function() {
		process.stdout.write("Linting Javascript: ");

		jshint.checkFiles({
			files: [ "Jakefile.js", "src/**/*.js" ],
			options: lintOptions(),
			globals: lintGlobals()
		}, complete, fail);

	}, { async: true });

	desc('Run tests');
	task('test', function() {
		console.log('Testing Javascript:');

		karma.run({
			configFile: KARMA_CONFIG,
			expectedBrowsers: [
				'Chrome 48.0.2564 (Mac OS X 10.11.3)',
				'Firefox 44.0.0 (Mac OS X 10.11.0)'
			],
			strict: !process.env.loose
		}, complete, fail);
	}, { async: true });

	function lintOptions() {
		return {
			bitwise: true,
			eqeqeq: true,
			forin: true,
			freeze: true,
			futurehostile: true,
			latedef: "nofunc",
			noarg: true,
			nocomma: true,
			nonbsp: true,
			nonew: true,
			strict: true,
			undef: true,

			node: true,
			browser: true
		};
	}

	function lintGlobals() {
		return {
			// Mocha
			describe: false,
			it: false,
			before: false,
			after: false,
			beforeEach: false,
			afterEach: false
		};
	}
}());
