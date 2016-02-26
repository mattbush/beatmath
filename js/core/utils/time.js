var runAtTimestamp = function(cb, timestamp) {
    var timeout = timestamp - Date.now();
    setTimeout(cb, timeout);
};

module.exports = {
    runAtTimestamp,
};
