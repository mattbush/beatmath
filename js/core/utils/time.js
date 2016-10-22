const runAtTimestamp = function(cb, timestamp) {
    const timeout = timestamp - Date.now();
    setTimeout(cb, timeout);
};

const setTimeoutAsync = function(timeout) {
    return new window.Promise(function(cb) { setTimeout(cb, timeout); });
};

module.exports = {
    runAtTimestamp,
    setTimeoutAsync,
};
