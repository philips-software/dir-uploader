# dloader (A single or multi directory uploader using a REST Multipart request)
[![NPM](https://img.shields.io/npm/v/dir-uploader.svg)]()
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=philips-software_dir-uploader&metric=alert_status)](https://sonarcloud.io/dashboard?id=philips-software_dir-uploader)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://scm.sapphirepri.com/arsalan.siddiqui/dir-uploader.git)
 
**Description**: This is a npm module to upload all files in a directory or to upload files of a specific type to a rest end point using multipart request. If you just pass in a file instead of directory then it will just upload the given file. If there are multiple files in a directory it sends one multipart request attaching all the files to it. Please see the configuration section for the option details 

- **Technology stack**: This is a npm module written in Vanilla JS.   
- **Status**:  This is the first functional version of this module. We are planning to add a change log starting from the next version  

## Dependencies
It is dependent on the following node modules 
- "form-data": To create multipart request object
- "node-fetch": To send REST request 
- "colors": For colorful output messages in terminal

## Installation
One way is to keep `dir-uploader` as a dependency in your `package.json` pointing to its current repo 

```bash
npm install dir-uploader --save-dev
```

To update to the latest version
```bash
npm update dir-uploader 
```

## Configuration
The following are the configurable options using command `npm run send-data` 
```   
url: The URL of REST end point where we post the files

result-path: the folder or file that need to be posted

metadata-file: meta data file that need to be posted

export-file-type: file type you want uploaded or true for all files in directory

delete-files: do we want to delete folder files after successfully sending the files
```

## Usage
You can use it using a commandline or inside another JS file as an import.

From Command line you can either
- create and use send-data npm task 
- or directly call export function sendData

**Using send-data npm task:**

package.json script line would look like this
```
"send-data": "node -e 'require(\"dir-uploader\").sendData()'"
```

At command prompt:
```
npm run send-data -- url='http://localhost:9456/resultmultipartupload' result-path='_test-reports/e2e-test-results/browser-based-results_2020-01-15T17_04' metadata-file='_test-reports/e2e-test-results/browser-based-results_2020-01-15T17_04/metadata.json' export-file-type=xml delete-files=false
```

**Using js exported function sendData:**

```
node -e 'require("./dir-uploader").sendData("http://localhost:3020/post","tests/e2e/sample-exports/browser-based-results","tests/e2e/sample-exports/test.json",false,true)'
```

You can also find an example of how to use module in the tests folder "runTests.js" file. These are e2e tests for this module.

## How to test the software
This module includes a tests folder that contains a simple node test app, unit tests and end to end(e2e) tests. The tests runner is mocha (https://mochajs.org/). To run the tests 
1. Firstly, install all the dependencies by `npm install`.
2. Go into testapp dir `cd tests/testapp` and run `npm install` to install testApp dependencies.
3. It is easier to run when you install mocha as a global dependency `npm i -g mocha`
4. Start the node test app `node tests/testapp/server.js` (tested on node v13).
5. Run the tests `mocha tests/runTests.js`


## Logging
This module includes logging using the winston node js plugin. If you need to lower the logging level from error for any reason you can change the logging level inside the dir-uploader.js file.

## Known issues
We are actively using this module as a component in our Continuous Integration Cycle and we don't have any open issue. Please contact us if you run into any issues.

## Contact / Getting help
You can contact any of us if you run into any issues 
- Arsalan Siddiqui <<Arsalan.Siddiqui@philips.com>>
- James Landy <<James.Landy@philips.com>>

## License
[MIT License](LICENSE.md) 

## Credits and references
We needed this module to export our test results to a rest end point so we wrote it. We have tried to make it general with the configurable options  as possible. Please let us know if you have any suggestions. We thank you to "Philips Health Solutions" in general to give us opportunity to write this plugin.
