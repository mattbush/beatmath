const _ = require('lodash');
const React = require('react');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
const hexGrid = require('js/wallow/WallowHexGrid');
const EarthdayHex = require('js/earthday/components/EarthdayHex');

const EarthdayOcean = React.createClass({
    mixins: [ParameterBindingsMixin],
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        earthdayParameters: React.PropTypes.object,
        influences: React.PropTypes.array,
        refreshTimer: React.PropTypes.object,
    },
    getParameterBindings: function() {
        return {
            spherical: this.context.earthdayParameters.spherical,
            scale: this.context.earthdayParameters.scale,
        };
    },
    render() {
        if (!this.getParameterValue('spherical')) {
            return null;
        }

        return (
            <circle fill="#028" cx="7.5" cy={1.5 * Math.sqrt(3)} r={this.getParameterValue('scale')} />
        );
    },
});

const EarthdayGrid = React.createClass({
    render: function() {
        const componentGrid = _.map(hexGrid, (hexes, row) => {
            return _.map(hexes, (hex, column) => {
                if (row % 2 && column === _.size(hexGrid[0]) - 1) {
                    return null;
                }

                return <EarthdayHex row={row} column={column} />;
            });
        });

        return (
            <g style={{transform: `scale(76) translate(${-(_.size(hexGrid[0]) - 1) / 2}px, ${-_.size(hexGrid) / 2}px)`}}>
                <EarthdayOcean />
                {componentGrid}
            </g>
        );
    },
});

module.exports = EarthdayGrid;
