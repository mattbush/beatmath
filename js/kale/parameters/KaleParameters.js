const {CycleParameter, MovingColorParameter, LinearParameter, ToggleParameter} = require('js/core/parameters/Parameter');
// const {MixtrackKnobs} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');
const {ceilOfMultiple} = require('js/core/utils/math');
const tinycolor = require('tinycolor2');

class KaleParameters extends PieceParameters {
    _declareParameters() {
        return {
            numRows: {
                type: LinearParameter,
                start: 3,
                range: [0, 10],
            },
            numCols: {
                type: LinearParameter,
                start: 8,
                range: [0, 10],
            },
            isInfinite: {
                type: ToggleParameter,
                start: false,
            },
            reflectionsPerCell: {
                type: CycleParameter,
                cycleValues: [1, 2, 4, 6],
                listenToDecrementAndIncrementLaunchpadButtons: 3,
            },
        };
    }
    constructor(...args) {
        super(...args);

        this.colorsByCoords = {};
        const numColorRows = ceilOfMultiple(this.numRows.getValue(), 3) + 3;
        const numColorCols = ceilOfMultiple(this.numCols.getValue(), 3) + 3;
        for (let row = -numColorRows; row <= numColorRows; row += 3) {
            for (let col = -numColorCols; col <= numColorCols; col += 3) {
                if ((row + col) % 2 === 0) {
                    this.colorsByCoords[`${col},${row}`] = new MovingColorParameter({
                        start: tinycolor('#5ff'),
                        max: 5,
                        variance: 1,
                        autoupdate: 1000,
                    });
                }
            }
        }
    }
}

module.exports = KaleParameters;
