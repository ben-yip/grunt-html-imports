/*
 * grunt-html-imports
 * https://github.com/ben-yip/grunt-html-imports
 *
 * Copyright (c) 2017 BenYip
 * Licensed under the MIT license.
 */


/**
 * todo
 *  - the regex should be more robust;
 *  - introduce cache mechanism to improve efficiency;
 *  - other filter needs;
 */


'use strict';

const path = require('path');

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('html_imports', 'Import html partials.', function () {

        // console.log(this.files);

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            // Conventionally, partial file names start with underscore(_)
            // and NO need to be output to dist directory
            outputUnderscore: false

            // whether to process html files only
            , htmlOnly: true
        });


        // plugin internal config
        var _ = {
            // the regex pattern to search import-link statements
            pattern: / *<link\s*rel=["']import["']\s*href=["'](.*)["']\s*>/ig

            // same as above, except for global mode
            , patternNonGlobal: / *<link\s*rel=["']import["']\s*href=["'](.*)["']\s*>/i
        };


        /**
         * Search and replace import-link tag with its file content recursively
         * until no more import-link detected in the source file.
         *
         * @param filepath
         * @returns {*}
         */
        var getReplacedFileContent = function (filepath) {

            // console.log('processing: ' + filepath);

            // read file source, saved in RAM
            var content = grunt.file.read(filepath);

            /*
             * Reset pattern's last search index to 0
             * at the beginning for each file content.
             *
             * NOTE:
             *   Since the pattern is always the same regex instance,
             *   property 'lastIndex' changes each time when .exec() is performed.
             *   To avoid 'lastIndex' affected by recursive function call,
             *   its value MUST be cached for each file content.
             */
            var cacheLastIndex = 0;
            _.pattern.lastIndex = cacheLastIndex;
            var matches = _.pattern.exec(content);
            cacheLastIndex = _.pattern.lastIndex;

            // While there are matches (of import-links) in file content
            while (matches !== null) {

                /*
                 * Construct the imported file's absolute path
                 *   (doesn't matter whether or not a relative path),
                 * and recursively search in imported file. (dept-first)
                 *
                 * NOTE:
                 *    - the regex uses capture group, the first match is the fragment file path.
                 */
                var currentDir = path.dirname(filepath),
                    relativeFilepath = matches[1].trim(),
                    importedFilepath = path.resolve(currentDir, relativeFilepath);

                var returnContent = getReplacedFileContent(importedFilepath);


                /*
                 * For current file content,
                 * replace import-link tag with return value.
                 *
                 * NOTE:
                 *   Because of dept-first search,
                 *   should ONLY replace the first match in current content.
                 *   rather than search globally.
                 */
                content = content.replace(_.patternNonGlobal, returnContent);
                // console.log(content);
                // console.log(matches);
                // console.log('-----');


                /*
                 * Keep searching in current file.
                 *
                 * NOTE:
                 *   After replacing part of the content (the step above),
                 *   the content's length changes accordingly.
                 *   Thus the 'lastIndex' property should shift to
                 *   the proper position to ensure next search.
                 */
                var deltaLength = returnContent.length - matches[0].length;

                _.pattern.lastIndex = cacheLastIndex + deltaLength;
                matches = _.pattern.exec(content);
                cacheLastIndex = _.pattern.lastIndex;
            }

            // When searching and replacing is done, return the result.
            return content;
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
                return options.htmlOnly && (path.extname(filepath) === '.html' || path.extname(filepath) === '.htm');

            }).forEach(function (filepath) {

                var content = getReplacedFileContent(filepath);

                // console.log('-------------------------------');
                // console.log(content);
                // console.log('-------------------------------');

                // Write the destination file.
                grunt.file.write(file.dest, content);

                // Print a success message.
                grunt.log.writeln('File "' + file.dest + '" created.');
            });
        });
    });
};
