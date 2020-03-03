// let Promise = require('./promise')
let promise = new Promise((resolve, reject) => {
    resolve();
});

// promise2会等待里面return promise2执行完成。 return 里面promise2不会完成。
// 所以直接失败报错。
let promise2 = promise.then(() => {
    // 报错TypeError: Chaining cycle detected for promise #<Promise> 。循环了
    return promise2;
})
promise2.then(function (data) {
    console.log('data', data)
}, function (err) {
    console.log(err);
});
