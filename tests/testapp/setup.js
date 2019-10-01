const fs = require('fs');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;
const logging = createLogger({
    level: 'error',
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

let directory = './tests/e2e/sample-exports/automated-based-results';
let xmlFile = '<?xml version="1.0"?>\n' +
    '<testsuites>\n' +
    '  <testsuite name="chrome 75.0.3770.100" timestamp="2019-07-10T14:32:13" id="0" hostname="Ms-MacBook-Pro.local" tests="1" failures="1">\n' +
    '    <testcase requirements="XRAY-1234" name="The login page is loaded successfully" time="0" classname="Given">\n' +
    '      <failure msg="testcase failed"/>\n' +
    '    </testcase>\n' +
    '  </testsuite>\n' +
    '  <testsuite name="chrome 75.0.3770.100" timestamp="2019-07-10T14:33:04" id="0" hostname="Ms-MacBook-Pro.local" tests="1" failures="0">\n' +
    '    <testcase requirements="XRAY-1234" name="The login page is loaded successfully" time="0" classname="Given"/>\n' +
    '  </testsuite>\n' +
    '  <testsuite name="chrome 75.0.3770.100" timestamp="2019-07-10T14:48:13" id="0" hostname="Ms-MacBook-Pro.local" tests="1" failures="0">\n' +
    '    <testcase requirements="XRAY-1234" name="The login page is loaded successfully" time="0" classname="Given"/>\n' +
    '  </testsuite>\n' +
    '</testsuites>';
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
    fs.readdirSync(directory).forEach(filename =>
        fs.unlink(directory + '/' + filename, err => {
            if (err) return logging.log('error', err);
            logging.log('debug', (filename + ' deleted successfully'));
        })
    )
};

let makeXmlFiles = (directory) => {
    fs.writeFile(directory + '/XmlFile.xml', xmlFile, function(err) {
        if (err) return logging.log('error', err);
        logging.log('debug', 'XmlFile.xml is created successfully.');
    });
    fs.writeFile(directory + '/XmlFile2.xml', xmlFile, function(err) {
        if (err) return logging.log('error', err);
        logging.log('debug', 'XmlFile2.xml is created successfully.');
    });
    return true;
};

let makeTxtFiles = (directory) => {
    fs.writeFile(directory + '/Json.txt', txtFile, function(err) {
        if (err) return logging.log('error', err);
        logging.log('debug', 'Json.txt is created successfully.');
    });
    fs.writeFile(directory + '/Json2.txt', txtFile, function(err) {
        if (err) return logging.log('error', err);
        logging.log('debug', 'Json.txt is created successfully.');
    });
    return true;
};


let setUpTests = (directory) => {
    makeDirectory(directory);
    clearDirectory(directory);
    makeXmlFiles(directory);
    makeTxtFiles(directory);
    return true;
}

setUpTests(directory);

module.exports = {
    setUpTests
};