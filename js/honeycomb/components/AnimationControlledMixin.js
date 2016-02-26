var React = require('react');

let AnimationControlledMixin = {
    contextTypes: {
        bpm: React.PropTypes.number,
        ticks: React.PropTypes.number,
        period: React.PropTypes.number,
    },
};

module.exports = AnimationControlledMixin;
