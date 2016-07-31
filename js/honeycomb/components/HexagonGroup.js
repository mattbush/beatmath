const React = require('react');
const tinycolor = require('tinycolor2');
const updateHue = require('js/core/outputs/updateHue');
const MagicHexagon = require('js/honeycomb/components/MagicHexagon');

let AnimationControlledMixin = require('js/honeycomb/components/AnimationControlledMixin');

const COLORS = [tinycolor('#f00'), tinycolor('#1a1'), tinycolor('#36f')];

const ENABLE_HUE = false;
const SAT_COEFF = 1.5;
const BRI_COEFF = 0.6;

const HEX_HEIGHT = 1.732;
const HEX_HEIGHT_X2 = HEX_HEIGHT * 2;
const HEX_HEIGHT_X3 = HEX_HEIGHT * 3;
const HEX_HEIGHT_X4 = HEX_HEIGHT * 4;
const HEX_HEIGHT_X5 = HEX_HEIGHT * 5;

let HexagonGroup = React.createClass({
    mixins: [AnimationControlledMixin],
    getStyle: function(ticks) {
        const color = COLORS[(ticks + this.props.index) % COLORS.length];
        const transformDuration = this.context.period;
        return {
            stroke: color,
            transition: `transform ${transformDuration}s linear`,
        };
    },
    render: function() {
        const style = this.getStyle(this.context.ticks + 1);
        if (ENABLE_HUE) {
            updateHue(this.props.index, tinycolor(style.stroke), {satCoeff: SAT_COEFF, briCoeff: BRI_COEFF});
        }
        return (
            <g className="hexagonGroup" style={style}>
                <g transform={`translate(0 ${HEX_HEIGHT})`}>
                    <MagicHexagon index={this.props.index} order={1} />
                </g>
                <g transform={`translate(0 ${HEX_HEIGHT_X2})`}>
                    <MagicHexagon index={this.props.index} order={2} />
                </g>
                <g transform={`translate(0 ${HEX_HEIGHT_X3})`}>
                    <MagicHexagon index={this.props.index} order={3} />
                </g>
                <g transform={`translate(0 ${HEX_HEIGHT_X4})`}>
                    <MagicHexagon index={this.props.index} order={4} />
                </g>
                <g transform={`translate(0 ${HEX_HEIGHT_X5})`}>
                    <MagicHexagon index={this.props.index} order={5} />
                </g>
            </g>
        );
    },
});

module.exports = HexagonGroup;
