var path		= require( 'path' );
var fs			= require( 'fs' );
var glob		= require( 'glob' );

exports.exportedFiles = {
	setUp: function( callback ) {
		this.exportDirectory = 'tests/fixtures/assemble-handlebars-module-exporter/partials/_global';
		this.metadataDirectory = this.exportDirectory + path.sep + '_metadata';
		this.stylesDirectory = this.exportDirectory + path.sep + '_styles';
		this.headerScriptsDirectory = this.exportDirectory + path.sep + 'header-scripts';
		callback();
	},

	metadataDirectoryShouldIncludeJQuery: function( test ) {
		var jQuery = glob.sync( this.metadataDirectory + path.sep + '**' + path.sep + 'jquery.js' );
		test.notStrictEqual( jQuery.length, 0, 'Metadata directory should contain "jquery.js" file' );
		test.done();
	},

	stylesDirectoryShouldIncludeJQuery: function( test ) {
		var jQuery = glob.sync( this.stylesDirectory + path.sep + '**' + path.sep + 'jquery.js' );
		test.notStrictEqual( jQuery.length, 0, 'Styles directory should contain "jquery.js" file' );
		test.done();
	},

	headerScriptsDirectoryShouldIncludeJQuery: function( test ) {
		var jQuery = glob.sync( this.headerScriptsDirectory + path.sep + '**' + path.sep + 'jquery.js' );
		test.notStrictEqual( jQuery.length, 0, 'Header scripts directory should contain "jquery.js" file' );
		test.done();
	},

	metadataDirectoryShouldIncludeHtmlFile: function( test ) {
		var htmlFiles = glob.sync( this.metadataDirectory + path.sep + '**' + path.sep + '_metadata.html' );
		test.equals( htmlFiles.length, 1, 'Metadata directory should contain "_metadata.html" file' );
		test.done();
	},

	stylesDirectoryShouldIncludeHtmlFile: function( test ) {
		var htmlFiles = glob.sync( this.stylesDirectory + path.sep + '**' + path.sep + '_styles.html' );
		test.equals( htmlFiles.length, 1, 'Styles directory should contain "_styles.html" file' );
		test.done();
	},

	headerScriptsDirectoryShouldIncludeHtmlFile: function( test ) {
		var htmlFiles = glob.sync( this.headerScriptsDirectory + path.sep + '**' + path.sep + 'header-scripts.html' );
		test.equals( htmlFiles.length, 1, 'Header scripts directory should contain "header-scripts.html" file' );
		test.done();
	},

	stylesDirectoryShouldIncludeCSSFiles: function( test ) {
		var cssFiles = glob.sync( this.stylesDirectory + path.sep + '**' + path.sep + '*.css' );
		test.notStrictEqual( cssFiles.length, 0, 'Styles directory should contain some CSS files' );
		test.done();
	},

	htmlFilesShouldntBeEmpty: function( test ) {
		var htmlFiles = glob.sync( this.exportDirectory + path.sep + '**' + path.sep + '*.html' );

		test.notStrictEqual( htmlFiles.length, 0, 'HTML files length found in export directory should be greater than 0' );

		for (var i = 0; i < htmlFiles.length; i++) {
			var fileContents = fs.readFileSync( path.resolve( htmlFiles[ i ] ), 'utf8');
			var typeOfFileContents = (typeof fileContents).toLowerCase();
			test.strictEqual( typeOfFileContents, 'string', 'File content of "' +  path.basename( htmlFiles[ i ] )  + '" should be a string' );
			test.notStrictEqual( fileContents.length, 0, 'File content of "' +  path.basename( htmlFiles[ i ] )  + '" length should be greater than 0' );
		}

		test.done();
	}
};
