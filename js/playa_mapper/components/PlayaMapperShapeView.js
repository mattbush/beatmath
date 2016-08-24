const React = require('react');
const tinycolor = require('tinycolor2');

const PlayaMapperShapeView = React.createClass({
    render: function() {
        const pointsArray = this.props.shape.map(vertex => {
            return `${vertex[0]},${vertex[1]}`;
        });
        const pointsString = pointsArray.join(' ');

        const color = tinycolor('#ff0000').spin(this.props.index * 30).toHexString();

        return (
            <polygon fill={color} points={pointsString} />
        );
    },
});

module.exports = PlayaMapperShapeView;
