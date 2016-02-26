var {ToggleParameter, LinearParameter, NextTickParameter} = require('js/core/parameters/Parameter');
var {mixboardButton, mixboardFader, mixboardKnob} = require('js/core/inputs/MixboardConstants');

const {PIXEL_REFRESH_RATE} = require('js/lattice/parameters/LatticeConstants');

class LatticeParameters {
    constructor(mixboard) {
        this._mixboard = mixboard;
        this.showInfluences = new ToggleParameter({
            start: false,
        });
        this.showInfluences.listenToButton(mixboard, mixboardButton.L_SYNC);

        this.mixCoefficient = new LinearParameter({
            min: 0.2,
            max: 2,
            start: 1,
        });
        this.mixCoefficient.listenToKnob(mixboard, mixboardKnob.L_BASS);
        this.distanceCoefficient = new LinearParameter({
            min: 0.2,
            max: 3,
            start: 1,
        });
        this.distanceCoefficient.listenToKnob(mixboard, mixboardKnob.R_BASS);

        this.numCols = new LinearParameter({
            min: 0,
            max: 40,
            start: 12,
        });
        this.numCols.listenToFader(mixboard, mixboardFader.L_GAIN);

        this.numRows = new LinearParameter({
            min: 0,
            max: 25,
            start: 12,
        });
        this.numRows.listenToFader(mixboard, mixboardFader.R_GAIN);

        this.nextTick = new NextTickParameter({
            interval: PIXEL_REFRESH_RATE,
        });

        this.oscillate = new ToggleParameter({
            start: false,
        });
        this.oscillate.listenToButton(mixboard, mixboardButton.L_PITCH_BEND_MINUS);
    }
}

module.exports = LatticeParameters;
