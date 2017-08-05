const _ = require('lodash');
const React = require('react');
// const tinycolor = require('tinycolor2');

const hexGrid = require('js/wallow/WallowHexGrid');
const WallLatticeHex = require('js/wall_lattice/components/WallLatticeHex');

const WallLatticeGrid = React.createClass({
    render: function() {
        const componentGrid = _.map(hexGrid, (hexes, row) => {
            return _.map(hexes, (hex, column) => {
                if (row % 2 && column === _.size(hexGrid[0]) - 1) {
                    return null;
                }

                return <WallLatticeHex row={row} column={column} />;
            });
        });

        return (
            <g style={{transform: 'scale(76) translate(-7.5px, -3.5px)'}}>
                {componentGrid}
            </g>
        );
    },
});

module.exports = WallLatticeGrid;
