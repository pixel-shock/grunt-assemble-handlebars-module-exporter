var path		= require( 'path' );
var fs			= require( 'fs' );
var glob		= require( 'glob' );

exports.directoryStructure = {
	setUp: function( callback ) {
		this.exportDirectory = 'tests/fixtures/assemble-handlebars-module-exporter';
		callback();
	},

	exportDirectoryShouldExist: function( test ) {
		test.equals( fs.lstatSync( path.resolve( this.exportDirectory ) ).isDirectory() , true, 'Export directory should exist' );
		test.done();
	},

	exportDirectoryShouldIncludesSubfolders: function( test ) {
		var subFolders = glob.sync( this.exportDirectory + path.sep + '**');
		test.notStrictEqual( subFolders.length, 0, 'Export directory should include subfolders' );
		test.done();
	},

	metaDataDirectoryShouldExist: function( test ) {
		var subFolders = glob.sync( this.exportDirectory + path.sep + '**/_metadata');
		test.notStrictEqual( subFolders.length, 0, 'Metadata directory should exist' );
		test.done();
	},

	stylesDirectoryShouldExist: function( test ) {
		var subFolders = glob.sync( this.exportDirectory + path.sep + '**/_metadata');
		test.notStrictEqual( subFolders.length, 0, 'Styles directory should exist' );
		test.done();
	},

	headerScriptsDirectoryShouldExist: function( test ) {
		var subFolders = glob.sync( this.exportDirectory + path.sep + '**/header-scripts');
		test.notStrictEqual( subFolders.length, 0, 'Header scripts directory should exist' );
		test.done();
	}
};
