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
                files: [
                    {
                        expand: true,
                        cwd: 'src',
                        src: ['js/**/*.js'],
                        dest: 'dist'
                    }
                ]
            },
            dependencies: {
                files: {
                    'dist/js/vendor/dependencies.min.js': [
                        'bower_components/modernizr/modernizr.js',
                        'bower_components/respond/src/respond.js',
                        'bower_components/jquery/dist/jquery.js',
                        'bower_components/framework7/dist/js/framework7.js',
                        'bower_components/angular/angular.js',
                        'bower_components/angular-route/angular-route.js',
                        'bower_components/angular-cookies/angular-cookies.js',
                        'bower_components/moment/min/moment.min.js',
                        'bower_components/moment/lang/zh-cn.js',
                        'bower_components/angular-moment/angular-moment.min.js',
                        'bower_components/requirejs/require.js'
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
                }
            },
            tpl: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/tpl/address/list.html': 'tpl/address/list.html',
                    'dist/tpl/customer/info.html': 'tpl/customer/info.html',
                    'dist/tpl/customer/login.html': 'tpl/customer/login.html',
                    'dist/tpl/customer/register.html': 'tpl/customer/register.html',
                    'dist/tpl/home/home.html': 'tpl/home/home.html',
                    'dist/tpl/order/create.html': 'tpl/order/create.html'
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