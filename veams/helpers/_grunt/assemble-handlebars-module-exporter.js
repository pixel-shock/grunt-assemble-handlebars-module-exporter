module.exports = {
	all: {
		options: {
			moduleStartRegex: /(<!--\s?START\s?(.*?.hbs)\s+(AS?\s?(.*?))?\s?(WITH?\s?(.*?))?-->)/gm,
			moduleEndSubstitutions: [{
				'replace': 'START',
				'with': 'END'
			}],
			moduleSrc: 'resources/templating/',
			moduleExportExtension: '.html',
			dependingFilesBasePath: '<%= paths.dev %>',
			dependingFilesSrc: [
				'js',
				'css',
				'img'
			],
			baseDependencies: {
				files: {
					'always': [
						'<%= paths.dev %>/js/lib/jquery.js'
					],
					'byFileType': [
						'<%= paths.dev %>/js/lib/modernizr.js',
						'<%= paths.dev %>/css/universal.css',
					]
				}
			},
		},
		src: ['<%= paths.dev %>/**/*.html'],
		dist: '<%= paths.extracted_modules %>'
	}
};