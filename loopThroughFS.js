let fs = require('fs');
let recursive = require("recursive-readdir");

//grab files recursively
recursive("./config", [".git*", "node_modules/*", ], function (err, files) {
    let promises=[];
    if (err) {
      console.log(err);
    } else {
    for (let i = 0; i < files.length; i++) {
      fs.readFile(files[i], function (err, data) {
        if (err)
          throw err;
        if (data)
          console.log(data.toString('utf8'));
      });
    }
  }
});

