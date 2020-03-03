/**
 * then的返回值可以是常量，可以是promise
 * 处理当then返回值是promise的情况
 * */
let Promise1 = require('./promise');


let p = new Promise1((resolve, reject) => {
    resolve();
});

let promise2 = p.then(function (data) {
    return new Promise((resolve, reject) => {
        resolve(new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('hello')
            }, 1000);
        }))
    })

});
promise2.then(data => {
    console.log(data);
}, function (err) {
    console.log(err, 'err');
})
