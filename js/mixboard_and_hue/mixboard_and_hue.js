require('regenerator/runtime');
const _ = require('underscore');
const tinycolor = require('tinycolor2');
const Mixboard = require('js/core/inputs/Mixboard');
const updateHue = require('js/core/outputs/updateHue');
const {MixtrackWheels, MixtrackFaders} = require('js/core/inputs/MixtrackConstants');
const {lerp, posMod} = require('js/core/utils/math');

const startColor = {h: 60, s: 0.8, v: 0.8};

const configs = [
    {hue: MixtrackWheels.BROWSE, saturation: MixtrackFaders.CROSSFADER, value: MixtrackFaders.MASTER_GAIN},
    {hue: MixtrackWheels.R_TURNTABLE, saturation: MixtrackFaders.R_PITCH_BEND, value: MixtrackFaders.R_GAIN},
    {hue: MixtrackWheels.L_TURNTABLE, saturation: MixtrackFaders.L_PITCH_BEND, value: MixtrackFaders.L_GAIN},
];

const colors = [];

const onHueChange = function(lightNumber, wheelValue) {
    colors[lightNumber].h = posMod(colors[lightNumber].h + wheelValue, 360);
    updateHue(lightNumber, tinycolor(colors[lightNumber]));
};

const onSaturationChange = function(lightNumber, newValue) {
    colors[lightNumber].s = lerp(0.1, 1, newValue);
    updateHue(lightNumber, tinycolor(colors[lightNumber]));
};

const onValueChange = function(lightNumber, newValue) {
    colors[lightNumber].v = lerp(0.1, 1, newValue);
    updateHue(lightNumber, tinycolor(colors[lightNumber]));
};

document.addEventListener('DOMContentLoaded', async function() {
    const mixboard = await Mixboard.getInstanceAsync();

    _.each(configs, (config, lightNumber) => {
        colors.push(_.clone(startColor));
        updateHue(lightNumber, tinycolor(colors[lightNumber]));
        mixboard.addMixtrackWheelListener(config.hue, onHueChange.bind(null, lightNumber));
        mixboard.addMixtrackFaderListener(config.saturation, onSaturationChange.bind(null, lightNumber));
        mixboard.addMixtrackFaderListener(config.value, onValueChange.bind(null, lightNumber));
    });
});
