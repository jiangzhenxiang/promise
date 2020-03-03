/**
 * 发布订阅：
 * 就是把想要做的事情先想好了，等时机成熟，将事情依次执行
 * 发布订阅是一种1对多的关系
 * */
const fs = require('fs');

class Events {
    constructor() {
        this.stack = {};
    }

    // 订阅  把想好的事情放到一个数组里[fn1,fn2,fn3]
    // 往数组[]里放的过程叫订阅
    on(type, callback) {
        this.stack[type] = [];
        this.stack[type].push(callback);
    }

    // 发布 等时机成熟，将fn执行
    // 让fn执行叫发布
    emit(type) {
        this.stack[type].forEach(callback => callback())
    }
}

/**
 * 使用
 * 订阅了2本杂志
 * */
const events = new Events();
const bookcase = {}; // 书架
events.on('show', function () {
    if (Object.keys(bookcase).length === 2) {
        console.log('书架', bookcase);
    }
});

events.on('update', function () {
    console.log('看杂志');
});

fs.readFile('rmrb.json', 'utf-8', function (err, data) {
    bookcase.rmrb = JSON.parse(data).name;
    events.emit('update');
    events.emit('show');
});

fs.readFile('lonelyPlanet.json', 'utf-8', function (err, data) {
    bookcase.lonelyPlanet = JSON.parse(data).name;
    events.emit('update');
    events.emit('show');
});

// 比回调函数的优势是可以订阅多个回调
