module.exports = function(grunt) {
	grunt.initConfig({
		bookmarklet_wrapper: {
			default_options: {
				files: {
					'build/bc-todo-to-ical.min.js': ['src/main.js']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-bookmarklet-wrapper');
	grunt.registerTask('default', ['bookmarklet_wrapper']);
};
