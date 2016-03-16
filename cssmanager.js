'use strict'

const fs = require('fs');
let thisFolder = null;

exports.init = function(folderPath){
    isDirectoryExist(folderPath, function(err, folder) {
        if (err) callback(err);
        else { thisFolder = folder; }
    });
}

exports.get = function(key, callback) {
    let slash = (key[key.length - 1] == '/') ? '' : '/'
    let file = thisFolder + slash + key + '.cssitem';
    fs.readFile(file, function(err, data) {
        if (err) callback && callback(null, '该条目待添加');
        else callback && callback(null, data);
    });
}

function isDirectoryExist(folderPath, callback) {
    fs.stat(folderPath, function(err, stats) {
        if (err) { callback && callback(err); }
        else {
            if (stats.isDirectory()) {
                callback && callback(null, folderPath);
            }
            else {
                let errorItem = new Error('['+folderPath+'] is not a Directory.');
                callback && callback(errorItem); 
            }
        }
    });
}
