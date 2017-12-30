const _ = require('lodash');
const React = require('react');
// const tinycolor = require('tinycolor2');

const hexGrid = require('js/wallow/WallowHexGrid');
const WallCircuitHex = require('js/wall_circuit/components/WallCircuitHex');
const updateChannel = require('js/core/outputs/updateChannel');

const WallCircuitGrid = React.createClass({
    contextTypes: {
        wallCircuitParametersByChannel: React.PropTypes.array,
    },
    render: function() {
        const componentGrid = _.map(hexGrid, (hexes, row) => {
            if (row >= 6) {
                return null;
            }
            return _.map(hexes, (hex, column) => {
                if (row % 2 && column === _.size(hexGrid[0]) - 1) {
                    return null;
                }

                return <WallCircuitHex row={row} column={column} />;
            });
        });

        _.times(4, channelIndex => {
            // const color = this.context.wallCircuitParametersByChannel[channelIndex].getColorForColumnAndRow(0, 0);
            const color = this.context.wallCircuitParametersByChannel[channelIndex].baseColor.getValue();
            updateChannel(channelIndex, color);
        });

        return (
            <g style={{transform: 'scale(76) translate(-7.5px, -3.5px)'}}>
                {componentGrid}
            </g>
        );
    },
});

module.exports = WallCircuitGrid;
