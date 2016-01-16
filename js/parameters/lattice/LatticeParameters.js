var {ToggleParameter, LinearParameter, NextTickParameter} = require('js/parameters/Parameter');
var {mixboardButton} = require('js/inputs/MixboardConstants');

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
            start: 32,
        });

        this.numRows = new LinearParameter({
            min: 0,
            max: 25,
            start: 20,
        });

        this.nextTick = new NextTickParameter({
            interval: PIXEL_REFRESH_RATE,
        });
    }
}

module.exports = LatticeParameters;
