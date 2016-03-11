/*
 * grunt-assemble-handlebars-module-exporter
 *
 *
 * Copyright (c) 2016 Wehe, Tino
 * Licensed under the MIT license.
 */

'use strict';

var _			= require( 'lodash' );
var path		= require( 'path' );
var glob		= require( 'glob' );
var fs			= require( 'fs' );

exports.init = function( grunt ) {
	var exports = {};

	/**
	 * A helper function for zerofill
	 * @param  {Integer} num   The number to be filled
	 * @param  {Integer} count The fill count
	 * @return {String}       The filled number
	 */
	exports.zeroFill = function( num, count ) {
		return [ Math.pow( 10, count - num.toString().length ), num ].join( '' ).substr( 1 );
	};

	/**
	 * Find a module with a html string
	 * @param  {String} html  The html-haystack for the search
	 * @param  {String} regex The regex
	 * @return {Array}       An Array with all matches
	 */
	exports.findModule = function( html, regex ) {
		var match = null;
		var re = _.cloneDeep( regex );
		var ret = [];

		while ( ( match = re.exec( html ) ) !== null ) {
			if ( match.index === re.lastIndex ) {
				re.lastIndex++;
			}
			if ( match.length > 0 ) {
				ret.push( match[ 1 ] );
			}
		}

		return ret;
	};

	/**
	 * Pseudo "cache" for found files
	 * @type {Object}
	 */
	var foundFilesCache = {};
	/**
	 * Find an copy files
	 * @param  {Array} fileNames   An Array with all filesNames which should be searched
	 * @param  {String} destination The path for the output ( targetPath for the copied files )
	 * @param {Object} options The task options
	 */
	exports.findAndCopyDependingFiles = function( fileNames, destination, options, isBaseDependency, distDir ) { // jscs:ignore maximumLineLength
		for ( var i = 0; i < fileNames.length; i++ ) {
			var depFile = fileNames[ i ];
			var depFileFound = false;
			var filePath = null;
			var depSourcePaths = options.dependingFilesSearchPaths;
			// Search for depending files
			if ( isBaseDependency !== true ) {
				for ( var j = 0; j < depSourcePaths.length; j++ ) {
					depFileFound = false;
					if ( typeof foundFilesCache[ depFile ] !== 'undefined' ) {
						depFileFound = true;
						filePath = foundFilesCache[ depFile ];
						break;
					} else {
						var sourcePath = depSourcePaths[ j ];
						var searchPath = path.resolve( path.normalize( depSourcePaths[ j ] ) );
						var fileSearchPath = path.normalize( searchPath + path.sep + depFile );
						var foundFiles = glob.sync( fileSearchPath );

						if ( foundFiles.length > 0 ) {
							depFileFound = true;
							filePath = path.normalize( foundFiles[ 0 ] );
							foundFilesCache[ depFile ] = filePath;
							break;
						}
					}
				}
			} else {
				filePath = path.normalize( depFile );

				if ( fs.lstatSync( filePath ).isFile() ) {
					depFileFound = true;
				} else {
					filePath = null;
				}
			}
			// If a file found build the export path and copy the depending file to it
			if ( filePath !== null && depFileFound === true ) {
				var relDepFilePath = path.relative( options.dependingFilesBasePath, filePath )
											.replace( /\.+?\//gi, '' );
				var exportPath = path.normalize( destination + path.sep + relDepFilePath );
				grunt.file.copy( filePath, exportPath );
			} else {
				grunt.log.writeln(
					( '\n\t\tCould not find depending file: ' ).red  +
					( '"' + depFile + '"\n' ).cyan
				);
			}
		}
	};

	/**
	 * Copy a file
	 * @param  {String} fileSrc  The file source
	 * @param  {String} fileDest The destination
	 */
	exports.copyFile = function( fileSrc, fileDest ) {
		grunt.file.copy( fileSrc, fileDest );
	};

	/**
	 * Function to create the full RegEx to match the start and the end of a module exactly
	 * @param  {String} html                   The html string to search through
	 * @param  {String} moduleStartRegex       The regex for the search
	 * @param  {Array} moduleEndSubstitutions An Array with all substitutions which will be replaced in the START regex
	 * @return {Array}                        An Array with all matches
	 */
	exports.buildRegexs = function( html, moduleStartRegex, moduleEndSubstitutions ) {
		var match = null;
		var regexs = [];
		var re = _.cloneDeep( moduleStartRegex );

		while ( ( match = re.exec( html ) ) !== null ) {
			if ( match.index === re.lastIndex ) {
				re.lastIndex++;
			}
			if ( match.length > 0 ) {
				var startCommentIndex = 1;
				var endCommentIndex = startCommentIndex;
				var fileNameIndex = 2;
				var exportAliasIndex = -1;
				var dependentFilesIndex = -1;

				if ( typeof match[ 3 ] !== 'undefined' && match[ 3 ].indexOf( 'AS' ) !== -1 ) {
					exportAliasIndex = 4;
				}

				if ( typeof match[ 5 ] !== 'undefined' && match[ 5 ].indexOf( 'WITH' ) !== -1 ) {
					dependentFilesIndex = 6;
				}

				var endComment = match[ endCommentIndex ];
				_.each( moduleEndSubstitutions, function( data, key ) {
					endComment = endComment.replace( data.replace, data.with );
				} );

				endComment = endComment.replace( /(AS\s(.*?)\s)?/gi, '' );
				endComment = endComment.replace( /(WITH\s(.*?)\s)?/gi, '' );
				endComment = endComment.replace( /\s{2,}/gi, '' );

				var obj = {
					'startComment': match[ startCommentIndex ],
					'fileName': match[ fileNameIndex ],
					'exportAlias': ( exportAliasIndex !== -1 ) ? match[ exportAliasIndex ] : match[ fileNameIndex ], // jscs:ignore maximumLineLength
					'dependingFiles': ( dependentFilesIndex !== -1 ) ? match[ dependentFilesIndex ].replace( /\s/gi, '' ).split( ',' ) : [], // jscs:ignore maximumLineLength
					'endComment': endComment
				};

				regexs.push( obj );
			}
		}

		return regexs;
	};

	return exports;
};
