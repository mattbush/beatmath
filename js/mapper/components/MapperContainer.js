const React = require('react');
const MapperParameters = require('js/mapper/parameters/MapperParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');

const MapperContainer = React.createClass({
    childContextTypes: {
        mapperParameters: React.PropTypes.object,
    },
    contextTypes: {
        mixboard: React.PropTypes.object,
        beatmathParameters: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            mapperParameters: this.state.mapperParameters,
        };
    },
    getInitialState: function() {
        return {
            mapperParameters: new MapperParameters(this.context.mixboard, this.context.beatmathParameters),
        };
    },
    render: function() {
        return (
            <BeatmathFrame>
                Hello world!
            </BeatmathFrame>
        );
    },
});

module.exports = MapperContainer;
