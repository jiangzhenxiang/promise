/**
 * 观察者模式：一个对象（称为subject）维持一系列依赖于它的对象（称为observer），将有关状态的任何变更自动通知给它们（观察者）。
 * */

// 以读者和出版社为例，一个出版社有多个读者。读者是观察者，出版社是被观察者。
// 当出版社（被观察者）的杂志有更新时，会自动通知读者（观察者）

// 被观察者
class Subject {
    constructor() {
        this.observers = []; // 用来存储观察者
    }

    registerObserver(observer) {
        this.observers.push(observer);
    }

    unregisterObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }
    // 通知观察者。
    notifyObservers(data) {
        this.observers.forEach(observer => observer.notify(data));
    }
}

// 观察者
class Observer {
    constructor(name) {
        this.subscribers = [];// 用来放观察者的回调函数
    }

    subscribe(subscriber) {
        this.subscribers.push(subscriber);
    }

    notify(data) {
        this.subscribers.forEach(subscriber => subscriber(data));
    }
}

/**
 * 使用
 * */
const publisher = new Subject(); // 被观察者
const readerA = new Observer(); // 观察者
const readerB = new Observer();

publisher.registerObserver(readerA);
publisher.registerObserver(readerB);

readerA.subscribe(data => {
    console.log(`读者A，你订的${data}更新了`)
});

readerB.subscribe(data => {
    console.log(`读者B，你订的${data}更新了`)
});

// 更改被观察者的状态，当被观察者的状态有变化时，通知观察者。
const fs = require('fs');
fs.readFile('rmrb.json', function (err,data) {
    publisher.notifyObservers(JSON.parse(data).name);
});

fs.readFile('lonelyPlanet.json', function (err,data) {
    publisher.notifyObservers(JSON.parse(data).name);
});
