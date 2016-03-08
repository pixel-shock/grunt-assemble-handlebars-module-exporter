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
		dependingFilesSrc: [
			'js',
			'css',
			'img'
		],
		baseDependencies: {
			options: {
				include: 'byFiletype'	// 'always' or 'byFiletype'
			},
			files: [
				'euh-config.js',
				'euh-jquery-extend.js',
				'jquery.js',
				'modernizr.js',
				'base-styles.css',
				'vendor.css'
			]
		}
	};

	return exports;
};
