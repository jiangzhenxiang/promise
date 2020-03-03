/**
 * promise基本使用
 * */
// 如果要使用一个模块
let Promise = require('./promise'); //引用自己实现的promise
// Promise构造函数接受一个函数作为参数，该函数的两个参数分别是resolve和reject
// promise有三种状态pending、rejected、resolved
let p = new Promise((resolve, reject) => { // executor 执行器
    // pending
    console.log('executor');
    resolve('赚钱了');// 变成成功
    reject('没有钱'); // 不能变成失败
});
// 每个promise的实例上都有一个then方法
p.then((value) => { // fulfilled
    console.log('成功', value);
}, (reason) => { // rejected
    console.log('失败', reason);
});
