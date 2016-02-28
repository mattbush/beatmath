var runAtTimestamp = function(cb, timestamp) {
    var timeout = timestamp - Date.now();
    setTimeout(cb, timeout);
};

var setTimeoutAsync = function(timeout) {
    return new window.Promise(function(cb) { setTimeout(cb, timeout); });
};

module.exports = {
    runAtTimestamp,
    setTimeoutAsync,
};
