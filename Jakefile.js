(function() {
	"use strict";

	var semver = require('semver');

	desc("Default build");
	task("default", ["version", "lint"], function() {
		console.log("\n\nBUILD OK");		
	});

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
		console.log("Linting Javascript: .");

		jake.exec("node node_modules/jshint/bin/jshint Jakefile.js", { interactive: true }, complete);
	}, { async: true });
}());
