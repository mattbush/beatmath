const _ = require('lodash');
const React = require('react');
// const tinycolor = require('tinycolor2');

const hexGrid = require('js/wallow/WallowHexGrid');
const WallTreesHex = require('js/wall_trees/components/WallTreesHex');
const {ENABLE_HUE} = require('js/lattice/parameters/LatticeConstants');
const updateHue = require('js/core/outputs/updateHue');

const WallTreesGrid = React.createClass({
    contextTypes: {
        wallTreesParameters: React.PropTypes.object,
    },
    render: function() {
        const componentGrid = _.map(hexGrid, (hexes, row) => {
            return _.map(hexes, (hex, column) => {
                if (row % 2 && column === _.size(hexGrid[0]) - 1) {
                    return null;
                }

                return <WallTreesHex row={row} column={column} />;
            });
        });

        if (ENABLE_HUE) {
            const hueInOrder = [8, 1, 2, 7, 6];
            hueInOrder.forEach((lightNumber, index) => {
                const color = this.context.wallTreesParameters.getColorForColumnAndRow(index * 2, 0);
                updateHue(lightNumber, color, {briCoeff: 0.4});
            });
        }

        return (
            <g style={{transform: `scale(76) translate(${-(_.size(hexGrid[0]) - 1) / 2}px, ${-_.size(hexGrid) / 2}px)`}}>
                {componentGrid}
            </g>
        );
    },
});

module.exports = WallTreesGrid;
