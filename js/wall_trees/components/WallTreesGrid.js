const _ = require('lodash');
const React = require('react');
// const tinycolor = require('tinycolor2');

const hexGrid = require('js/wallow/WallowHexGrid');
const WallTreesHex = require('js/wall_trees/components/WallTreesHex');

const WallTreesGrid = React.createClass({
    render: function() {
        const componentGrid = _.map(hexGrid, (hexes, row) => {
            return _.map(hexes, (hex, column) => {
                if (row % 2 && column === _.size(hexGrid[0]) - 1) {
                    return null;
                }

                return <WallTreesHex row={row} column={column} />;
            });
        });

        return (
            <g style={{transform: `scale(76) translate(${-(_.size(hexGrid[0]) - 1) / 2}px, ${-_.size(hexGrid) / 2}px)`}}>
                {componentGrid}
            </g>
        );
    },
});

module.exports = WallTreesGrid;
