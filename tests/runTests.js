let q = require('q');
let expect = require('chai').expect;
let myModule = require('../dir-uploader');
let setupMultipleFolders = require('./testapp/setup-multiple'); 
let setupTests  = setupMultipleFolders.setUpTests;
let fs = require('fs');
let logging = require('winston');
const dir = './tests/e2e/sample-exports/automated-based-results';

logging.configure({
    transports: [
        new logging.transports.File({filename: "./logs/error.log", level: "error"}),
        new logging.transports.File({filename: "./logs/combined.log"}),
        new logging.transports.Console({
            format: logging.format.combine(
                logging.format.colorize(),
                // logging.format.simple()
            )
        })
    ]
});

describe('uploader module with single upload', function () {
    // TODO This doesn't work for all the tests so figure out why
    // this.beforeEach(() => setupTests(directory));
    it('when correct params are given with results in xml files, it should upload and xml files should be deleted', async () => {
        const dir1 = dir + 1;
        setupTests(dir1);
        let result = await myModule.sendData("http://localhost:3020/post/result", dir1,
            dir1 + '/metadata.json', true, 'xml', 'tests');
        
        result.json().then(json => {
            expect(json).to.eql({ 
                result: 'All test results uploaded',
                metaDataFilesCount: 1,
                resultFilesCount: 2
            });
        });
        expect(result).not.undefined;
        expect(result.status).to.equal(200);
        fs.readdirSync(dir1, (err, files) => {
            if(err) {
                logging.log('error', err);
                throw new Error(err);
            }
            if (files.length !== 2) {
                logging.log('error', 'There was an issue deleting files.');
                throw new Error(files.length);
            }
            files.forEach(filename => {
                logging.log('error', filename);
                if (filename.substring(filename.length - 4) === '.xml') {
                    logging.log('error', 'There was an issue deleting xml files.');
                    throw new Error("XML file was not deleted");
                }
            })
        });
    });
    // TODO These tests are not working in conjunction with the others so commented them for now
    // it('when correct params are given with results in txt files, it should upload and txt files should be deleted', async () => {
    //     const dir2 = dir + 2;
    //     setupTests(dir2);
    //     let result = await myModule.sendData("http://localhost:3020/post/result", dir2,
    //         dir2 + '/metadata.json', true, 'txt', 'tests');
    //     result.json().then(json => {
    //         expect(json).to.eql({ 
    //             result: 'All test results uploaded',
    //             metaDataFilesCount: 1,
    //             resultFilesCount: 2
    //         });
    //     });
    //     expect(result).not.undefined;
    //     expect(result.status).to.equal(200);
    //     fs.readdirSync(dir2, (err, files) => {
    //         if(err) {
    //             logging.log('error', err);
    //             throw new Error(err);
    //         }
    //         if (files.length !== 2) {
    //             logging.log('error', 'There was an issue deleting files.');
    //             throw new Error(files.length);
    //         }
    //         files.forEach(filename => {
    //             logging.log('error', filename);
    //             if (filename.substring(filename.length - 4) === '.txt') {
    //                 logging.log('error', 'There was an issue deleting txt files.');
    //                 throw new Error("TXT file was not deleted");
    //             }
    //         })
    //     });
    // })
    // it('when correct params are given with results in xml files and deleting is requested with a longer command, it should upload and xml files should be deleted', async () => {
    //     const dir3 = dir + 3;
    //     setup.setUpTests(dir3);
    //     let result = await myModule.sendData("http://localhost:3020/post/result", dir3,
    //         dir3 + '/metadata.json',  "--delete-files", 'xml', 'tests');
    //     result.json().then(json => {
    //         expect(json).to.eql({ 
    //             result: 'All test results uploaded',
    //             metaDataFilesCount: 1,
    //             resultFilesCount: 2
    //         });
    //     });
    //     expect(result).not.undefined;
    //     expect(result.status).to.equal(200);
    //     fs.readdirSync("./tests/e2e/sample-exports/automated-based-results", (err, files) => {
    //         if(err) {
    //             logging.log('error', err);
    //             throw new Error(err);
    //         }
    //         if (files.length !== 2) {
    //             logging.log('error', 'There was an issue deleting files.');
    //             throw new Error(files.length);
    //         }
    //         files.forEach(filename => {
    //             logging.log('error', filename);
    //             if (filename.substring(filename.length - 4) === '.xml') {
    //                 logging.log('error', 'There was an issue deleting xml files.');
    //                 throw new Error("XML file was not deleted");
    //             }
    //         })
    //     });
    // })
    // it('when correct params are given with results in xml files and deleting is requested with a shorter command, it should upload and xml files should be deleted', async () => {
    //     const dir4 = dir + 4;
    //     setup.setUpTests(dir4);
    //     let result = await myModule.sendData("http://localhost:3020/post/result", dir4,
    //         dir4 + '/metadata.json', '-df', 'xml', 'tests');
    //     result.json().then(json => {
    //         expect(json).to.eql({ 
    //             result: 'All test results uploaded',
    //             metaDataFilesCount: 1,
    //             resultFilesCount: 2
    //         }); 
    //     });
    //     expect(result).not.undefined;
    //     expect(result.status).to.equal(200);
    //     fs.readdirSync("./tests/e2e/sample-exports/automated-based-results", (err, files) => {
    //         if (err) {
    //             logging.log('error', err);
    //             throw new Error(err);
    //         }
    //         if (files.length !== 2) {
    //             logging.log('error', 'There was an issue deleting files.');
    //             throw new Error(files.length);
    //         }
    //         files.forEach(filename => {
    //             logging.log('error', filename);
    //             if (filename.substring(filename.length - 4) === '.xml') {
    //                 logging.log('error', 'There was an issue deleting xml files.');
    //                 throw new Error("XML file was not deleted");
    //             }
    //         })
    //     });
    // })
    // it('when correct params are given with results in xml files and no to delete, it should upload and xml files should not be deleted', async () => {
    //     const dir5 = dir + 5;
    //     setupTests(dir5);
    //     let result = await myModule.sendData("http://localhost:3020/post/result", dir5,
    //         dir5 + '/metadata.json', false, 'xml', 'tests');
        
    //     result.json().then(json => {
    //         expect(json).to.eql({ 
    //             result: 'All test results uploaded',
    //             metaDataFilesCount: 1,
    //             resultFilesCount: 2
    //         });
    //     });
    //     expect(result).not.undefined;
    //     expect(result.status).to.equal(200);
    //     fs.readdirSync(dir5, (err, files) => {
    //         if(err) {
    //             logging.log('error', err);
    //             throw new Error(err);
    //         }
    //         if (files.length !== 4) {
    //             throw new Error('Files were deleted when they should not have been.');
    //         }
    //     })
    // })

});

