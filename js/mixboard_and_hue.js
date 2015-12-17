require('regenerator/runtime');
var _ = require('underscore');
var tinycolor = require('tinycolor2');
var Mixboard = require('./mixboard');
var {mixboardWheel, mixboardFader} = require('./mixboard_constants');

var startColor = tinycolor('hsv(60, 50%, 80%)');

var configs = [
    {hue: mixboardWheel.L_TURNTABLE, saturation: mixboardFader.L_PITCH_BEND, value: mixboardFader.L_GAIN},
    {hue: mixboardWheel.BROWSE, saturation: mixboardFader.CROSSFADER, value: mixboardFader.MASTER_GAIN},
    {hue: mixboardWheel.R_TURNTABLE, saturation: mixboardFader.R_PITCH_BEND, value: mixboardFader.R_GAIN},
];

var colors = [];

var lerp = function(min, max, interpolation) {
    return min + (max - min) * interpolation;
};

var onHueChange = function(lightNumber, wheelValue) {
    colors[lightNumber] = colors[lightNumber].spin(wheelValue);
    console.log(lightNumber, colors[lightNumber]);
};

var onSaturationChange = function(lightNumber, newValue) {
    var hsv = colors[lightNumber].toHsv();
    hsv.s = lerp(0.1, 1, newValue);
    colors[lightNumber] = tinycolor(hsv);
    console.log(lightNumber, colors[lightNumber]);
};

var onValueChange = function(lightNumber, newValue) {
    var hsv = colors[lightNumber].toHsv();
    hsv.v = lerp(0.1, 1, newValue);
    colors[lightNumber] = tinycolor(hsv);
    console.log(lightNumber, colors[lightNumber]);
};

document.addEventListener('DOMContentLoaded', async function() {
    var mixboard = await Mixboard.getInstanceAsync();

    _.each(configs, (config, index) => {
        colors.push(startColor);
        mixboard.addWheelListener(config.hue, onHueChange.bind(null, index));
        mixboard.addFaderListener(config.saturation, onSaturationChange.bind(null, index));
        mixboard.addFaderListener(config.value, onValueChange.bind(null, index));
    });
});
