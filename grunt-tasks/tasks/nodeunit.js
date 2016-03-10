module.exports = function(grunt, options) {
	return {
		options: {
			reporter: 'nested'
		},
		'veams-export': [ '<%= paths.tests %>/test-*.js' ]
	};
};