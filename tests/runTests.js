const expect = require('chai').expect;
const myModule = require('../dir-uploader');
const setupTests = require('./testapp/setup');
const fs = require('fs');
const logging = require('winston');
logging.configure({
    transports: [
        new logging.transports.File({filename: "./logs/error.log", level: "error"}),
        new logging.transports.File({filename: "./logs/combined.log"}),
        new logging.transports.Console({
            format: logging.format.combine(
                logging.format.colorize(),
                logging.format.simple()
            )
        })
    ]
});

describe('testing uploader module with correct params and xml files deleted', function () {
    setupTests;
    it('testing valid params and standard response', async () => {
        let result = await myModule.sendData("http://localhost:3020/post", "./tests/e2e/sample-exports/automated-based-results",
            './tests/e2e/sample-exports/automated-based-results', true, "xml");
        result.json().then(json => {
            expect(json).to.eql({a:1});
        });
        expect(result).not.undefined;
        expect(result.status).to.equal(200);
        fs.readdirSync("./tests/e2e/sample-exports/automated-based-results", (err, files) => {
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
    })
});

describe('testing uploader module with correct params and txt files deleted', function () {
    setupTests;
    it('testing valid params and standard response', async () => {
        let result = await myModule.sendData("http://localhost:3020/post", "./tests/e2e/sample-exports/automated-based-results",
            './tests/e2e/sample-exports/automated-based-results', true, "txt");
        result.json().then(json => {
            expect(json).to.eql({a:1});
        });
        expect(result).not.undefined;
        expect(result.status).to.equal(200);
        fs.readdirSync("./tests/e2e/sample-exports/automated-based-results", (err, files) => {
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
                if (filename.substring(filename.length - 4) === '.txt') {
                    logging.log('error', 'There was an issue deleting txt files.');
                    throw new Error("TXT file was not deleted");
                }
            })
        });
    })
});

describe('testing uploader module with correct params and xml files deleted with longer command', function () {
    setupTests;
    it('testing valid params and standard response', async () => {
        let result = await myModule.sendData("http://localhost:3020/post", "./tests/e2e/sample-exports/automated-based-results",
            './e2e/sample-exports/automated-based-results', "--delete-files", "xml");
        result.json().then(json => {
            expect(json).to.eql({a:1});
        });
        expect(result).not.undefined;
        expect(result.status).to.equal(200);
        fs.readdirSync("./tests/e2e/sample-exports/automated-based-results", (err, files) => {
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
    })
});

describe('testing uploader module with correct params and xml files deleted with shorter command', function () {
    setupTests;
    it('testing valid params and standard response', async () => {
        let result = await myModule.sendData("http://localhost:3020/post", "./tests/e2e/sample-exports/automated-based-results",
            './e2e/sample-exports/automated-based-results', "-df", "xml");
        result.json().then(json => {
            expect(json).to.eql({a:1});
        });
        expect(result).not.undefined;
        expect(result.status).to.equal(200);
        fs.readdirSync("./tests/e2e/sample-exports/automated-based-results", (err, files) => {
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
    })
});

describe('testing uploader module with correct params and xml files deleted with true', function () {
    setupTests;
    it('testing valid params and standard response', async () => {
        let result = await myModule.sendData("http://localhost:3020/post", "./tests/e2e/sample-exports/automated-based-results",
            './e2e/sample-exports/automated-based-results', true, "xml");
        result.json().then(json => {
            expect(json).to.eql({a:1});
        });
        expect(result).not.undefined;
        expect(result.status).to.equal(200);
        fs.readdirSync("./tests/e2e/sample-exports/automated-based-results", (err, files) => {
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
    })
});

describe('testing uploader module with correct params and no files deleted', function () {
    setupTests;
    it('testing valid params and standard response', async () => {
        let result = await myModule.sendData("http://localhost:3020/post", "./tests/e2e/sample-exports/automated-based-results",
            './e2e/sample-exports/automated-based-results', false, "xml");
        result.json().then(json => {
            expect(json).to.eql({a:1});
        });
        expect(result).not.undefined;
        expect(result.status).to.equal(200);
        fs.readdirSync("./tests/e2e/sample-exports/automated-based-results", (err, files) => {
            if(err) {
                logging.log('error', err);
                throw new Error(err);
            }
            if (files.length !== 4) {
                throw new Error('Files were deleted when they should not have been.');
            }
        })
    })
});

describe('testing uploader module with correct params, all files uploaded but no files deleted', function () {
    setupTests;
    it('testing valid params and standard response', async () => {
        let result = await myModule.sendData("http://localhost:3020/post", "./tests/e2e/sample-exports/automated-based-results",
            './e2e/sample-exports/automated-based-results', false, false);
        result.json().then(json => {
            expect(json).to.eql({a:1});
        });
        expect(result).not.undefined;
        expect(result.status).to.equal(200);
        fs.readdirSync("./tests/e2e/sample-exports/automated-based-results", (err, files) => {
            if(err) {
                logging.log('error', err);
                throw new Error(err);
            }
            if (files.length !== 4) {
                throw new Error('Files were deleted when they should not have been.');
            }
        })
    })
});

describe('testing uploader module with correct params and all files deleted', function () {
    setupTests;
    it('testing valid params and standard response', async () => {
        let result = await myModule.sendData("http://localhost:3020/post", "./tests/e2e/sample-exports/automated-based-results",
            './tests/e2e/sample-exports/automated-based-results', "-df", false);
        result.json().then(json => {
            expect(json).to.eql({a:1});
        });
        expect(result).not.undefined;
        expect(result.status).to.equal(200);
    });
    fs.readdirSync("./tests/e2e/sample-exports/automated-based-results", (err, files) => {
        if(err) {
            logging.log('error', err);
            throw new Error(err);
        }
        if (!files.length) {
            throw new Error('Files were not deleted when they should have been.');
        }
    });
});

describe('testing uploader module with correct params and all files deleted with longer command', function () {
    setupTests;
    it('testing valid params and standard response', async () => {
        let result = await myModule.sendData("http://localhost:3020/post", "./tests/e2e/sample-exports/automated-based-results",
            './tests/e2e/sample-exports/automated-based-results', "--delete-files", false);
        result.json().then(json => {
            expect(json).to.eql({a:1});
        });
        expect(result).not.undefined;
        expect(result.status).to.equal(200);
    });
    fs.readdirSync("./tests/e2e/sample-exports/automated-based-results", (err, files) => {
        if(err) {
            logging.log('error', err);
            throw new Error(err);
        }
        if (!files.length) {
            throw new Error('Files were not deleted when they should have been.');
        }
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
        let result = myModule.sendData("http://localhost:3020/post", "");
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