const express = require('express');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
const app = express();

let confUpload = upload.fields([{ name: 'info', maxCount: 4 }, { name: 'tests', maxCount: 4 }]); 
// Multipart post req
app.post("/post/result", confUpload, function (req, res) {
    console.log('recieved request');
    res.set('Content-Type', 'application/json');
    res.status(200);
    const responseText = JSON.stringify({
        result:'All test results uploaded',
        metaDataFilesCount: req.files['info'].length,
        resultFilesCount: req.files['tests'].length
    });
    res.send(responseText);
    console.log('Sent back the response: ' + responseText);
});

app.listen(3020, function() {
    console.log('Example app listening on port 3020')
});