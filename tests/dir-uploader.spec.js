// 'use strict'
const { assert, expect } = require('chai');
const rewire = require('rewire');
const uploaderModule = rewire('../dir-uploader.js');
// debugger;
// console.log(uploaderModule.updateParams);

describe('uploader module unit tests', function() {
    const TEST_ENDPOINT = 'https://upload-end-point',
    TEST_XML_FILE = 'tests/e2e/sample-exports/browser-based-results/chrome-test-results.xml';
    TEST_XML_DIR = 'tests/e2e/sample-exports/browser-based-results';

    describe('finalizeParams function', function() {
        // getting private function updateParams
        const finalizeParams = uploaderModule.__get__('validateParams');

        it('it should fail if directory or filename is not provided', function() {
            let result = finalizeParams(TEST_ENDPOINT, '');
            assert.isFalse(result);
        });

        it('it should return true if url and xml file path is provided', function() {
            assert.isTrue(finalizeParams(TEST_ENDPOINT, TEST_XML_FILE));
        });
    });

    describe('isDirSync function', function() {
        const isDirSync = uploaderModule.__get__('isDirSync');
        it('should true if a directory is provided', function() {
            assert.isTrue(isDirSync(TEST_XML_DIR));
        });

        it('should return false if a file is provided', function () {
            assert.isFalse(isDirSync(TEST_XML_FILE));
        }); 

        it('should throw error if file or dir does not exist', function() {
            try {
                assert.throw(isDirSync('not-existing-path/', 'no such file or directory'));
            } catch (e) {};
        });

    });

});
