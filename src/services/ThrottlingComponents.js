export function throttlingComponents (delay, callback) {
    let lastCall = 0;
    return function (args) {
        let now = Date.now()
        if(now - lastCall < delay) return
        lastCall = Date.now()
        callback(args)
    }
}