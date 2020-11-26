const express = require('express');
const multer  = require('multer');
const fs = require('fs');
const path = require('path');

const port = 23456;

const app = express();

const temporaryDirectory = `${ __dirname }/tmp`;
const destinationDirectory = `${ __dirname }/destination`;

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, `${temporaryDirectory}/`)
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

const uploadMiddleware = multer({ storage });
const getExtension = filename => filename.split('.').pop();

app.post('/upload', uploadMiddleware.single('file'), (req, res) => {
    console.log('req.file', req.file);

    const tempPath = req.file.path;
    const targetPath = `${destinationDirectory}/${req.file.filename}.${getExtension(req.file.originalname)}`;

    fs.rename(tempPath, targetPath, err => {
        if (err) return;
        res
            .status(200)
            .contentType("text/plain")
            .end("File uploaded!");
    });

});


app.listen(port, () => {
    console.log(`-=- App runs on port ${port} -=-`);
});