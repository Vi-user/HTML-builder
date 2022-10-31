const path = require('path');
const fs = require('fs/promises')

const pathToFolder = path.join(__dirname, 'secret-folder');

fs.readdir(pathToFolder, {'withFileTypes': true})
  .then(result => result.filter(el => el.isFile()).map(el => el.name))
  .then(function (fileNames) {
    const stats = Promise.all(fileNames.map(file => {
      const pathToFile = path.join(__dirname, 'secret-folder', file);
      fs.stat(pathToFile)
        .then(res => console.log(`${file.split('.').join(' - ')} - ${(res.size/1024).toFixed(3)}Kb`))
    }));
  })
  .catch(err => console.log(err))
