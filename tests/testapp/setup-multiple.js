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
let randomString = (length, chars) => {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
}

let getMetaData = () => {
    return {
        "jiraProjectKey": "CARE",
        "systemProperties": {
            "build.vcs.number": randomString(28, 'aA#')
        }
    };
}

let getSuccessTestCase = () => {
    return '    <testcase requirements="XRAY-' + randomString(4, '#') + '" name="The login page is loaded successfully" time="0" classname="Given"/>\n';
}

let getTotalSuccessTestCases = () => {
    const len = randomString(1,'#');
    let totalSuccessTestCases = ''
    for(i=0; i<len; i++ ){
        totalSuccessTestCases += getSuccessTestCase();
    }
    return totalSuccessTestCases;
}

let getXmlFileStr = () => {
    const xmlStr = '<?xml version="1.0"?>\n' +
    '<testsuites>\n' +
    '  <testsuite name="chrome 75.0.3770.100" timestamp="2019-07-10T14:32:13" id="0" hostname="Ms-MacBook-Pro.local" tests="1" failures="1">\n' +
    '    <testcase requirements="XRAY-' + randomString(4, '#') + '" name="The login page is loaded successfully" time="0" classname="Given">\n' +
    '      <failure msg="testcase failed"/>\n' +
    '    </testcase>\n' +
    getTotalSuccessTestCases() +
    '</testsuites>';
    log.debug('HERO HERO')
    log.debug(xmlStr);
    return xmlStr;
}

let txtFile = '{\n' +
    '   "Key":"Value",\n' +
    '   "Key2":"Value2",\n' +
    '   "Key3":"Value3",\n' +
    '   "Key4":"Value4"\n' +
    '}';

let makeDirectory = (directory) => {
    if (!fs.existsSync(directory)){
        fs.mkdirSync(directory);
    }
};

let clearDirectory = (directory) => {
    fs.readdirSync(directory, { withFileTypes: true }).forEach(entry => {
        if(entry.isFile()) { 
            // log.debug('HERE IS MY HERO: ' + JSON.stringify(entry));
            fs.unlink( directory + '/' + entry.name, err => {
                if (err) return log.log('error', err);
                log.debug(entry + 'file deleted successfully');
            })
        } else if(entry.isDirectory()){
            fs.rmdir( directory + '/' + entry.name, {recursive: true}, (err) => {
                if (err) return log.log('error', err);
                log.debug(entry + 'directory deleted successfully');
            });
        }
})
};

let makeMetaDataFile = (directory) => {
    const finalMetaDataFileStr = JSON.stringify(getMetaData());
    fs.writeFileSync(directory + '/metadata.json', finalMetaDataFileStr, function(err) {
        if (err) return log.log('error', err);ll
        log.debug('metadata.json is created successfully.');
    });
}

let makeXmlFiles = (directory) => {
    const fileName1 = randomString(5,'a');
    const fileName2 = randomString(5,'a'); 
    log.debug('Filenames: ' + fileName1 + ', ' + fileName2);
    fs.writeFileSync(directory + '/' + fileName1 + '.xml', getXmlFileStr(), function(err) {
        if (err) return log.log('error', err);
        log.debug(fileName1 + '.xml is created successfully.');
    });
    fs.writeFileSync(directory + '/' + fileName2 + '.xml', getXmlFileStr(), function(err) {
        if (err) return log.log('error', err);
        log.debug(fileName2 + '.xml is created successfully.');
    });
    return true;
};

let makeTxtFiles = (directory) => {
    fs.writeFileSync(directory + '/Json.txt', txtFile, function(err) {
        if (err) return log.log('error', err);
        log.log('debug', 'Json.txt is created successfully.');
    });
    fs.writeFileSync(directory + '/Json2.txt', txtFile, function(err) {
        if (err) return log.log('error', err);
        log.log('debug', 'Json.txt is created successfully.');
    });
    return true;
};
let setUpTests = (directory) => {
    makeDirectory(directory);
    clearDirectory(directory);
    makeMetaDataFile(directory)
    makeXmlFiles(directory);
    makeTxtFiles(directory);
    return true;
}

let setupMultipleDir = (directory) => {
    // makeDirectory(directory);
    // cleanDirectory(directory); 
    const subDir1 = directory + '/test1';
    const subDir2 = directory + '/test2'; 
    makeDirectory(subDir1);
    clearDirectory(subDir1); 
    makeXmlFiles(subDir1);
    makeMetaDataFile(subDir1) 
    makeDirectory(subDir2);
    clearDirectory(subDir2);
    makeXmlFiles(subDir2);
    makeMetaDataFile(subDir2) 
}

module.exports = {
    setUpTests,
    setupMultipleDir
};