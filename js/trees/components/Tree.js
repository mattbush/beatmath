var _ = require('underscore');
var React = require('react');
var ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');

const LEVEL_SPACING = 20;
const NUM_LEVELS = 4;

var Tree = React.createClass({
    mixins: [ParameterBindingsMixin],
    getParameterBindings: function() {
        return {
//          foo: this.state.treesParameters.foo,
        };
    },
    render: function() {
        return (
            <g>
                {_.times(NUM_LEVELS, levelIndex => {
                    return (
                        <rect key={levelIndex} fill="#0ff" x={-30} y={levelIndex * LEVEL_SPACING} width={60} height={10} />
                    );
                })}
            </g>
        );
    },
});

module.exports = Tree;
