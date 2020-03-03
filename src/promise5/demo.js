/**
 * promise 相关方法 catch、all等
 * */
let Promise = require('./promise');


// catch的用法写法
let p = new Promise((resolve, reject) => {
    reject(100);
});
p.catch((err) => {
    console.log(err);
});

/**
 *  如何终止promise链？ 返回一个等待的promise
 * */
let promise = new Promise((resolve, reject) => {
    resolve();
});
promise.then(function () {
    // 走到这 后面的then不要在执行了
    console.log(1);
    return new Promise(() => {
    })
}).then(function () {
    console.log(2);
});
/**
 *  finally 的特点 无论成功还是失败都执行 ，但是如果返回的是一个promise需要等待这个promise之行完在继续向下执行
 * */
new Promise((resolve, reject) => {
    reject(100)
}).finally(() => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('finally')
            resolve();
        }, 3000);
    });
});
/**
 * promise.all
 * */
let fs = require('fs').promises;
const path = require('path');

Promise.all([
    fs.readFile(path.join(__dirname, 'name.txt'), 'utf-8'),
    fs.readFile(path.join(__dirname, 'age.txt'),'utf-8'),
    1,
    2
]).then(data => {
    console.log('all', data);
}).catch(err => {
    console.log('err', err)
});

