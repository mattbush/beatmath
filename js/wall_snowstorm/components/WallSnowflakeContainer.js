const _ = require('lodash');
const React = require('react');
const WallSnowflake = require('js/wall_snowstorm/components/WallSnowflake');
const {NUM_ROWS, NUM_COLUMNS, BEATS_PER_ROW} = require('js/wall_snowstorm/parameters/WallSnowstormConstants');
const hexGrid = require('js/wallow/WallowHexGrid');

const {ENABLE_HUE} = require('js/lattice/parameters/LatticeConstants');
const updateHue = require('js/core/outputs/updateHue');
const tinycolor = require('tinycolor2');

const WallSnowflakeContainer = React.createClass({
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        snowflakeParameters: React.PropTypes.array,
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
        const startRow = Math.max(this.state.numTicks - (NUM_ROWS + 2), 0);
        const endRow = this.state.numTicks + 1;
        for (let i = startRow; i < endRow; i++) {
            rows.push(
                <g key={i}>
                    {_.times(NUM_COLUMNS, j => <WallSnowflake key={j} column={j} tick={this.state.numTicks} blend={j / (NUM_COLUMNS - 1)} />)}
                </g>
            );
        }

        if (ENABLE_HUE) {
            const hueInOrder = [1, 6, 7, 8, 2];
            hueInOrder.forEach((lightNumber, index) => {
                const baseColor = tinycolor.mix(
                    this.context.snowflakeParameters[0].baseColor.getValue(),
                    this.context.snowflakeParameters[1].baseColor.getValue(),
                    index / (hueInOrder.length - 1) * 100,
                );
                updateHue(lightNumber, baseColor, {briCoeff: 0.4});
            });
        }

        return (
            <g style={{transform: 'scale(76) translate(-7.5px, -3.5px)'}}>
                {rows}
            </g>
        );
    },
});

module.exports = WallSnowflakeContainer;
