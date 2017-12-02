const NUM_CHANNELS = 4;
const mapColorString = require('js/core/utils/mapColorString');

const updateChannel = function(channelIndex, color) {
    if (channelIndex < 0 || channelIndex >= NUM_CHANNELS || typeof channelIndex !== 'number') {
        return;
    }

    const payload = {
        channelIndex,
        color: mapColorString(color.toHexString()),
    };
    window.localStorage.setItem('channelColor', JSON.stringify(payload));

};

updateChannel.NUM_CHANNELS = NUM_CHANNELS;

module.exports = updateChannel;
