var {ToggleParameter, LinearParameter, NextTickParameter} = require('js/parameters/Parameter');
var {mixboardButton, mixboardFader} = require('js/inputs/MixboardConstants');

const {PIXEL_REFRESH_RATE} = require('js/parameters/lattice/LatticeConstants');

class LatticeParameters {
    constructor(mixboard) {
        this._mixboard = mixboard;
        this.showInfluences = new ToggleParameter({
            start: false,
        });
        this.showInfluences.listenToButton(mixboard, mixboardButton.L_SYNC);

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
