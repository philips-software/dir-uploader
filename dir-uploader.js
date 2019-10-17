'use strict';
const colors = require('colors');
const fs = require('fs');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;
const logging = createLogger({
    level: 'debug',
    format: format.combine(
        timestamp(),
        format.simple()
    ),
    transports: [
        new transports.File({ filename: './logs/error.log', level: 'error'}),
        new transports.File({ filename: './logs/combined.log'}),
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.simple()
            )
        })
    ]
});
let FormData = require('form-data');
const fetch = require('node-fetch');
let finalFile, finalUrl, finalDeleteFile;

colors.enabled = true;
colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'blue',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'cyan',
    error: 'red'
});

let validateParams = (givenUrl, givenPath) => {
    let result = false;

    if (!givenUrl || !givenPath) {
        logging.log('error', colors.error('URL for upload endpoints or xml file path is not provided'));
    } else {
        finalUrl = givenUrl;
        finalFile = givenPath;
        result = true;
    }

    logging.log('debug', colors.debug('Upload Url: %s', finalUrl));
    logging.log('debug', colors.debug('result file: %s', finalFile));

    return result;
};

let isDirSync = path => {
    try {
        return fs.statSync(path).isDirectory();
    } catch (err) {
        throw err;
    }
};

let deleteFiles = async (dirPath, allFiles, fileType) => {
    fs.readdirSync(dirPath).forEach(filename => {
        if(!allFiles) {
            let extension = filename.split('.').pop();
            logging.log('debug', extension);
            if (extension === fileType) {
                fs.unlinkSync(dirPath + '/' + filename, err => {
                    if (err) return logging.log('error', colors.error('%s', err));
                    logging.log('debug', colors.debug('%s deleted successfully', filename));
                });
            }
        } else {
            fs.unlinkSync(dirPath + '/' + filename, err => {
                if (err) return  logging.log('error', colors.error('%s', err));
                logging.log('debug', colors.debug('%s deleted successfully', filename));
            });
        }
    });
};

let getArg = (param) => {
    let val;
    process.argv.forEach(arg => {
        if (arg.indexOf(param) > -1) {
            logging.log('debug', colors.debug('Found param %s', param));
            val = arg.split('=', 2)[1];
        }
    });
    return val;
};

logging.log('debug', 'HERE ARE THE ARGS');
process.argv.forEach((arg, i) => {
    logging.log('debug', ('ARG $d : $s', i, arg));
});
logging.log('debug', '-------END OF ARGS-------');

let argUrl = getArg('url');
let argResultPath = getArg('result-path');
let argMetadataFilePath = getArg('metadata-file');
let argDeleteFile = getArg('delete-files');
let exportfileType =  getArg('export-file-type');

let sendData = (url, resultPath, metadataFilePath, deleteFile, filetype) => {
    url = url || argUrl;
    resultPath = resultPath || argResultPath;
    metadataFilePath = metadataFilePath || argMetadataFilePath;
    finalDeleteFile = deleteFile || argDeleteFile;
    logging.log('debug', 'deleteFile: ' + finalDeleteFile);
    let allFiles = (exportfileType === true) || (filetype === true);
    let filetype2 = '*';
    if(allFiles === false)  {
        if (exportfileType) { filetype2 = exportfileType; }
        if (filetype) { filetype2 = filetype; }
    }

    logging.log('debug', colors.debug('URL: ' + url));
    if(!validateParams(url, resultPath)) return;

    var formData = new FormData();

    if (metadataFilePath) {
        formData.append('info', fs.createReadStream(metadataFilePath));
        logging.log('debug', colors.debug('Added metadata file ' + metadataFilePath));
    }

    if (isDirSync(finalFile)) {
        formData.append('info', JSON.stringify({ test: 'e2e' }));
        fs.readdirSync(resultPath).forEach(filename => {
            if (allFiles) {
               logging.log('debug', colors.debug("Uploading file: %s/%s", resultPath, filename));
                formData.append('files', fs.createReadStream(resultPath + '/' + filename));
            } else {
                let extension = filename.split('.').pop();
                logging.log('debug', 'HERE IS fileType: ' + filetype2 + ' & extension: ' + extension);
                if(extension === filetype2) {
                    logging.log('debug', colors.debug("Uploading file: %s/%s", resultPath, filename));
                    formData.append('files', fs.createReadStream(resultPath + '/' + filename));
                }
            }
        });
    } else {
        formData.append('files', fs.createReadStream(resultPath));
    }

    return fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(result => {
        if (result.status === 200) {
            logging.log('info', colors.debug('response is coming 200'));
            if (finalDeleteFile) {
                logging.log('debug', colors.debug('Deleting uploaded files in directory ' + resultPath));
                deleteFiles(resultPath, allFiles, filetype2);
            }
        }
        let dupResult = result.clone();
        result.json()
            .then(json => {
                logging.log('info', colors.data(JSON.stringify(json)));
                return json;
            })
            .catch(err => {
                logging.log('error', colors.error(err));
            });
        return dupResult;
    })
    .catch(err => {
        logging.log('error', colors.error(err));
    });
};

module.exports = {
    sendData
};
