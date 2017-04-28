// const _ = require('lodash');
const React = require('react');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
const EarthdayPixel = require('js/earthday/components/EarthdayPixel');

const {CELL_SIZE} = require('js/earthday/parameters/EarthdayConstants');

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
            <circle fill="#028" cx="0" cy="0" r={this.getParameterValue('scale') * CELL_SIZE} />
        );
    },
});

const EarthdayGrid = React.createClass({
    mixins: [ParameterBindingsMixin],
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        earthdayParameters: React.PropTypes.object,
        influences: React.PropTypes.array,
        refreshTimer: React.PropTypes.object,
    },
    getParameterBindings: function() {
        return {
            numRows: this.context.earthdayParameters.numRows,
            numColumns: this.context.earthdayParameters.numColumns,
        };
    },
    render: function() {
        const children = [];
        const numRows = this.getParameterValue('numRows');
        const numColumns = this.getParameterValue('numColumns');
        for (let row = -numRows; row <= numRows; row++) {
            for (let column = -numColumns; column <= numColumns; column++) {
                children.push(<EarthdayPixel row={row} col={column} key={row + '|' + column} />);
            }
        }

        return (
            <g>
                <EarthdayOcean />
                {children}
            </g>
        );
    },
});

module.exports = EarthdayGrid;
