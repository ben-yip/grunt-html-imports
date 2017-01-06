'use strict';

var grunt = require('grunt');

/*
 ======== A Handy Little Nodeunit Reference ========
 https://github.com/caolan/nodeunit

 Test methods:
 test.expect(numAssertions)
 test.done()
 Test assertions:
 test.ok(value, [message])
 test.equal(actual, expected, [message])
 test.notEqual(actual, expected, [message])
 test.deepEqual(actual, expected, [message])
 test.notDeepEqual(actual, expected, [message])
 test.strictEqual(actual, expected, [message])
 test.notStrictEqual(actual, expected, [message])
 test.throws(block, [error], [message])
 test.doesNotThrow(block, [error], [message])
 test.ifError(value)
 */

exports.html_imports = {
    setUp: function (done) {
        // setup here if necessary
        done();
    },

    // test two basic imports.
    basic_import: function (test) {
        test.expect(2);

        //index.html
        var actual = grunt.file.read('tmp/output/index.html');
        var expected = grunt.file.read('test/expected/index.html');
        test.equal(actual, expected, 'The import-link tag should be replaced with the according html fragment.');

        //about.html
        actual = grunt.file.read('tmp/output/about.html');
        expected = grunt.file.read('test/expected/about.html');
        test.equal(actual, expected, 'The import-link tag should be replaced with the according html fragment.');

        test.done();
    },

    recursive_import: function (test) {
        test.expect(1);

        var actual = grunt.file.read('tmp/output/recurse/a.html');
        var expected = grunt.file.read('test/expected/a.html');

        test.equal(actual, expected, 'The page should contain all fragment content even imported recursively');

        test.done();
    }
};
