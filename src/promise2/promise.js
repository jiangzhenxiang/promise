/**
 * promise处理异步的基本实现
 * */
const SUCCESS = 'resolved';
const FAIL = 'rejected';
const PENDING = 'pending';

class Promise {
    constructor(executor) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onResolvedCallbacks = [];// 存储成功的所有的回调 只有pending的时候才存储
        this.onRejectedCallbacks = [];// 存储失败的所有的回调 只有pending的时候才存储

        const resolve = (value) => {
            if (this.status === PENDING) {
                this.value = value;
                this.status = SUCCESS;
                this.onResolvedCallbacks.forEach(fn => fn());
            }
        };

        const reject = (reason) => {
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

    then(onFulfilled, onRejected) {
        if (this.status === SUCCESS) {
            onFulfilled(this.value);
        }
        if (this.status === FAIL) {
            onRejected(this.reason);
        }
        if (this.status === PENDING) {
            this.onResolvedCallbacks.push(() => {
                onFulfilled(this.value);
            });
            this.onRejectedCallbacks.push(() => {
                onRejected(this.reason);
            })
        }
    }
}

module.exports = Promise;
