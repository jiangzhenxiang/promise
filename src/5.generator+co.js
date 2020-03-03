/**
 * Generator + co库
 * https://github.com/tj/co
 * */
// 先读取 name.txt 在读取age.txt
// generator + promise 来使用
let fs = require('fs').promises;
let path = require('path');

function* read() {
    let content = yield fs.readFile(path.join(__dirname, "name.txt"), 'utf8');
    let age = yield fs.readFile(path.join(__dirname, content), 'utf8');
    return age;
}

const co = require('co');
co(read()).then(data => {
    console.log('age', data);
});

/**
 * co库简单实现
 * */

function myCo(it) {
    return new Promise((resolve, reject) => {
        // 异步迭代 next
        function next(data) {
            let {value, done} = it.next(data);
            if (!done) {
                Promise.resolve(value).then(data => {
                    next(data)
                }, reject);
            } else {
                resolve(value);
            }
        }

        next();
    });
}

myCo(read()).then(data => {
    console.log('age2', data);
});


