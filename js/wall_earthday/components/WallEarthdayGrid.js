const _ = require('lodash');
const React = require('react');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
const hexGrid = require('js/wallow/WallowHexGrid');
const WallEarthdayHex = require('js/wall_earthday/components/WallEarthdayHex');

const WallEarthdayOcean = React.createClass({
    mixins: [ParameterBindingsMixin],
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        wallEarthdayParameters: React.PropTypes.object,
        influences: React.PropTypes.array,
        refreshTimer: React.PropTypes.object,
    },
    getParameterBindings: function() {
        return {
            spherical: this.context.wallEarthdayParameters.spherical,
            scale: this.context.wallEarthdayParameters.scale,
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

const WallEarthdayGrid = React.createClass({
    render: function() {
        const componentGrid = _.map(hexGrid, (hexes, row) => {
            return _.map(hexes, (hex, column) => {
                if (row % 2 && column === _.size(hexGrid[0]) - 1) {
                    return null;
                }

                return <WallEarthdayHex row={row} column={column} />;
            });
        });

        return (
            <g style={{transform: 'scale(76) translate(-7.5px, -3.5px)'}}>
                <WallEarthdayOcean />
                {componentGrid}
            </g>
        );
    },
});

module.exports = WallEarthdayGrid;
