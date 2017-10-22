const _ = require('lodash');
const React = require('react');
// const tinycolor = require('tinycolor2');

const hexGrid = require('js/wallow/WallowHexGrid');
const WallCircuitHex = require('js/wall_circuit/components/WallCircuitHex');
const {ENABLE_HUE} = require('js/lattice/parameters/LatticeConstants');
const updateHue = require('js/core/outputs/updateHue');

const WallCircuitGrid = React.createClass({
    contextTypes: {
        wallCircuitParameters: React.PropTypes.object,
    },
    render: function() {
        const componentGrid = _.map(hexGrid, (hexes, row) => {
            return _.map(hexes, (hex, column) => {
                if (row % 2 && column === _.size(hexGrid[0]) - 1) {
                    return null;
                }

                return <WallCircuitHex row={row} column={column} />;
            });
        });

        if (ENABLE_HUE) {
            const hueInOrder = [8, 1, 2, 7, 6];
            hueInOrder.forEach((lightNumber, index) => {
                const color = this.context.wallCircuitParameters.getColorForColumnAndRow(index * 2, 0);
                updateHue(lightNumber, color, {briCoeff: 0.4});
            });
        }

        return (
            <g style={{transform: 'scale(76) translate(-7.5px, -3.5px)'}}>
                {componentGrid}
            </g>
        );
    },
});

module.exports = WallCircuitGrid;
