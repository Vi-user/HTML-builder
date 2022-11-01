const path = require('path');
const fs = require('fs/promises');

const curFolder = path.join(__dirname, 'files');
const copyFolder = path.join(__dirname, 'files-copy');

async function clearDir(folder) {
  try{
    const files = await fs.readdir(folder);
    const deleteFiles = files.map(file => fs.unlink(path.join(folder, file)))
    return Promise.all(deleteFiles)
  } catch (err) {
    console.error(`Error: ${err}`)
  }
}


async function copyDir() {
  try {
    const copiedDir = await fs.mkdir(copyFolder, {recursive: true});
    const clearNewDir = await clearDir(copyFolder);
    const curFolderFiles = await fs.readdir(curFolder);
    curFolderFiles.forEach(file => {
      const curFile = path.join(curFolder, file);
      const newFile = path.join(copyFolder, file);
      fs.copyFile(curFile, newFile);
    })
    console.log(`files directory were successfully copied into files-copy dir` )
  } catch (err) {
    console.error(`Error: ${err}`)
  }
}

copyDir();



