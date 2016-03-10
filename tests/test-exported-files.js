var path		= require( 'path' );
var fs			= require( 'fs' );
var glob		= require( 'glob' );

exports.directoryStructure = {
	setUp: function( callback ) {
		this.exportDirectory = 'tests/fixtures/assemble-handlebars-module-exporter/partials/_global';
		this.metadataDirectory = this.exportDirectory + path.sep + '_metadata';
		this.stylesDirectory = this.exportDirectory + path.sep + '_styles';
		this.headerScriptsDirectory = this.exportDirectory + path.sep + 'header-scripts';
		callback();
	},
	metadataDirIncludesJQuery: function( test ) {
		var jQuery = glob.sync( this.metadataDirectory + path.sep + '**' + path.sep + 'jquery.js' );
		test.notStrictEqual( jQuery.length, 0 );
		test.done();
	},
	stylesDirIncludesJQuery: function( test ) {
		var jQuery = glob.sync( this.stylesDirectory + path.sep + '**' + path.sep + 'jquery.js' );
		test.notStrictEqual( jQuery.length, 0 );
		test.done();
	},
	headerScriptsDirIncludesJQuery: function( test ) {
		var jQuery = glob.sync( this.headerScriptsDirectory + path.sep + '**' + path.sep + 'jquery.js' );
		test.notStrictEqual( jQuery.length, 0 );
		test.done();
	},
	metadataDirIncludesHtmlFile: function( test ) {
		var htmlFiles = glob.sync( this.metadataDirectory + path.sep + '**' + path.sep + '*.html' );
		test.equals( htmlFiles.length, 1 );
		test.done();
	},
	stylesDirIncludesHtmlFile: function( test ) {
		var htmlFiles = glob.sync( this.stylesDirectory + path.sep + '**' + path.sep + '*.html' );
		test.equals( htmlFiles.length, 1 );
		test.done();
	},
	headerScriptsDirIncludesHtmlFile: function( test ) {
		var htmlFiles = glob.sync( this.headerScriptsDirectory + path.sep + '**' + path.sep + '*.html' );
		test.equals( htmlFiles.length, 1 );
		test.done();
	},
	stylesDirectoryIncludesCSSFiles: function( test ) {
		var cssFiles = glob.sync( this.stylesDirectory + path.sep + '**' + path.sep + '*.css' );
		test.notStrictEqual( cssFiles.length, 0 );
		test.done();
	}
};
