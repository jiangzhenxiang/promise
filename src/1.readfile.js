const fs = require('fs');
const path = require('path');

fs.readFile(path.join(__dirname, "./age.json"), 'utf-8', function (err, data) {
    // console.log('111', data)
});

/**
 * 回调地狱
 */
// fs.readFile(path.join(__dirname, "./age.json"), 'utf-8', function (err, data) {
//     fs.readFile(path.join(__dirname, "./age.json"), 'utf-8', function (err, data) {
//         fs.readFile(path.join(__dirname, "./age.json"), 'utf-8', function (err, data) {
//             fs.readFile(path.join(__dirname, "./age.json"), 'utf-8', function (err, data) {
//                 console.log('data', data)
//             });
//         });
//     });
// });

/**
 * 不容易错误追踪
 */
// fs.readFile(path.join(__dirname, "./age.json"), 'utf-8', function (err, data) {
//     if (err) {
//         return
//     }
//     fs.readFile(path.join(__dirname, "./age.json"), 'utf-8', function (err, data) {
//         if (err) {
//             return
//         }
//         fs.readFile('age.json', 'utf-8', function (err, data) {
//             if (err) {
//                 return
//             }
//             fs.readFile('age.json', 'utf-8', function (err, data) {
//                 try {
//                     console.log('data', data)
//                 } catch (e) {
//                     console.log('e', e)
//                 }
//             });
//         });
//     });
// });

/**
 * 并发问题
 * 想要等age.json和name.json都拿到后，做一些处理
 */
// 1.嵌套
// fs.readFile(path.join(__dirname, "./age.json"), 'utf-8', function (err, data) { // 读age耗时2s
//     fs.readFile(path.join(__dirname, "./name.json"), 'utf-8', function (err, data) { // 读name耗时3s
//         // 共5s
//         console.log('data', data)
//     });
// });

// 如果我们想多个异步都拿到结果是在处理，需要使用计数器。
// 2.计数器
let school = {};

function out() {
    if (Object.keys(school).length === 2) {
        console.log('school', school);
    }
}

fs.readFile(path.join(__dirname, "./name.json"), 'utf-8', function (err, data) { // 读name耗时3s
    school.name = data;
    out()
});
fs.readFile(path.join(__dirname, "./age.json"), 'utf-8', function (err, data) { // 读name耗时3s
    school.age = data;
    out();
});

// 3.after函数
function after(times, callback) {
    let school = {};
    return function out(key, value) {
        school[key] = value;
        if (--times === 0) {
            callback(school);
        }
    }
}
// after的问题是回调函数只有一个
let output = after(2, (school) => {
    console.log(school)
});


fs.readFile(path.join(__dirname, "./name.json"), 'utf-8', function (err, data) { // 读name耗时3s
    output('name', JSON.parse(data).name)
});
fs.readFile(path.join(__dirname, "./age.json"), 'utf-8', function (err, data) { // 读name耗时3s
    output('age', JSON.parse(data).age);
});
