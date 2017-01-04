/*
 * grunt-html-imports
 * https://github.com/ben-yip/grunt-html-imports
 *
 * Copyright (c) 2017 BenYip
 * Licensed under the MIT license.
 */

'use strict';

const path = require('path'),
    fs = require('fs');

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('html_imports', 'Import html partials.', function () {

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({

            // the regex pattern to search import-link statements
            pattern: / *<link\s*rel=["']import["']\s*href=["'](.*)["']>/gi

            // Conventionally, partial file names start with underscore(_)
            // and should NOT be output to dist directory
            , outputUnderscore: false

            // whether to process html files only
            , htmlOnly: true

            //
            , recurseDepth: 1

            // whether to show log info in shell while processing
            , log: true
        });


        // console.log(this.files);


        var getReplacedFileContent = function (filepath) {

            //read file source, saved in RAM
            var content = grunt.file.read(filepath);
            // console.log(content);

            // search recursively until no import-link detected in the source file
            // 搜索可以用test todo
            var matches = options.pattern.exec(content);



            // if import-link exists
            // if (matches !== null) {
            if (options.pattern.test(content)) {

                var currentDir = path.dirname(filepath);
                var relativeFilepath = matches[1].trim();
                var importedFilepath = path.resolve(currentDir, relativeFilepath);

                console.log(importedFilepath);

                // keep searching
                getReplacedFileContent(importedFilepath);

            } else {
                //
                // // read and replace with fragment file content
                // content = content.replace(options.pattern, function (matches, capture1) {
                //
                //     // the regex uses capture group, the first match is the fragment file path.
                //     var fragmentPath = path.resolve(path.dirname(filepath), capture1.trim());
                //     if (path.isAbsolute(filepath)) fragmentPath = capture1.trim();
                //
                //     if (options.log) console.log('importing: ' + path.basename(fragmentPath));
                //
                //     return grunt.file.read(fragmentPath);
                // });
                //
                return content;
            }

        };

        // Iterate over all specified file groups.
        this.files.forEach(function (file) {

            file.src.filter(function (filepath) {

                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }

            }).filter(function (filepath) {

                // filter files which name start with underscore(_)
                return !options.outputUnderscore && path.basename(filepath).indexOf('_') !== 0;

            }).filter(function (filepath) {

                // filter non-html files
                return options.htmlOnly && path.extname(filepath) === '.html';

            }).forEach(function (filepath) {

                // Read file source.
                var content = grunt.file.read(filepath);

                // console.log(filepath);

                // content = content.replace(options.pattern, function (matches, capture1) {
                //
                //     // Normally, imported html file fragments would use relative path.
                //     // the regex uses capture group, the first match is the fragment file path.
                //     var fragmentPath = path.resolve(path.dirname(filepath), capture1.trim());
                //     if (path.isAbsolute(filepath)) {
                //         fragmentPath = capture1.trim();
                //     }
                //
                //     if (options.log) console.log('importing: ' + path.basename(fragmentPath));
                //
                //     // read and replace with fragment file content
                //     return grunt.file.read(fragmentPath);
                // });

                content = getReplacedFileContent(filepath);

                // Write the destination file.
                // grunt.file.write(file.dest, content);

                // Print a success message.
                // grunt.log.writeln('File "' + file.dest + '" created.');
            });
        });

    });
};
