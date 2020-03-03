/**
 * promise链式调用的基本使用
 */
let fs = require('fs');

// 1） 把异步的方法变成promise
function read(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', function (err, data) {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    })
}

// promise 的链式调用
/**
 * 先读取name在读取age
 * */
read('name.json').then(function (data) {
    console.log('name', data)
    return read(JSON.parse(data).name);
}).then(data => {
    console.log('age', data);
});

/**
 * then 返回的也是一个promise
 * 如果then方法中函数执行的时候发生错误 ，会走下一个then的失败的回调
 * */
// 在promise中实现链式调用 靠的不是返回this
let p = new Promise((resolve, reject) => {
    throw new Error();
}).then(null, err => { // 已经走到catch 这个promise 已经是失败态了
    return 100;
});

p.then((data) => { // 返回了一个新的promise
    console.log('data', data)
}, (err) => {
    console.log('err', err)
})
