// async就是generator的语法糖
let fs = require('fs').promises;
const path = require('path');

async function read() {
    try {
        let content = await fs.readFile(path.join(__dirname, "name1.txt"), 'utf8');
        console.log('content', content)
        let age = await fs.readFile(path.join(__dirname, content), 'utf8');
        console.log('age', age)
        return age;
    } catch (err) {
        console.log('err', err);
    }
}

// async函数返回的是一个promise
read().then(r => {
    console.log(r);
});

// async + await 就是 generator + co 库
