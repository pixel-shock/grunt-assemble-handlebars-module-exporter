var path		= require( 'path' );
var fs			= require( 'fs' );
var glob		= require( 'glob' );

exports.directoryStructure = {
	setUp: function( callback ) {
		this.exportDirectory = 'tests/fixtures/assemble-handlebars-module-exporter';
		callback();
	},
	exportDirectoryExists: function( test ) {
		test.equals( fs.lstatSync( path.resolve( this.exportDirectory ) ).isDirectory() , true );
		test.done();
	},
	exportDirectoryIncludesSubfolders: function( test ) {
		var subFolders = glob.sync( this.exportDirectory + path.sep + '**');
		test.notStrictEqual( subFolders.length, 0 );
		test.done();
	},
	metaDataDirExists: function( test ) {
		var subFolders = glob.sync( this.exportDirectory + path.sep + '**/_metadata');
		test.notStrictEqual( subFolders.length, 0 );
		test.done();
	},
	stylesDirExists: function( test ) {
		var subFolders = glob.sync( this.exportDirectory + path.sep + '**/_metadata');
		test.notStrictEqual( subFolders.length, 0 );
		test.done();
	},
	headerScriptsDirExists: function( test ) {
		var subFolders = glob.sync( this.exportDirectory + path.sep + '**/header-scripts');
		test.notStrictEqual( subFolders.length, 0 );
		test.done();
	},
};
