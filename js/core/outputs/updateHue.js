const _ = require('underscore');

const {HUE_BRIDGE_IP_ADDRESS, HUE_API_KEY, NUM_LIGHTS} = require('js/hue_constants');

const HUE_THROTTLE_RATE_MS = 200;
const HUE_TRANSITION_TIME_MS = 10;

const HUE_TRANSITION_TIME_CS = Math.round(HUE_TRANSITION_TIME_MS / 10);

const updateHueLightHelper = function(lightNumber, color, {satCoeff = 1, briCoeff = 1}) {
    let {h, s, v} = color.toHsv();
    h = Math.floor(h * 65534 / 360);
    s = Math.floor(Math.min(s * satCoeff, 1) * 254);
    v = Math.floor(Math.min(v * briCoeff, 1) * 254);
    lightNumber++; // 1-index

    const url = `http://${HUE_BRIDGE_IP_ADDRESS}/api/${HUE_API_KEY}/lights/${lightNumber}/state`;
    const body = JSON.stringify({hue: h, sat: s, bri: v, transitiontime: HUE_TRANSITION_TIME_CS});

    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    xhr.send(body);
};

const throttledUpdateFnsPerLight = _.times(NUM_LIGHTS, lightNum => {
    return _.throttle(
        _.bind(updateHueLightHelper, null, lightNum),
        HUE_THROTTLE_RATE_MS,
    );
});

const updateHue = function(lightNumber, color, options = {}) {
    if (lightNumber < 0 || lightNumber >= NUM_LIGHTS || typeof lightNumber !== 'number') {
        return;
    }
    throttledUpdateFnsPerLight[lightNumber](color, options);
};

module.exports = updateHue;
