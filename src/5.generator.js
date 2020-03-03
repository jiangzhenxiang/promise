// 生成器 =》 迭代器的
// 函数 里面的声明 *  yield 来实现
/**
 * 1
 * 声明：function关键字与函数名之间有一个星号*
 * 函数体内部使用yield表达式
//  * */
// function* read() {
//     try {
//         console.log(1);
//         yield 1;  // 函数体内部使用yield表达式，yield会暂停代码执行
//         console.log(2);
//         yield 2;
//         console.log(3);
//     } catch (err) {
//         console.log(err);
//     }
// }
//
// // 调用 Generator 函数后，该函数并不执行，只是创建了一个迭代器对象
// let it = read();
// // 使用next方法执行，直到遇到下一个yield或return。 每执行一次next，向下走一步
// // 每遇到一个yield,就会返回一个{value:xxx,done:bool}的对象
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());
// // throw方法抛出错误 让tryCatch 来捕获
// // it.throw('出错了');
//
// /**
//  * 2 generator传参
//  * */
// function* buy() {
//     let a = yield 1;
//     console.log('a', a);
//     let b = yield 2;
//     console.log('b', b);
//     return b;
// }
//
// let it2 = buy();
// // next()方法可以带一个参数，该参数会被当做上一条yield语句的返回值，并赋值给yield前面等号前的变量
// it2.next('hello'); // 第一次的next传递参数是无效的
// it2.next('world');
// it2.next('姜振祥');

/**
 * generator + promise 来使用
 * 先读取 name.txt 在读取age.txt
 * */
function* read2() {
    let fs = require('fs').promises; //node10提供的方法，返回promise
    let path = require('path');
    let content = yield fs.readFile(path.join(__dirname, "name.txt"), 'utf8');
    let age = yield fs.readFile(path.join(__dirname, content), 'utf8');
    return age;
}

let it3 = read2();
let {value, done} = it3.next();
console.log('value1', value)

// 里面的代码都是相同的，
value.then(function (data) {
    let {value, done} = it3.next(data);
    value.then(function (data) {
        value.then(function (data) {
            let {value, done} = it3.next(data);
            console.log('age', value)
        })
    })
}, function (err) {
    it3.throw(err);
});


