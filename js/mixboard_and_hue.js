require('regenerator/runtime');
var _ = require('underscore');
var tinycolor = require('tinycolor2');
var Mixboard = require('./mixboard');
var updateHue = require('./update_hue');
var {mixboardWheel, mixboardFader} = require('./mixboard_constants');

var startColor = {h: 60, s: 0.8, v: 0.8};

var configs = [
    {hue: mixboardWheel.BROWSE, saturation: mixboardFader.CROSSFADER, value: mixboardFader.MASTER_GAIN},
    {hue: mixboardWheel.R_TURNTABLE, saturation: mixboardFader.R_PITCH_BEND, value: mixboardFader.R_GAIN},
    {hue: mixboardWheel.L_TURNTABLE, saturation: mixboardFader.L_PITCH_BEND, value: mixboardFader.L_GAIN},
];

var colors = [];

var lerp = function(min, max, interpolation) {
    return min + (max - min) * interpolation;
};

var onHueChange = function(lightNumber, wheelValue) {
    var hue = (colors[lightNumber].h + wheelValue) % 360;
    colors[lightNumber].h = hue < 0 ? 360 + hue : hue;
    updateHue(lightNumber, tinycolor(colors[lightNumber]));
};

var onSaturationChange = function(lightNumber, newValue) {
    colors[lightNumber].s = lerp(0.1, 1, newValue);
    updateHue(lightNumber, tinycolor(colors[lightNumber]));
};

var onValueChange = function(lightNumber, newValue) {
    colors[lightNumber].v = lerp(0.1, 1, newValue);
    updateHue(lightNumber, tinycolor(colors[lightNumber]));
};

document.addEventListener('DOMContentLoaded', async function() {
    var mixboard = await Mixboard.getInstanceAsync();

    _.each(configs, (config, lightNumber) => {
        colors.push(_.clone(startColor));
        updateHue(lightNumber, tinycolor(colors[lightNumber]));
        mixboard.addWheelListener(config.hue, onHueChange.bind(null, lightNumber));
        mixboard.addFaderListener(config.saturation, onSaturationChange.bind(null, lightNumber));
        mixboard.addFaderListener(config.value, onValueChange.bind(null, lightNumber));
    });
});
