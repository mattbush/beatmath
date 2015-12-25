var _ = require('underscore');

const {HUE_BRIDGE_IP_ADDRESS, HUE_API_KEY, NUM_LIGHTS} = require('./hue_constants');

const HUE_THROTTLE_RATE_MS = 200;
const HUE_TRANSITION_TIME_MS = 100;

const HUE_TRANSITION_TIME_CS = Math.round(HUE_TRANSITION_TIME_MS / 10);

var updateHueLightHelper = function(lightNumber, color) {
    let {h, s, v} = color.toHsv();
    h = Math.floor(h * 65534 / 360);
    s = Math.floor(s * 254);
    v = Math.floor(v * 254);
    lightNumber++; // 1-index

    var url = `http://${HUE_BRIDGE_IP_ADDRESS}/api/${HUE_API_KEY}/lights/${lightNumber}/state`;
    var body = JSON.stringify({hue: h, sat: s, bri: v, transitiontime: HUE_TRANSITION_TIME_CS});

    var xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    xhr.send(body);
};

var throttledUpdateFnsPerLight = _.times(NUM_LIGHTS, lightNum => {
    return _.throttle(
        _.bind(updateHueLightHelper, null, lightNum),
        HUE_THROTTLE_RATE_MS,
    );
});

var updateHue = function(lightNumber, color) {
    if (lightNumber < 0 || lightNumber >= NUM_LIGHTS || typeof lightNumber !== 'number') {
        return;
    }
    throttledUpdateFnsPerLight[lightNumber](color);
};

module.exports = updateHue;
