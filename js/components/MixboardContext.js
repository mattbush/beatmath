require('regenerator/runtime');
var React = require('react');

var MixboardContext = React.createClass({
    childContextTypes: {
        mixboard: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            mixboard: this.props.mixboard,
        };
    },
    render: function() {
        return React.Children.only(this.props.children);
    },
});

module.exports = MixboardContext;
