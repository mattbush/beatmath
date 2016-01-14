var {ToggleParameter} = require('js/parameters/Parameter');
var {mixboardButton} = require('js/inputs/MixboardConstants');
// const {NUM_COLS, NUM_ROWS, MAX_SIZE} = require('js/parameters/lattice/LatticeConstants');

class LatticeParameters {
    constructor(mixboard) {
        this._mixboard = mixboard;
        this.showInfluences = new ToggleParameter({
            start: false,
        });
        this.showInfluences.listenToButton(mixboard, mixboardButton.L_SYNC);
    }
}

module.exports = LatticeParameters;
