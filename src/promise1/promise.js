/**
 * promise基本实现
 * */
const SUCCESS = 'resolved';
const FAIL = 'rejected';
const PENDING = 'pending';

class Promise {
    constructor(executor) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;

        const resolve = (value) => {
            if (this.status === PENDING) {
                this.value = value;
                this.status = SUCCESS;
            }
        };

        const reject = (reason) => {
            if (this.status === PENDING) {
                this.reason = reason;
                this.status = FAIL;
            }
        };

        executor(resolve, reject);
    }

    then(onFulfilled, onRejected) {
        if (this.status === SUCCESS) {
            onFulfilled(this.value);
        }
        if (this.status === FAIL) {
            onRejected(this.reason);
        }
    }
}

module.exports = Promise;
