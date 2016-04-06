/*
 * grunt-assemble-handlebars-module-exporter
 *
 *
 * Copyright (c) 2016 Wehe, Tino
 * Licensed under the MIT license.
*/

'use strict';

var config = require('./grunt-tasks/config');

module.exports = function(grunt) {

	require('jit-grunt')(grunt);
	require('time-grunt')(grunt);

	var configs = require('load-grunt-configs')(grunt, config.options);
	grunt.initConfig(configs);

	grunt.registerTask( 'test', [
		'jscs:exporter',
		'clean:test-directory',
		'grunt:veams-build',
		'grunt:veams-export',
		'nodeunit:veams-export'
	] );

	grunt.registerTask( 'default', [
		'jscs:exporter'
	] );

};
