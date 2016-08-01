const React = require('react');

let AnimationControlledMixin = require('js/honeycomb/components/AnimationControlledMixin');

let Hexagon = React.createClass({
    render: function() {
        return (
            <polygon className="line" points="1,0 0.5,.866 -0.5,.866 -1,0 -0.5,-.866 0.5,-.866" />
        );
    },
});

let MagicCircle = React.createClass({
    mixins: [AnimationControlledMixin],
    getStyle: function(ticks) {
//        const scale = ticks % 2;
        const scale = (this.props.index % 3 === ticks % 3) ? 1 : 0;
        const transformDuration = this.context.period * (this.props.order / 3);
        return {
            transform: `scale(${scale})`,
            transition: `transform ${transformDuration}s ease`,
        };
    },
    render: function() {
//        const r = this.props.order * 0.05;
        return (
            <circle className="magicCircle" cx="0" cy="0" r="0.2px" style={this.getStyle(this.context.ticks + 1)} />
        );
    },
});

let MagicHexagon = React.createClass({
    render: function() {
        return (
            <g>
                <Hexagon />
                <MagicCircle index={this.props.index} order={this.props.order} />
            </g>
        );
    },
});

module.exports = MagicHexagon;
