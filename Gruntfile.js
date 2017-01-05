/*
 * grunt-html-imports
 * https://github.com/ben-yip/grunt-html-imports
 *
 * Copyright (c) 2017 BenYip
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    require('jit-grunt')(grunt);

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        copy: {
            test: {
                expand: true,
                cwd: 'test/',
                src: 'source/**/*.html',
                dest: 'tmp/'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            test: ['tmp']
        },

        // Configuration to be run (and then tested).
        html_imports: {
            test: {
                expand: true,
                cwd: 'tmp/source',
                src: '**/*',
                dest: 'tmp/output'

                // src: 'tmp/source/*',
                // dest: 'tmp/output'
            },
            recurse: {
                expand: true,
                cwd: 'tmp/source/recurse',
                src: '**/*',
                dest: 'tmp/output'
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });


    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'html_imports', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);


    grunt.registerTask('ready', 'do clean and copy, ready for test.', ['clean:test', 'copy:test']);
    grunt.registerTask('r', 'run recursive import test only', ['html_imports:recurse']);

    grunt.registerTask('h', 'run complete import test', [
        'clean:test',
        'copy:test',
        'html_imports:test'
    ]);

    grunt.registerTask('tr', 'run recursive import test', [
        'clean:test',
        'copy:test',
        'html_imports:recurse'
    ]);
};
