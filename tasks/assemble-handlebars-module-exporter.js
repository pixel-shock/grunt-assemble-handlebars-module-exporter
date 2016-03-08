/*
 * grunt-assemble-handlebars-module-exporter
 *
 *
 * Copyright (c) 2016 Wehe, Tino
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function( grunt ) {

	/**
	 * Generic stuff includes
	 */
	var _			= require( 'lodash' );
	var html		= require( 'html' );
	var minify		= require( 'html-minifier' ).minify;
	var inspect		= require( 'util' ).inspect;
	var findup		= require( 'findup-sync' );
	var path		= require( 'path' );

	/**
	 * Task specific includes
	 */
	var Helper		= require( './lib/helper.js' ).init( grunt );
	var defaults	= require( './lib/defaults.js' ).init( grunt ).options;

	/**
	 * The global Task options
	 * @type {Object}
	 */
	var options		= defaults;

	/**
	 * Backup the current working directory
	 * @type {String}
	 */
	var oldCwd		= process.cwd();

	/**
	 * Register a new MultiTask
	 */
	grunt.registerMultiTask( 'assemble-handlebars-module-exporter', 'A grunt plugin that extracts modules from html markup based on regular expressions', function() { // jscs:ignore maximumLineLength
		/**
		 * Pseudo "cache" for found module source files
		 * @type {Object}
		 */
		var moduleSrcFileCache = {};

		// As grunt isn't able to merge the defaults with the user options in
		// a "deep" way, we're doing it via lodash
		options = _.defaultsDeep( this.options(), defaults );
		// Iterate over all specified file groups.
		this.files.forEach( function( task ) {
			grunt.log.writeln( 'Processing ' + task.src.length + ' file(s) ...' );
			// Delete the old dist directoy of exists
			if ( grunt.file.isDir( task.dist ) === true ) {
				grunt.file.delete( task.dist );
			}
			// Iterate through all src files
			task.src.forEach( function( file ) {
				grunt.log.writeln( 'Processing ' + file.cyan );
				/**
				 * The file content of the src file
				 * @type {String}
				 */
				var fileContent = grunt.file.read( file );
				/**
				 * Minify the fileContent as JS isn't able to search
				 * through multilines
				 * @type {String}
				 */
				var minifiedContent =  minify( fileContent, {
					removeComments: false,
					collapseWhitespace: true
				} ).replace( /\n?\t?\r?/gm, '' );
				/**
				 * The array which holds all found modules
				 * @type {Array}
				 */
				var modules = [];
				/**
				 * Build all regex for each module with exact matching
				 * of "START" AND "END"
				 * @type {Array}
				 */
				var regexs = Helper.buildRegexs( minifiedContent,
													options.moduleStartRegex,
													options.moduleEndSubstitutions );
				// Iterate through all regex and try to find the module markers
				regexs.forEach( function( value ) {
					/**
					 * The whole regex string for the current module
					 * @type {String}
					 */
					var moduleRegexStr = value.startComment + '(.*?)' + value.endComment;
					/**
					 * The regex from the moduleRegexStr
					 * @type {RegExp}
					 */
					var moduleRegex = new RegExp( moduleRegexStr, 'gm' );
					/**
					 * An Array with all found modules
					 * @type {Array}
					 */
					var foundModules = Helper.findModule( minifiedContent, moduleRegex );
					// Iterate through all found modules and push them into
					// the modules array
					for ( var i = 0; i < foundModules.length; i++ ) {
						modules.push( {
							content: html.prettyPrint( foundModules[ i ] ),
							fileName: value.fileName,
							exportAlias: value.exportAlias,
							dependingFiles: value.dependingFiles || []
						} );
					}
				} );
				// Switch back to the original working directory to search for
				// the module files
				grunt.file.setBase( oldCwd );
				// Try to find the source module files
				modules.forEach( function( module, key ) {
					/**
					 * The filepath of the current module
					 * @type {String}
					 */
					var filePath = null;
					// If the module already found, use the pseudo cache
					if ( typeof moduleSrcFileCache[ module.fileName ] !== 'undefined' ) {
						filePath = moduleSrcFileCache[ module.fileName ];
					// Otherwise try to find the module source file
					} else {
						filePath = findup( options.moduleSrc +
											path.sep + '**' + path.sep +
											module.fileName, {
							nocase: true,
							dot: false
						} );
					}
					// If a module source file found, store it into the pseudo
					// cache and normalize the path
					if ( filePath !== null ) {
						moduleSrcFileCache[ module.fileName ] = filePath;
						module.filePath = filePath
											.replace( options.moduleSrc, '' )
											.replace( oldCwd, '' )
											.replace( module.fileName, '' )
										;
					// Otherwise delete the array value
					} else {
						delete modules[ key ];
					}
				} );
				// Change CWD to the dist directory
				grunt.file.setBase( oldCwd );
				// If the dist directory don't exist, create it
				if ( grunt.file.isDir( task.dist ) === false ) {
					grunt.file.mkdir( task.dist );
				}
				// Set the current working directory to the dist directory
				grunt.file.setBase( task.dist );
				// Iterate through all modules, write them into the output
				// file and try to find the depending files
				modules.forEach( function( module ) {
					var extractPath = path.normalize( '.' + module.filePath );
					var exportFileName = path.basename( module.exportAlias,
														path.extname( module.exportAlias ) );
					var filePath = extractPath + exportFileName + path.sep;
					var filePathWithName = path.normalize( filePath +
															exportFileName +
															options.moduleExportExtension );
					// Check if the path exists, if not create it
					if ( grunt.file.isDir( extractPath ) == false ) {
						grunt.file.mkdir( extractPath );
					}
					// Don't overwrite existing files
					if ( grunt.file.isFile( filePath ) == false ) {
						// write the module content to a file
						grunt.file.write( filePathWithName, module.content );
						// always include ALL base dependencies
						if ( options.baseDependencies.options.include === 'always' ) {
							module.dependingFiles = _.concat( options.baseDependencies.files,
																module.dependingFiles );
						}
						// Only include base dependencies based on it's extension.
						// For example: If a module has dependencies with CSS files only, this task
						// only will include base dependencies with CSS file extension.
						if ( options.baseDependencies.options.include === 'byFiletype' ) {
							_.each( options.baseDependencies.files, function( baseDepFileName ) {
								var baseExt = path.extname( baseDepFileName );

								_.each( module.dependingFiles, function( depFileName ) {
									var depExt = path.extname( depFileName );

									if ( baseExt === depExt ) {
										module.dependingFiles.push( baseDepFileName );
									}
								} );
							} );
						}
						// avoid duplicating files
						module.dependingFiles = _.uniq( module.dependingFiles );
						// search and copy depending files & base dependencies
						if ( module.dependingFiles.length > 0 ) {
							Helper.findAndCopyDependingFiles( module.dependingFiles,
																filePath,
																options );
						}
					}
				} );
				// Switch back to the original working directory
				grunt.file.setBase( oldCwd );
			} );

			grunt.file.setBase( oldCwd );
		} );
	} );

};
