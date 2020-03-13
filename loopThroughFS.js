let fs = require('fs');
let recursive = require("recursive-readdir");

//grab files recursively
recursive("./the_data/blogposts", [".git*", "node_modules/*", ], function (err, files) {
    let promises=[];
    if (err) {
      console.log(err);
    } else {
    for (let i = 0; i < files.length; i++) {
      fs.readFile(files[i], function (err, data) {
        if (err)
          throw err;
        if (data){         
          let blogpost = JSON.parse(data.toString('utf8'));
          console.log(blogpost['uuid']); 
        }
      });
    }
  }
});

