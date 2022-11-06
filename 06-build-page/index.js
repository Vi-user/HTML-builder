const path = require('path');
const fs = require('fs/promises');
const { createReadStream, createWriteStream } = require('fs');

const distFolder = path.join(__dirname, 'project-dist');
const curAssetsFolder = path.join(__dirname, 'assets');
const copyAssetsFolder = path.join(distFolder, 'assets');

async function joinStyles() {
  try {
    const stylesFolder = path.join(__dirname, 'styles');

    const files = await fs.readdir(stylesFolder)
    const styleFiles = await files.filter(file => path.extname(path.join(stylesFolder, file)) === '.css' )
    const bundleFile = path.join(distFolder, 'style.css');
    const writeStream = createWriteStream(bundleFile);
    styleFiles.forEach(file => {
      const curFile = path.join(stylesFolder, file);
      const readStream = createReadStream(curFile)
      readStream.pipe(writeStream)
    })
    console.log('bundle style.css is ready')
  } catch (err) {
    console.error(`joinStyles Error: ${err}`)
    throw err;
  }
}

async function copyDir(dirName) {
  try {
    const curFolder = path.join(curAssetsFolder, dirName);
    const copyFolder = path.join(copyAssetsFolder, dirName);

    const copiedDir = await fs.mkdir(copyFolder, {recursive: true});
    const curFolderFiles = await fs.readdir(curFolder);
    curFolderFiles.forEach(file => {
      const curFile = path.join(curFolder, file);
      const newFile = path.join(copyFolder, file);
      fs.copyFile(curFile, newFile);
    })
    console.log(`${dirName} directory was successfully copied into project-dist assets dir` )
  } catch (err) {
    console.error(`copyDir Error: ${err}`)
    throw err;
  }
}

async function getContent(componentsFolder, file) {
  try {
    const res = await fs.readFile(componentsFolder)
    const content = await res.toString()
    return { [file.split('.')[0]]: content}
  } catch (err) {
    console.error(`getContent Error: ${err}`)
    throw err;
  }
}

async function addHtmlComponents() {
  try {
    let htmlContent = await fs.readFile(path.join(__dirname, 'template.html'), 'utf-8');
    const files = await fs.readdir(path.join(__dirname, 'components'), {'withFileTypes': true})
      .then(result => result.filter(el => el.isFile()).map(el => el.name))
    const arrComponents = await Promise.all(files.map(file => {
      const componentsFolder = path.join(__dirname, 'components', file);
      return getContent(componentsFolder, file);
    }))
    arrComponents.map(component => {
      const componentName = Object.keys(component)[0];
      const searchingComponent = new RegExp(`{{${componentName}}}`);
      htmlContent = htmlContent.replace(searchingComponent, component[componentName])
    })
    const newFile = path.join(distFolder, 'index.html');
    await fs.writeFile(newFile, htmlContent);
    console.log('index.html ready and added to dist folder')
  } catch (err) {
    console.error(`addHtmlComponents Error: ${err}`)
  }
}

async function bundleApp() {
  try {
    if (distFolder) await fs.rm(distFolder, { recursive: true, force: true });
    const distDir = await fs.mkdir(distFolder);
    const stylesFile = await joinStyles();
    const assetsFolders = await fs.readdir(curAssetsFolder)
    await assetsFolders.forEach(folder => copyDir(folder))
    await addHtmlComponents()
    console.log('bundle is ready')
  } catch (err) {
    console.error(`bundleApp Error: ${err}`)
    throw err;
  }
}

bundleApp()