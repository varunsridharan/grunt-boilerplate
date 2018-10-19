/* jshint node:true */
module.exports = function ( grunt ) {
	'use strict';
	require( 'load-grunt-tasks' )( grunt ); // npm install --save-dev load-grunt-tasks
	grunt.initConfig( {
		github_link: '',

		pot_filename: '',

		text_domain: '',

		// Setting folder templates.
		dirs: {
			src: { css: 'src/css', fonts: 'src/fonts', images: 'src/images', js: 'src/js' },
			dist: { css: 'assets/css', fonts: 'assets/fonts', images: 'assets/images', js: 'assets/js' }
		},

		babel: {
			options: {
				sourceMap: true,
				presets: [ '@babel/preset-env' ]
			},
			dist: {
				files: {
					'<%= dirs.dist.js %>/file.js': '<%= dirs.src.js %>/file.js'
				}
			}
		},

		// JavaScript linting with JSHint.
		jshint: {
			options: { jshintrc: '.jshintrc' },
			all: [ 'Gruntfile.js', '<%= dirs.dist.js %>/*.js', '!<%= dirs.js %>/*.min.js' ]
		},


		// Sass linting with Stylelint.
		stylelint: {
			options: { configFile: '.stylelintrc' },
			all: [ '<%= dirs.src.css %>/*.scss' ]
		},

		// Minify .js files.
		uglify: {
			options: {
				ie8: true,
				parse: { strict: false },
				output: { comments: /@license|@preserve|^!/ }
			},
			js: {
				files: [ {
					expand: true,
					cwd: '<%= dirs.dist.js %>/',
					src: [ '*.js', '!*.min.js' ],
					dest: '<%= dirs.dist.js %>/',
					ext: '.min.js'
				} ]
			},
			vendor: {
				files: {
					//'<%= dirs.js %>/accounting/accounting.min.js': [ '<%= dirs.js %>/accounting/accounting.js' ],
				}
			}
		},

		// Compile all .scss files.
		sass: {
			compile: {
				options: { sourceMap: 'none' },
				files: [ {
					expand: true,
					cwd: '<%= dirs.src.css %>/',
					src: [ '*.scss' ],
					dest: '<%= dirs.dist.css %>/',
					ext: '.css'
				} ]
			}
		},

		// Minify all .css files.
		cssmin: {
			minify: {
				expand: true,
				cwd: '<%= dirs.src.css %>/',
				src: [ '*.css' ],
				dest: '<%= dirs.dist.css %>/',
				ext: '.css'
			}
		},

		// Concatenate select2.css onto the admin.css files.
		concat: {
			css: {
				files: {
					//'<%= dirs.css %>/admin.css': [ '<%= dirs.css %>/select2.css', '<%= dirs.css %>/admin.css' ],
				}
			},
			js: {
				files: {
					//'<%= dirs.css %>/admin.css': [ '<%= dirs.css %>/select2.css', '<%= dirs.css %>/admin.css' ],
				}
			}

		},

		// Combines Multipel Files
		combine_files: {
			options: {},
			css: {
				files: {}
			},
			js: {
				files: {}
			}
		},

		// Watch changes for assets.
		watch: {
			css: {
				files: [ '<%= dirs.dist.css %>/*.scss' ],
				tasks: [ 'sass', 'postcss', 'cssmin', 'concat' ]
			},
			js: {
				files: [ '<%= dirs.dist.js %>/*js', '!<%= dirs.dist.js %>/*.min.js' ],
				tasks: [ 'jshint', 'uglify' ]
			}
		},

		// Generate POT files.
		makepot: {
			options: {
				type: 'wp-plugin',
				domainPath: 'i18n/languages',
				potHeaders: {
					'report-msgid-bugs-to': '<%= github_link %>/issues',
					'language-team': 'LANGUAGE <EMAIL@ADDRESS>'
				}
			},
			dist: {
				options: {
					potFilename: '<%= pot_filename %>.pot',
					exclude: [ 'apigen/.*', 'vendor/.*', 'tests/.*', 'tmp/.*' ]
				}
			}
		},

		// Check textdomain errors.
		checktextdomain: {
			options: {
				text_domain: '<%= text_domain %>',
				keywords: [
					'__:1,2d',
					'_e:1,2d',
					'_x:1,2c,3d',
					'esc_html__:1,2d',
					'esc_html_e:1,2d',
					'esc_html_x:1,2c,3d',
					'esc_attr__:1,2d',
					'esc_attr_e:1,2d',
					'esc_attr_x:1,2c,3d',
					'_ex:1,2c,3d',
					'_n:1,2,4d',
					'_nx:1,2,4c,5d',
					'_n_noop:1,2,3d',
					'_nx_noop:1,2,3c,4d'
				]
			},
			files: {
				src: [
					'**/*.php',               // Include all files
					'!apigen/**',             // Exclude apigen/
					'!includes/libraries/**', // Exclude libraries/
					'!node_modules/**',       // Exclude node_modules/
					'!tests/**',              // Exclude tests/
					'!vendor/**',             // Exclude vendor/
					'!tmp/**'                 // Exclude tmp/
				],
				expand: true
			}
		},

		// Clean the directory.
		clean: {
			apidocs: {
				src: [ 'wc-apidocs' ]
			}
		},

		// PHP Code Sniffer.
		phpcs: {
			options: {
				bin: 'vendor/bin/phpcs'
			},
			dist: {
				src: [
					'**/*.php',                                                  // Include all files
					'!node_modules/**',                                          // Exclude node_modules/
					'!tests/cli/**',                                             // Exclude tests/cli/
					'!tmp/**',                                                   // Exclude tmp/
					'!vendor/**'                                                 // Exclude vendor/
				]
			}
		},

		// Autoprefixer.
		postcss: {
			options: { processors: [ require( 'autoprefixer' )( { browsers: [ '> 0.1%', 'ie 8', 'ie 9' ] } ) ] },
			dist: { src: [ '<%= dirs.dist.css %>/*.css' ] }
		}
	} );

	// Load NPM tasks to be used here.
	grunt.loadNpmTasks( 'grunt-sass' );
	//grunt.loadNpmTasks( 'grunt-shell' );
	grunt.loadNpmTasks( 'grunt-phpcs' );
	//grunt.loadNpmTasks( 'grunt-rtlcss' );
	grunt.loadNpmTasks( 'grunt-postcss' );
	grunt.loadNpmTasks( 'grunt-stylelint' );
	grunt.loadNpmTasks( 'grunt-wp-i18n' );
	grunt.loadNpmTasks( 'grunt-checktextdomain' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-combine-files' );
	grunt.loadNpmTasks( 'grunt-prompt' );
	grunt.loadNpmTasks( 'grunt-babel' );
	// Register tasks.
	grunt.registerTask( 'default', [ 'js', 'css', 'i18n' ] );
	grunt.registerTask( 'js', [ 'concat:js', 'babel', 'jshint', 'uglify:js' ] );
	grunt.registerTask( 'css', [ 'sass', 'postcss', 'cssmin', 'concat:css' ] );

	// Only an alias to 'default' task.
	grunt.registerTask( 'dev', [ 'default' ] );
	grunt.registerTask( 'i18n', [ 'checktextdomain', 'makepot' ] );

};
