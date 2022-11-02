const path = require('path');
const fs = require('fs/promises');
const { createReadStream, createWriteStream } = require('fs');


async function joinStyles() {
  try {
    const stylesFolder = path.join(__dirname, 'styles');

    const files = await fs.readdir(stylesFolder)
    const styleFiles = await files.filter(file => path.extname(path.join(stylesFolder, file)) === '.css' )
    const bundleFile = path.join(__dirname, 'project-dist', 'bundle.css');
    const writeStream = createWriteStream(bundleFile);
    const result = await styleFiles.forEach(file => {
        const curFile = path.join(stylesFolder, file);
        const readStream = createReadStream(curFile)
        readStream.pipe(writeStream)
      })
    console.log('bundle is ready')
  } catch (err) {
    console.error(`Error: ${err}`)
  }
}

joinStyles();