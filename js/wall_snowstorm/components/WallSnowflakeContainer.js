const _ = require('lodash');
const React = require('react');
const WallSnowflake = require('js/wall_snowstorm/components/WallSnowflake');
const {NUM_ROWS, NUM_COLUMNS, BEATS_PER_ROW} = require('js/wall_snowstorm/parameters/WallSnowstormConstants');
const hexGrid = require('js/wallow/WallowHexGrid');

const WallSnowflakeContainer = React.createClass({
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
        const startRow = Math.max(this.state.numTicks - (NUM_ROWS + 2), 0);
        const endRow = this.state.numTicks;
        for (let i = startRow; i < endRow; i++) {
            rows.push(
                <g key={i}>
                    {_.times(NUM_COLUMNS, j => <WallSnowflake key={j} column={j} tick={this.state.numTicks} blend={j / (NUM_COLUMNS - 1)} />)}
                </g>
            );
        }

        return (
            <g style={{transform: `scale(76) translate(${-(_.size(hexGrid[0]) - 1) / 2}px, ${-_.size(hexGrid) / 2}px)`}}>
                {rows}
            </g>
        );
    },
});

module.exports = WallSnowflakeContainer;
