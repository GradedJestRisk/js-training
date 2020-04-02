const execProcess = require("./exec_process.js");

function runScript(){
    execProcess.result("sh temp.sh", function (err, response) {
        if (!err) {
            console.log(response);
        } else {
            console.log(err);
        }
    });
}

function fileExists({ filePath, fileName}) {
    const fs = require('fs');
    const path = filePath + fileName;

    try {
        if (fs.existsSync(path)) {
            return true;
        }
    } catch (err) {
        console.error(err)
    }
}

(function main(){

    runScript();

    const path = '/tmp/git-sandbox/';

    const committedFile = 'README.md';
    if( fileExists({filePath: path, fileName: committedFile})){
        console.log('OK, committed file exists');
    } else {
        console.log('KO, committed file' + committedFile + ' does not exists');
    }

    const revertedFile = 'foo.bar';
    if( ! fileExists({ilePath: path, fileName: revertedFile})){
        console.log('OK, reverted file does not exists');
    } else {
        console.log('KO, reverted file ${revertedFile} does exists');
    }


})();