// TODO Need to fix this test. It is not verifyig the upload
// describe('testing uploader module with correct params, all files uploaded but no files deleted', function () {
//     setupTests;
//     it('testing valid params and standard response', async () => {
//         let result = await myModule.sendData("http://localhost:3020/post", "./tests/e2e/sample-exports/automated-based-results",
//             './e2e/sample-exports/automated-based-results', false, false);
        // result.json().then(json => {
//             expect(json).to.eql({ 
//                 result: 'All test results uploaded',
//                 metaDataFilesCount: 1,
//                 resultFilesCount: 2
//             });
//         });
//         expect(result).not.undefined;
//         expect(result.status).to.equal(200);
//         fs.readdirSync("./tests/e2e/sample-exports/automated-based-results", (err, files) => {
//             if(err) {
//                 logging.log('error', err);
//                 throw new Error(err);
//             }
//             if (files.length !== 4) {
//                 throw new Error('Files were deleted when they should not have been.');
//             }
//         })
//     })
// });

describe('testing uploader module with multiple folders', function () {
    const dir6 = dir + 6;
    setupMultipleFolders.setupMultipleDir(dir6); 
    it('it should send request for each folder and delete it after getting a success response', async () => {
        let result = await myModule.sendMultiFolderData("http://localhost:3020/post/result", dir6,
            'metadata.json', "", 'xml', 'tests');
        let promiseArray = result.results;
        expect(result.status).to.equal(200);
        q.all(promiseArray).then( (results) => { 
            results.forEach((response, index) => {
                response.json().then((json) => {
                    console.log('OUTPUT from ' + index + ': ' + JSON.stringify(json));
                    // Getting the response from the server
                    expect(json).to.eql({ 
                        result: 'All test results uploaded',
                        metaDataFilesCount: 1,
                        resultFilesCount: 2
                    });
                });
            });
        })
    });
});


describe('testing uploader module with no params', function () {
    it('testing valid params and standard response', function(){
        let result = myModule.sendData("", "");
        expect(result).undefined
    })
});

describe('testing uploader module with just url param', function () {
    it('testing valid params and standard response', function(){
        let result = myModule.sendData("http://localhost:3020/post/result", "");
        expect(result).undefined
    })
});

describe('testing uploader module with just filepath param', function () {
    it('testing valid params and standard response', function(){
        let result = myModule.sendData("", "./tests/e2e/sample-exports/automated-based-results");
        expect(result).undefined
    })
});

describe('testing uploader module with just incorrect url param and no filepath param', function () {
    it('testing valid params and standard response', function(){
        let result = myModule.sendData("http://localhost:9999/post", "");
        expect(result).undefined
    })
});