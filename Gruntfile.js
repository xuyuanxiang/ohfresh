module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            less: ["css/<%= pkg.name %>-<%= pkg.version %>.css"],
            product: ["css/**/*.css", "dist/*", "js/**/*.js", "img/*", "fonts/*"]
        },

        less: {
            develop: {
                files: {
                    "css/<%= pkg.name %>-<%= pkg.version %>.css": "src/less/ohFresh.less"
                }
            },
            product: {
                options: {
                    paths: ["css"],
                    cleancss: true
                },
                files: {
                    "css/<%= pkg.name %>-<%= pkg.version %>.min.css": "src/less/ohFresh.less"
                }
            }
        },

        uglify: {
            product: {
                options: {
                    banner: '/*!\n * @overview <%= pkg.name %>\n * @author <%= pkg.author%>\n * @version <%= pkg.version %>\n * @date <%= grunt.template.today("yyyy-mm-dd") %>\n */\n'
                },
                files: {
                    'js/<%= pkg.name %>-<%= pkg.version %>.min.js': [
                        'src/js/*.js',
                        'src/js/util/**/*.js',
                        'src/js/home/**/*.js',
                        'src/js/user/**/*.js'
                    ]
                }
            },
            dependences: {
                files: {
                    'js/vendor/jquery-jquery.cookie-framework7.min.js': [
                        'bower_components/jquery/dist/jquery.js',
                        'bower_components/jquery.cookie/jquery.cookie.js',
                        'bower_components/framework7/dist/js/framework7.js'
                    ]
                }
            }
        },

        concat: {
            style: {
                src: [
                    'css/<%= pkg.name %>-<%= pkg.version %>.min.css',
                    'bower_components/fontawesome/css/font-awesome.min.css'
                ],
                dest: 'dist/css/<%= pkg.name %>-<%= pkg.version %>-all.min.css'
            },
            script: {
                src: [
                    'js/vendor/jquery-jquery.cookie-framework7.min.js',
                    'js/<%= pkg.name %>-<%= pkg.version %>.min.js'
                ],
                dest: 'dist/js/<%= pkg.name %>-<%= pkg.version %>-all.min.js'
            }
        },

        copy: {
            develop: {
                files: [
                    {expand: true, cwd: 'bower_components/fontawesome/fonts/', src: ['*'], dest: 'fonts/'},
                    {expand: true, cwd: 'bower_components/fontawesome/css/', src: ['*.min.css'], dest: 'css/'},
                    {expand: true, cwd: 'bower_components/framework7/dist/img/', src: ['*'], dest: 'img/'}
                ]
            },
            product: {
                files: [
                    {expand: true, cwd: 'bower_components/fontawesome/', src: ['fonts/*'], dest: 'dist/'},
                    {expand: true, cwd: 'bower_components/framework7/dist/img/', src: ['*'], dest: 'dist/img/'},
                    {expand: true, src: ['img/*'], dest: 'dist/'}
                ]
            }
        },

        imagemin: {
            dynamic: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/img',
                        src: ['*.{png,jpg,gif}'],
                        dest: 'img'
                    }
                ]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/index.html': 'dist_index.html',
                    'dist/login.html': 'login.html',
                    'dist/register.html': 'register.html'
                }
            }
        },

        watch: {
            grunt: {
                files: ['Gruntfile.js']
            },
            less: {
                files: ['src/less/**/*.less'],
                tasks: ['clean:less', 'less:develop']
            },
            img: {
                files: ['src/img/**'],
                tasks: ['imagemin']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('cleanAll', ['clean:product']);
    grunt.registerTask('build', ['clean:less', 'less:develop', 'imagemin', 'copy:develop']);
    grunt.registerTask('publish', ['clean', 'less:product', 'uglify', 'concat', 'imagemin', 'htmlmin', 'copy:product']);
    grunt.registerTask('devlop', ['clean:less', 'less:develop', 'watch']);
}