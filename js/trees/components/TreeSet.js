const _ = require('lodash');
const React = require('react');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
const TreesParameters = require('js/trees/parameters/TreesParameters');
const Tree = require('js/trees/components/Tree');
const {clamp} = require('js/core/utils/math');

// const {manhattanDist, posMod} = require('js/core/utils/math');

const TreeFrame = React.createClass({
    mixins: [ParameterBindingsMixin],
    contextTypes: {
        treesParameters: React.PropTypes.object,
        beatmathParameters: React.PropTypes.object,
        mixboard: React.PropTypes.object,
    },
    getParameterBindings: function() {
        return {
            tempo: this.context.beatmathParameters.tempo,
        };
    },
    render: function() {
        const treesParameters = this.context.treesParameters;
        let numColumns = treesParameters.numColumns.getValue();
        const indexOffsetForMapperShape = this.props.mapperShapeIndex
            ? this.props.mapperShapeIndex
            : 0;

        const numPointsInMapperShape = this.props.mapperShape ?
            this.props.mapperShape.getNumPoints() :
            null;
        numColumns = (numPointsInMapperShape === 3) ? 3 : numColumns;

        const columnSpacing = treesParameters.getColumnSpacing();
        const polarGridAmount = clamp(treesParameters.polarGridAmount.getValue(), 0, 1);

        const transformations = _.times(numColumns, index => {
            const totalColumnSpacing = treesParameters.getTotalColumnSpacing();
            const dx = ((index + 0.5) * columnSpacing - totalColumnSpacing / 2) * (1 - polarGridAmount);
            const dy = treesParameters.getTotalRowSpacing() / 2 * (1 - polarGridAmount);
            let rotation = ((index + 0.5) - (numColumns / 2)) * (360 / numColumns) * polarGridAmount;

            // special-case cubes
            if (numPointsInMapperShape === 6) {
                // rotation = [-180 + 67.5, -180 + 202.5, -180 + 315][index];
                rotation = [-180 + 67.5, -180 + 202.5, -180 + 315][index];
            }

            return {
                transform: `translate(${dx}px, ${dy}px) rotate(${rotation}deg) scaleY(-1)`,
            };
        });

        return (
            <g>
                {_.times(numColumns, index =>
                    <g key={index} style={transformations[index]} className="tree">
                        <Tree originalIndex={index} index={index + indexOffsetForMapperShape} numColumns={numColumns} numPointsInMapperShape={numPointsInMapperShape} />
                    </g>
                )}
            </g>
        );
    },
});

const TreeSet = React.createClass({
    mixins: [ParameterBindingsMixin],
    childContextTypes: {
        treesParameters: React.PropTypes.object,
    },
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        mixboard: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            treesParameters: this.state.treesParameters,
        };
    },
    getInitialState: function() {
        const mixboard = this.context.mixboard;
        const treesParameters = new TreesParameters(mixboard, this.context.beatmathParameters);
        return {treesParameters};
    },
    getParameterBindings: function() {
        return {
            tempo: this.context.beatmathParameters.tempo,
        };
    },
    render: function() {
        return (
            <BeatmathFrame>
                <TreeFrame />
            </BeatmathFrame>
        );
    },
});

module.exports = TreeSet;
