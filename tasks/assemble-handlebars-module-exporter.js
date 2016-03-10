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
	var glob		= require( 'glob' );

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
			var foundFilesLen = task.src.length;
			grunt.log.writeln( 'Processing ' + foundFilesLen + ' file(s) ...' );
			// Delete the old dist directoy of exists
			if ( grunt.file.isDir( task.dist ) === true ) {
				grunt.file.delete( task.dist );
			}
			// Iterate through all src files
			task.src.forEach( function( file, index ) {
				grunt.log.writeln( '\t' + file.yellow );
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

				// Remove doublicates by the "startComment" property
				regexs = _.uniqBy( regexs, 'startComment' );
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
							dependingFiles: value.dependingFiles || [],
							baseDependencies: []
						} );
					}
				} );

				if ( modules.length === 0 ) {
					grunt.log.writeln( '\t\t0 modules found!'.yellow );
				} else {
					grunt.log.writeln( '\t\t' + modules.length + ' modules found'.green );
				}
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
				// If the dist directory don't exist, create it
				if ( grunt.file.isDir( task.dist ) === false ) {
					grunt.file.mkdir( task.dist );
				}
				// Iterate through all modules, write them into the output
				// file and try to find the depending files
				modules.forEach( function( module ) {
					var extractPath = path.normalize( task.dist + '/' + module.filePath );
					var exportFileName = path.basename( module.exportAlias,
														path.extname( module.exportAlias ) );
					var filePath = extractPath + exportFileName + path.sep;
					var filePathWithName = path.normalize( filePath +
															'/' +
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
						// Iterate through the base dependencies which should be "always" included
						for ( var i = 0; i < options.baseDependencies.files.always.length; i++ ) { // jscs:ignore maximumLineLength
							var patt = options.baseDependencies.files.always[ i ];
							var files = glob.sync( patt, {
								realpath: true
							} );

							if ( files.length > 0 ) {
								files.forEach( function( baseDepFile ) {
									module.baseDependencies.push( baseDepFile );
								} );
							}
						}
						// Iterate throught the base dependencies which sould be included "byFileType"
						for ( var i = 0; i < options.baseDependencies.files.byFileType.length; i++ ) { // jscs:ignore maximumLineLength
							var patt = options.baseDependencies.files.byFileType[ i ];
							var files = glob.sync( patt, {
								realpath: true
							} );

							if ( files.length > 0 ) {
								files.forEach( function( baseDepFile ) {
									var fileExt = path.extname( baseDepFile );
									// Check if a depending file extension matches the extension of
									// the base dependency
									for ( var j = 0; j < module.dependingFiles.length; j++ ) {
										var depFileExt = path.extname( module.dependingFiles[ j ] );

										if ( fileExt === depFileExt ) {
											module.baseDependencies.push( baseDepFile );
										}
									}
								} );
							}
						}
						// avoid duplicating files
						module.dependingFiles = _.uniq( module.dependingFiles );
						module.baseDependencies = _.uniq( module.baseDependencies );
						// Search and copy depending files
						if ( module.dependingFiles.length > 0 ) {
							Helper.findAndCopyDependingFiles( module.dependingFiles,
																filePath,
																options,
																false );
						}
						// Copy base dependencies
						if ( module.baseDependencies.length > 0 ) {
							Helper.findAndCopyDependingFiles( module.baseDependencies,
																filePath,
																options,
																true );
						}
					}
				} );
			} );
		} );
	} );

};
