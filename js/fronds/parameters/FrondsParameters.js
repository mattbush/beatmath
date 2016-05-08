const {LinearParameter} = require('js/core/parameters/Parameter');
const {MixtrackButtons, MixtrackKnobs} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');
const FrondState = require('js/fronds/state/FrondState');

class FrondsParameters extends PieceParameters {
    _declareParameters() {
        return {
            numFronds: {
                type: LinearParameter,
                range: [1, 4],
                start: 1,
                listenToDecrementAndIncrementMixtrackButtons: [MixtrackButtons.L_PLAY_PAUSE, MixtrackButtons.L_STUTTER],
            },
            opacity: {
                type: LinearParameter,
                range: [0.2, 1],
                start: 1,
                listenToMixtrackKnob: MixtrackKnobs.CUE_GAIN,
            },
        };
    }
    constructor(...args) {
        super(...args);
        this.frondStates = [];
        this.onNumFrondsChanged();
        this.numFronds.addListener(this.onNumFrondsChanged.bind(this));
    }
    onNumFrondsChanged() {
        const newNumFronds = this.numFronds.getValue();
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
