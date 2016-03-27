const {LinearParameter} = require('js/core/parameters/Parameter');
const {mixboardButton} = require('js/core/inputs/MixboardConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');
const FrondState = require('js/fronds/state/FrondState');

class FrondsParameters extends PieceParameters {
    _declareParameters() {
        return {
            numFronds: {
                type: LinearParameter,
                range: [1, 3],
                start: 1,
                listenToDecrementAndIncrementButtons: [mixboardButton.L_PLAY_PAUSE, mixboardButton.L_STUTTER],
            }
        };
    }
    constructor(...args) {
        super(...args);
        this.frondStates = [];
        this.onNumFrondsChanged();
        this.numFronds.addListener(this.onNumFrondsChanged.bind(this));
    }
    onNumFrondsChanged() {
        var newNumFronds = this.numFronds.getValue();
        while (this.frondStates.length < newNumFronds) {
            this.frondStates.push(new FrondState(this._mixboard, this._beatmathParameters, this));
        }
        while (this.frondStates.length > newNumFronds) {
            const frondState = this.frondStates.pop();
            frondState.destroy();
        }
    }
}

module.exports = FrondsParameters;
