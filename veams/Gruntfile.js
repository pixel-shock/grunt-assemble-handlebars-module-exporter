/*
 * Generated on 2016-03-10
 * generator-veams v6.5.0
 * http://veams.org/
 *
 * Copyright (c) 2016 Sebastian Fitzner
 * Licensed under the MIT license.
 */

'use strict';

/*
 * PERFORMANCE
 *
 * 1. For performance reasons you should only matching one level down, if possible.
 * 2. Try to keep your watch task clean. Do NOT watch everything (like icons).
 * 3. Add "spawn: false" to your watch task when you need to speed up your build.
 *
 */

var config = require('./helpers/config');

module.exports = function(grunt) {

	// load only used tasks and add fallbacks for those which cannot be find
	require('jit-grunt')(grunt, {
		'replace': 'grunt-text-replace',
		'assemble-handlebars-module-exporter': '../tasks/assemble-handlebars-module-exporter.js'
	});
	// measures the time each task takes
	require('time-grunt')(grunt);

	// Load grunt configurations automatically
	var configs = require('load-grunt-configs')(grunt, config.options);

	// Define the configuration for all the tasks
	grunt.initConfig(configs);

	/*
	 *	SIMPLE TASKS
	 */

	// SASS Task
	grunt.registerTask('watchCSS', [
		'sassGlobber:dev',
		'sass:dev'
	]);

	// Sprites Task
	grunt.registerTask('icons', [
		'dr-svg-sprites',
		'replace:spriteUrl'
	]);


	// Build HTML Task
	grunt.registerTask('build-html', [
		'assemble'
	]);

	/*
	 *	ADVANCED TASKS
	 */
	grunt.registerTask('server', [
		'newer:assemble',
		'concurrent:syncing',
		'watchCSS',
		'connect:livereload',
		'watch'
	]);

	grunt.registerTask('build', [
		'clean:dev',
		'concurrent:syncing',
		'sassGlobber:dist',
		'sass:dev',
		'sass:universal',
		'combine_mq',
		'cssmin',
		'assemble',
		'concurrent:hintAndDocs'
	]);

	grunt.registerTask('default', [
		'server'
	]);

	// alias serve by grunt convention
	grunt.registerTask('serve', [
		'server'
	]);

	grunt.registerTask('export', [
		'assemble-handlebars-module-exporter'
	]);
};