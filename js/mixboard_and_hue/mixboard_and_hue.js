require('regenerator/runtime');
var _ = require('underscore');
var tinycolor = require('tinycolor2');
var Mixboard = require('js/core/inputs/Mixboard');
var updateHue = require('js/core/outputs/updateHue');
var {MixtrackWheels, MixtrackFaders} = require('js/core/inputs/MixtrackConstants');
var {lerp, posMod} = require('js/core/utils/math');

var startColor = {h: 60, s: 0.8, v: 0.8};

var configs = [
    {hue: MixtrackWheels.BROWSE, saturation: MixtrackFaders.CROSSFADER, value: MixtrackFaders.MASTER_GAIN},
    {hue: MixtrackWheels.R_TURNTABLE, saturation: MixtrackFaders.R_PITCH_BEND, value: MixtrackFaders.R_GAIN},
    {hue: MixtrackWheels.L_TURNTABLE, saturation: MixtrackFaders.L_PITCH_BEND, value: MixtrackFaders.L_GAIN},
];

var colors = [];

var onHueChange = function(lightNumber, wheelValue) {
    colors[lightNumber].h = posMod(colors[lightNumber].h + wheelValue, 360);
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
        mixboard.addMixtrackWheelListener(config.hue, onHueChange.bind(null, lightNumber));
        mixboard.addMixtrackFaderListener(config.saturation, onSaturationChange.bind(null, lightNumber));
        mixboard.addMixtrackFaderListener(config.value, onValueChange.bind(null, lightNumber));
    });
});
