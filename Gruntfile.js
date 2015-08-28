module.exports = function(grunt) {

    grunt.initConfig({
        babel: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'jef.js': 'jef.es6'
                }
            }
        },

        uglify: {
            options: {
                compress: {
                    drop_console: true
                }
            },
            scripts: {
                files: {
                    'jef.min.js': 'jef.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', [
        'babel',
        'uglify'
    ]);

};