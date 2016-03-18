var {ToggleParameter, LinearParameter} = require('js/core/parameters/Parameter');
var {mixboardButton, mixboardFader, mixboardKnob, mixboardWheel} = require('js/core/inputs/MixboardConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');

class LatticeParameters extends PieceParameters {
    constructor() {
        super(...arguments);

        this.showInfluences = new ToggleParameter({
            start: false,
        });
        this.showInfluences.listenToButton(this._mixboard, mixboardButton.L_SYNC);
        this.showInfluences.addStatusLight(this._mixboard, mixboardButton.L_SYNC);

        this.mixCoefficient = new LinearParameter({
            min: 0.2,
            max: 2,
            start: 1,
        });
        this.mixCoefficient.listenToKnob(this._mixboard, mixboardKnob.L_BASS);
        this.distanceCoefficient = new LinearParameter({
            min: 0.2,
            max: 3,
            start: 1,
        });
        this.distanceCoefficient.listenToKnob(this._mixboard, mixboardKnob.R_BASS);

        this.numCols = new LinearParameter({
            min: 0,
            max: 40,
            start: 12,
        });
        this.numCols.listenToFader(this._mixboard, mixboardFader.L_GAIN);

        this.numRows = new LinearParameter({
            min: 0,
            max: 25,
            start: 12,
        });
        this.numRows.listenToFader(this._mixboard, mixboardFader.R_GAIN);

        this.oscillate = new ToggleParameter({
            start: false,
        });
        this.oscillate.listenToButton(this._mixboard, mixboardButton.L_PITCH_BEND_MINUS);

        this.triangularGridAmount = new LinearParameter({
            start: 0, min: 0, max: 1, incrementAmount: 0.05,
        });
        this.triangularGridAmount.listenToWheel(this._mixboard, mixboardWheel.R_CONTROL_2);
    }
}

module.exports = LatticeParameters;
