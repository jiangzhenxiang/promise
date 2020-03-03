/**
 * then的返回值可以是常量，可以是promise
 * 处理当then返回值是promise的情况
 * */
const PENDING = "PENDING";
const SUCCESS = "FULFILLED";
const FAIL = "REJECTED";

function resolvePromise(promise2, x, resolve, reject) {
    // console.log('promise2', promise2)
    if (promise2 === x) {
        return reject(new TypeError('TypeError: Chaining cycle detected for promise #<Promise>'));
    }

    // 怎么判断 x是不是一个promise 看他有没有then方法
    if (typeof x === 'function' || (typeof x === 'object' && x != null)) {
        try {
            let then = x.then; // 去then方法可能会出错
            // x是then的返回值，判断x的类型如果是一个promise
            if (typeof then === 'function') {
                // 如果promise, 调用then方法，是成功的就把结果向下传，如果失败的就让下一个人也失败
                then.call(x, y => {
                    resolvePromise(promise2, y, resolve, reject); // 递归
                }, r => {
                    reject(r);
                })
            } else {
                resolve(x);
            }
        } catch (e) {
            reject(e);
        }
    } else { // x是个常量，则直接resolve
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

    // 同一个promise then 多次
    then(onFulfilled, onRejected) {
        let promise2;
        // 可以不停的调用then方法,返还了一个新的promise
        // 异步的特点 等待当前主栈代码都执行后才执行
        promise2 = new Promise((resolve, reject) => {
            if (this.status === SUCCESS) {
                // setTimeout为了在resolvePromise函数中能拿到promise2。
                setTimeout(() => {
                    try {
                        // 调用当前then方法的结果，来判断当前这个promise2 是成功还是失败
                        let x = onFulfilled(this.value);
                        // 这里的x是普通值还是promise
                        // 如果是一个promise呢？
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
}

module.exports = Promise;
