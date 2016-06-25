const React = require('react');

const MapperCurrentShapeView = React.createClass({
    render: function() {
        return (
            <polygon fill="#ffffff" points={this.props.shape.getPointsString()} />
        );
    },
});

module.exports = MapperCurrentShapeView;
