const path = require('path');
const fs = require('fs');
const { stdin: input, stdout: output } = process;
const readline = require('readline/promises');


const newFile = path.join(__dirname, 'text.txt')
output.write('Hi, write in the console what you want to save.\nTo exit write "exit" or press "ctrl + c".\n');

const rl = readline.createInterface( { input, output })

rl.on('line', (input) => {
    if (input === 'exit') {
        output.write('Changes have been saved in "text.txt", buy');
        rl.close()
    }
    fs.appendFile(newFile, `${input}\n`, (err) => {
        if (err) throw err;
    })
})

rl.on('SIGINT', () => {
    output.write('Changes have been saved in "text.txt", have a nice day, buy =)');
    rl.close()
})
