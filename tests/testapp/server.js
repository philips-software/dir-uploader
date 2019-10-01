const express = require('express');
const app = express();

app.post("/post", function (req, res) {
    res.set('Content-Type', 'application/json');
    res.status(200);
    res.send(JSON.stringify({a:1}));
})

app.listen(3020, function() {
    console.log('Example app listening on port 3020')
});