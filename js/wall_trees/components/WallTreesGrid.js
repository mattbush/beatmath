const _ = require('lodash');
const React = require('react');
// const tinycolor = require('tinycolor2');

const hexGrid = require('js/wallow/WallowHexGrid');
const WallTreesHex = require('js/wall_trees/components/WallTreesHex');
const updateChannel = require('js/core/outputs/updateChannel');
const {NUM_CHANNELS} = updateChannel;

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

        const skipIllumination = true;
        _.times(NUM_CHANNELS, channelIndex => {
            const columnIndex = (-NUM_CHANNELS / 2 + 0.5 + channelIndex) * 4;
            const color = this.context.wallTreesParameters.getColorForColumnAndRow(columnIndex, 0, skipIllumination);
            updateChannel(channelIndex, color);
        });

        return (
            <g style={{transform: 'scale(76) translate(-7.5px, -3.5px)'}}>
                {componentGrid}
            </g>
        );
    },
});

module.exports = WallTreesGrid;
