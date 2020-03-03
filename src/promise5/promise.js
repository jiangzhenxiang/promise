/**
 * promise 相关方法 catch、all等
 * */
const PENDING = "PENDING";
const SUCCESS = "FULFILLED";
const FAIL = "REJECTED";

// 严谨应该判断 别人的promise 如果失败了就不能在调用成功 如果成功了不能在调用失败
function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('TypeError: Chaining cycle detected for promise #<Promise>'));
    }
    let called;
    if (typeof x === 'function' || (typeof x === 'object' && x != null)) {
        try {
            let then = x.then;  // then 可能是getter object.defineProperty
            if (typeof then === 'function') {  // {then:null}
                then.call(x, y => {
                    if (called) return; // 1)
                    called = true;
                    resolvePromise(promise2, y, resolve, reject);
                }, r => {
                    if (called) return; // 2)
                    called = true;
                    reject(r);
                })
            } else {
                resolve(x);
            }
        } catch (e) {
            if (called) return; // 3) 为了辨别这个promise 不能调用多次
            called = true;
            reject(e);
        }
    } else {
        resolve(x);
    }
}

class Promise {
    constructor(executor) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];
        const resolve = value => {
            if (value instanceof Promise) { // resolve的结果是一个promise
                return value.then(resolve, reject); // 那么会让这个promise执行，将执行后的结果在传递给 resolve或者reject中
            }
            if (this.status === PENDING) {
                this.value = value;
                this.status = SUCCESS;
                this.onResolvedCallbacks.forEach(fn => fn());
            }
        };
        const reject = reason => {
            if (this.status === PENDING) {
                this.reason = reason;
                this.status = FAIL;
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        };
        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }

    then(onFulfilled, onRejected) { // .catch(function(){}) .then(null,function)
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
        onRejected = typeof onRejected === 'function' ? onRejected : err => {
            throw err
        }
        let promise2;
        promise2 = new Promise((resolve, reject) => {
            if (this.status === SUCCESS) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (err) {
                        reject(err);
                    }
                });
            }
            if (this.status === FAIL) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (err) {
                        reject(err);
                    }
                });
            }
            if (this.status === PENDING) {
                this.onResolvedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (err) {
                            reject(err);
                        }
                    });
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (err) {
                            reject(err);
                        }
                    });
                });
            }
        });
        return promise2;
    }

    catch(errCallback) { // 用来捕获错误 ， 语法糖
        return this.then(null, errCallback)
    }
}
/**
 * Promise.resolve('foo') 等价于 new Promise(resolve => resolve('foo'))
 * */
Promise.resolve = function (value) {
    return new Promise((resolve, reject) => {
        resolve(value);
    })
}
Promise.reject = function (value) {
    return new Promise((resolve, reject) => {
        reject(value);
    })
}
Promise.prototype.finally = function (callback) {
    return this.then((data) => {
        return Promise.resolve(callback()).then(() => data);
    }, (err) => {
        return Promise.resolve(callback()).then(() => {
            throw err
        });
    });
};

Promise.all = function(values){
    function isPromise(value){
        if(typeof value === 'function' || (typeof value === 'object' && value !== null)){
            if(typeof value.then === 'function'){
                return true;
            }
        }
        return false;
    }
    return new Promise((resolve,reject)=>{
        let arr = [];
        let i = 0;
        // 原理：利用after计数器
        let processData = (key,value)=>{
            arr[key] = value; // after函数
            if(++i === values.length){
                resolve(arr);
            }
        };
        for(let i = 0 ; i < values.length;i++){
            let current = values[i];
            if(isPromise(current)){
                current.then(y=>{
                    processData(i,y);
                },reject);
            }else{
                processData(i,current);
            }
        }
    })
};
module.exports = Promise;
