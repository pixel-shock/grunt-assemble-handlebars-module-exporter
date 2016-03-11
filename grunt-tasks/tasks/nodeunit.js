module.exports = function(grunt, options) {
	return {
		options: {
			reporter: 'tap'
		},
		'veams-export': [ '<%= paths.tests %>/test-*.js' ]
	};
};