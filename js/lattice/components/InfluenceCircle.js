var React = require('react');
var ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');

const {CELL_SIZE} = require('js/lattice/parameters/LatticeConstants');

var InfluenceCircle = React.createClass({
    mixins: [ParameterBindingsMixin],
    getParameterBindings: function() {
        return {
            'main': this.props.influence.getMainParameter(),
            'row': this.props.influence.getRowParameter(),
            'col': this.props.influence.getColParameter(),
        };
    },
    render: function() {
        var influence = this.props.influence;
        var x = influence.getCol() * CELL_SIZE + CELL_SIZE / 2;
        var y = influence.getRow() * CELL_SIZE + CELL_SIZE / 2;
        var size = influence.getSize() * 5;
        var style = {
            transition: `transform ${influence.getRefreshRate() / 1000}s linear`,
            fill: influence.getColor().toHexString(true),
        };
        var rotation = influence.getRotation();
        if (rotation !== null) {
            rotation = Math.floor(rotation);
            style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
            var pixelOffset = -size / 2;
            return (
                <g style={style}>
                    <rect x={pixelOffset} y={pixelOffset} width={size} height={size} />
                </g>

            );
        } else {
            style.transform = `translate(${x}px, ${y}px)`;
            return (
                <g style={style}>
                    <circle cx={0} cy={0} r={size / 2} />
                </g>
            );
        }
    },
});

module.exports = InfluenceCircle;
