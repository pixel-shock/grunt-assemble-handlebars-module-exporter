exports.init = function( grunt ) {
	var exports = {};

	/**
	 * Define the default task options
	 * @type {Object}
	 */
	exports.options = {
		moduleStartRegex: /(<!--\s?START\s?(.*?.hbs)\s+(AS?\s?(.*?))?\s?(WITH?\s?(.*?))?-->)/gm,
		moduleEndSubstitutions: [ {
			'replace': 'START',
			'with': 'END'
		} ],
		moduleSrc: 'resources/templates/',
		moduleExportExtension: '.html',
		dependingFilesBasePath: '_output',
		dependingFilesSearchPaths: [
			'_output/js/**/',
			'_output/css/**/',
			'_output/img/**/'
		],
		baseDependencies: {
			files: {
				'always': [],
				'byFileType': []
			}
		}
	};

	return exports;
};
