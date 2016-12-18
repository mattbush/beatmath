const _ = require('lodash');
const React = require('react');
const SnowstormParameters = require('js/snowstorm/parameters/SnowstormParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const Snowflake = require('js/snowstorm/components/Snowflake');
const {NUM_ROWS, NUM_COLS, BEATS_PER_ROW} = require('js/snowstorm/parameters/SnowstormConstants');

const Snowstorm = React.createClass({
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
    },
    getInitialState() {
        return {numTicks: 0};
    },
    componentDidMount() {
        this.context.beatmathParameters.tempo.addListener(() => {
            const numTicks = this.context.beatmathParameters.tempo.getNumTicks();
            if (numTicks % BEATS_PER_ROW === 0) {
                this.setState({numTicks: numTicks / BEATS_PER_ROW});
            }
        });
    },
    render() {
        const rows = [];
        const startRow = Math.max(this.state.numTicks - NUM_ROWS, 0);
        const endRow = this.state.numTicks;
        for (let i = startRow; i <= endRow; i++) {
            rows.push(
                <g key={i} style={{transform: 'translateY(-460px)'}}>
                    {_.times(NUM_COLS + 1, j => <Snowflake key={j} blend={(j + (i % 2 ? 0.5 : 0)) / (NUM_COLS + 0.5)} />)}
                </g>
            );
        }

        return (
            <g>{rows}</g>
        );
    },
});

const SnowstormContainer = React.createClass({
    childContextTypes: {
        snowstormParameters: React.PropTypes.array,
    },
    contextTypes: {
        mixboard: React.PropTypes.object,
        beatmathParameters: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            snowstormParameters: this.state.snowstormParameters,
        };
    },
    getInitialState: function() {
        return {
            snowstormParameters: [
                new SnowstormParameters(this.context.mixboard, this.context.beatmathParameters, 0),
                new SnowstormParameters(this.context.mixboard, this.context.beatmathParameters, 1),
            ],
        };
    },
    render: function() {
        return (
            <BeatmathFrame>
                <Snowstorm />
            </BeatmathFrame>
        );
    },
});

module.exports = SnowstormContainer;
