const React = require('react');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');

const InfluenceCircle = React.createClass({
    mixins: [ParameterBindingsMixin],
    getParameterBindings: function() {
        return {
            'main': this.props.influence.getMainParameter(),
            'row': this.props.influence.getRowParameter(),
            'col': this.props.influence.getColParameter(),
        };
    },
    render: function() {
        const influence = this.props.influence;
        const cellSize = this.props.cellSize;
        const x = influence.getCol() * cellSize;
        const y = influence.getRow() * cellSize;
        const size = influence.getSize() * 5;
        const style = {
            transition: `transform ${influence.getRefreshRate() / 1000}s linear`,
            fill: influence.getColor().toHexString(true),
        };
        let rotation = influence.getRotation();
        if (rotation !== null) {
            rotation = Math.floor(rotation);
            style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
            const pixelOffset = -size / 2;
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
