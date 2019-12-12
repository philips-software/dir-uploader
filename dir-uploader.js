'use strict';
const colors = require('colors');
const fs = require('fs');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;
const log = createLogger({
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
        log.log('error', colors.error('URL for upload endpoints or xml file path is not provided'));
    } else {
        finalUrl = givenUrl;
        finalFile = givenPath;
        result = true;
    }

    log.log('debug', colors.debug('Upload Url: %s', finalUrl));
    log.log('debug', colors.debug('result file: %s', finalFile));

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
            log.log('debug', extension);
            if (extension === fileType) {
                fs.unlinkSync(dirPath + '/' + filename, err => {
                    if (err) return log.log('error', colors.error('%s', err));
                    log.log('debug', colors.debug('%s deleted successfully', filename));
                });
            }
        } else {
            fs.unlinkSync(dirPath + '/' + filename, err => {
                if (err) return  log.log('error', colors.error('%s', err));
                log.log('debug', colors.debug('%s deleted successfully', filename));
            });
        }
    });
};

let getArg = (param) => {
    let val;
    process.argv.forEach(arg => {
        if (arg.indexOf(param) > -1) {
            log.log('debug', colors.debug('Found param %s', param));
            val = arg.split('=', 2)[1];
        }
    });
    return val;
};

log.log('debug', 'HERE ARE THE ARGS');
process.argv.forEach((arg, i) => {
    log.log('debug', ('ARG $d : $s', i, arg));
});
log.log('debug', '-------END OF ARGS-------');

let argUrl = getArg('url');
let argResultPath = getArg('result-path');
let argMetadataFilePath = getArg('metadata-file');
let argDeleteFile = getArg('delete-files');
let exportfileType =  getArg('export-file-type');

let sendData = (url, resultPath, metadataFile, deleteFile, filetype, resultFileFieldName) => {
    log.debug('url: ' + url);
    url = url || argUrl;
    resultPath = resultPath || argResultPath;
    metadataFile = metadataFile || argMetadataFilePath;
    finalDeleteFile = ((deleteFile || argDeleteFile) == 'true');
    log.log('debug', 'deleteFile: ' + finalDeleteFile);
    const finalResultFileFieldName = resultFileFieldName || 'files'
    let allFiles = (exportfileType === true) || (filetype === true);
    let filetype2 = '*';
    var formData = new FormData();

    if(allFiles === false)  {
        if (exportfileType) { filetype2 = exportfileType; }
        if (filetype) { filetype2 = filetype; }
    }
    
    log.debug('url: ' + url);
    log.debug('resultPath: ' + resultPath);
    log.debug('finalResultFileFieldName: ' + finalResultFileFieldName)
    
    if(!validateParams(url, resultPath)) return;

    if (isDirSync(finalFile)) {
        if (metadataFile) {
            formData.append('info', fs.createReadStream(metadataFile));
            log.debug('Added metadata file ' + metadataFile);
        } else {
            throw error('Metadata file is not provided');
        }        
        fs.readdirSync(resultPath).forEach(filename => {
            if (allFiles) {
               log.debug("Uploading file: %s/%s", resultPath, filename);
                formData.append(finalResultFileFieldName, fs.createReadStream(resultPath + '/' + filename));
            } else {
                let extension = filename.split('.').pop();
                log.log('debug', 'Here is fileType: ' + filetype2 + ' & extension: ' + extension);
                if(extension === filetype2) {
                    log.log('debug', colors.debug("Uploading file: %s/%s", resultPath, filename));
                    formData.append(finalResultFileFieldName, fs.createReadStream(resultPath + '/' + filename));
                }
            }
        });
    } else {
        formData.append(finalResultFileFieldName, fs.createReadStream(resultPath));
    }
    log.debug('Here are formData.getHeaders(): ' + JSON.stringify(formData.getHeaders()));
    return fetch(url, {
        method: 'POST',
        body: formData,
        headers: formData.getHeaders()
    })
    .then(result => {
        let dupResult = result.clone();
        if (result.status === 200) {
            log.info(colors.debug('response is coming 200'));
            if (finalDeleteFile) {
                log.log('debug', colors.debug('Deleting uploaded files in directory ' + resultPath));
                deleteFiles(resultPath, allFiles, filetype2);
            }
            result.json()
            .then(json => {
                log.log('info', colors.data(JSON.stringify(json)));
                return json;
            })
            .catch(err => {
                log.log('error', colors.error(err));
            });
        } else {
            log.error('Not successful result: status: ' + result.status);
            log.error('Here is the result object: ' + JSON.stringify(result));
        }
        
        return dupResult;
    })
    .catch(err => {
        log.log('error', colors.error(err));
    });
};

let sendMultiFolderData = (url, parentFolderPath, metadataFileName, deleteFiles, filetype, resultFileFieldName) => {
    url = url || argUrl;
    parentFolderPath = parentFolderPath || argResultPath;
    finalDeleteFile = deleteFiles || argDeleteFile;
    log.log('debug', 'deleteFile: ' + finalDeleteFile);
    let finalFileType = (exportfileType === true) || (filetype === true);
    let allFiles = !finalFileType ? true : false;
    if(!allFiles)  {
        if (exportfileType) { filetype2 = exportfileType; }
        if (filetype) { filetype2 = filetype; }
    }

    if(!validateParams(url, parentFolderPath)) return;

    log.debug('Passed validation!!');

    // If parent directory is a folder then get sub directories 
    // using withFileTypes so node version should be > 10.10
    const getDirectories = source =>
        fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
    const dirList = getDirectories(parentFolderPath);

    // If no take parentfolder or no sub directories - throw an error and exit
    if (!dirList) {
        throw new Error('No sub directories found in the given folder');
    }

    // Process each subfolder - send it out as a separate call and delete it if successful
    log.debug('Here are the directories: ' + dirList.join(', '));
    
    let resultArray = [];
    dirList.forEach((value) => {
        const finalFolder = parentFolderPath + '/' + value;
        const result = sendData(url, finalFolder, finalFolder + '/' + metadataFileName, 
                                true, 'xml', resultFileFieldName);
        resultArray.push(result);
    });

    // Send final response with approval or error
    return {
        status: 200,
        results: resultArray
    }
}

module.exports = {
    sendData,
    sendMultiFolderData
};
