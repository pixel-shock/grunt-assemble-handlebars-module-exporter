module.exports = function(grunt, options) {
	return {
		'veams-build' : {
			gruntfile: 'veams/Gruntfile.js',
			tasks: [ 'build' ]
		},
		'veams-export': {
			gruntfile: 'veams/Gruntfile.js',
			tasks: [ 'export' ]
		}
	};
};