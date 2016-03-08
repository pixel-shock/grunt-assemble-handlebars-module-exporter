module.exports = function(grunt, options) {
	return {
		'exporter' : {
			'src': ['<%= paths.js %>/**/*.js'],
			'options': {
				'config': 'grunt-tasks/configs/jscs.json',
				'esnext': false,
				'verbose': true,
				'fix': true,
				'maxErrors': 500
			}
		}
	};
};