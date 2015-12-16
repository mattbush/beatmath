require('regenerator/runtime');
var Mixboard = require('./mixboard');
var {mixboardWheel, mixboardFader} = require('./mixboard_constants');

var onHueChange = function(lightNumber, wheelValue) {
    console.log(lightNumber, wheelValue);
};

var onSaturationChange = function(lightNumber, newValue) {
    console.log(lightNumber, newValue);
};

var onValueChange = function(lightNumber, newValue) {
    console.log(lightNumber, newValue);
};

document.addEventListener('DOMContentLoaded', async function() {
    var mixboard = await Mixboard.getInstanceAsync();

    mixboard.addWheelListener(mixboardWheel.L_TURNTABLE, onHueChange.bind(null, 0));
    mixboard.addFaderListener(mixboardFader.L_PITCH_BEND, onSaturationChange.bind(null, 0));
    mixboard.addFaderListener(mixboardFader.L_GAIN, onValueChange.bind(null, 0));

    mixboard.addWheelListener(mixboardWheel.BROWSE, onHueChange.bind(null, 1));
    mixboard.addFaderListener(mixboardFader.CROSSFADER, onSaturationChange.bind(null, 1));
    mixboard.addFaderListener(mixboardFader.MASTER_GAIN, onValueChange.bind(null, 1));

    mixboard.addWheelListener(mixboardWheel.R_TURNTABLE, onHueChange.bind(null, 2));
    mixboard.addFaderListener(mixboardFader.R_PITCH_BEND, onSaturationChange.bind(null, 2));
    mixboard.addFaderListener(mixboardFader.R_GAIN, onValueChange.bind(null, 2));
});
