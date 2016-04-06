module.exports = function(grunt, options) {
	return {
		'test-directory' : [
			'<%= paths.tests %>/fixtures/**'
		]
	};
};