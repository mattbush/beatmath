const _ = require('lodash');
const React = require('react');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
const KaleSubject = require('js/kale/components/KaleSubject');
const {dist, lerp, xyRotatedAroundOriginWithAngle} = require('js/core/utils/math');
const tinycolor = require('tinycolor2');
const {clipPathXCenters, clipPathYCenters} = require('js/kale/components/KaleClipPaths');
const mapColorString = require('js/core/utils/mapColorString');
const updateChannel = require('js/core/outputs/updateChannel');
const {NUM_CHANNELS} = updateChannel;

const Y_AXIS_SCALE = Math.sqrt(3);

const KaleCell = React.createClass({
    mixins: [ParameterBindingsMixin],
    contextTypes: {
        mixboard: React.PropTypes.object,
        beatmathParameters: React.PropTypes.object,
        kaleParameters: React.PropTypes.object,
        subjectParameters: React.PropTypes.object,
    },
    getParameterBindings: function() {
        return {
            tempo: this.context.beatmathParameters.tempo,
            isInfinite: this.context.kaleParameters.isInfinite,
            reflectionsPerCell: this.context.kaleParameters.reflectionsPerCell,
            triangularGridPercent: this.context.kaleParameters.triangularGridPercent,
            cellSymmetry: this.context.kaleParameters.cellSymmetry,
        };
    },
    _getUpdateDelay: function() {
        return Math.round(dist(this.props.logicalX, this.props.logicalY)) * 20 % 50;
    },
    _getColorByShifting: function(x, y) {
        const color = tinycolor(this.context.kaleParameters.baseColor.getValue().toHexString()); // clone
        const columnColorShift = this.context.kaleParameters.columnColorShift.getValue();
        const rowColorShift = this.context.kaleParameters.rowColorShift.getValue();
        const colorShift = columnColorShift * x + rowColorShift * y;
        if (colorShift !== 0) {
            color.spin(colorShift);
        }
        return mapColorString(color.toHexString());
    },
    _getColor: function(x, y) {
        return this._getColorByShifting(x, y);
    },
    render: function() {
        if (this.props.logicalX === 0 && this.props.logicalY === 0) {
            _.times(NUM_CHANNELS, channelIndex => {
                const color = tinycolor(this._getColor((-NUM_CHANNELS / 2 + 0.5 + channelIndex), 0));
                updateChannel(channelIndex, color);
            });
        }

        const isInfinite = this.getParameterValue('isInfinite');
        const triangularGridPercent = this.getParameterValue('triangularGridPercent');
        let triGridPercent = Math.max((triangularGridPercent - 0.5) * 2, 0);
        triGridPercent = Math.round(triGridPercent * 20) / 20;
        const brickGridPercent = Math.min(triangularGridPercent * 2, 1);
        const reflectionsPerCell = this.getParameterValue('reflectionsPerCell');
        const clipPathPrefix = (isInfinite ? 'I' : 'F') + reflectionsPerCell;

        const yAxisScale = lerp(2, Y_AXIS_SCALE, triGridPercent);

        const centerX = this.props.logicalX + (this.props.logicalY % 2 ? brickGridPercent - 1 : 0);
        const centerY = this.props.logicalY * yAxisScale;

        const reflectionElements = _.times(reflectionsPerCell, index => {
            const isBStyle = (reflectionsPerCell === 6 && index >= 2 && index < 4);
            const isCStyle = (reflectionsPerCell === 6 && index >= 4);
            let rotationDeg = Math.floor(index / 2) * (360 / (reflectionsPerCell / 2));
            const scale = (index % 2) ? 'scale(-1, 1) ' : '';

            let clipPathPrefixFull = clipPathPrefix;
            if (isBStyle) {
                rotationDeg -= lerp(7.5, 0, triGridPercent);
                clipPathPrefixFull += 'B';
            } else if (isCStyle) {
                rotationDeg += lerp(7.5, 0, triGridPercent);
                clipPathPrefixFull += 'C';
            }

            const clipPathKey = `${clipPathPrefixFull}~${triGridPercent}`;
            const clipPath = `url(#${clipPathKey})`;

            let x = centerX;
            let y = centerY;
            if (!this.getParameterValue('cellSymmetry')) {
                const [clipPathXCenter, clipPathYCenter] = xyRotatedAroundOriginWithAngle(
                    clipPathXCenters[clipPathKey],
                    clipPathYCenters[clipPathKey],
                    rotationDeg,
                );
                x += clipPathXCenter * ((index % 2) ? -1 : 1);
                y += clipPathYCenter;
            }

            const xWithMapperShapeOffset = x + this.props.mapperShapeXOffset;
            const yWithMapperShapeOffset = y + this.props.mapperShapeYOffset;

            const stroke = this._getColor(xWithMapperShapeOffset, yWithMapperShapeOffset);
            const fill = tinycolor(stroke).spin(180).darken(40).toHexString();

            return (
                <g key={index} transform={`${scale}rotate(${rotationDeg})`} fill={fill} stroke={stroke}>
                    <g clipPath={clipPath}>
                        <KaleSubject cellX={xWithMapperShapeOffset} cellY={yWithMapperShapeOffset} />
                    </g>
                </g>
            );
        });

        return (
            <g transform={`translate(${centerX}, ${centerY})`}>
                {reflectionElements}
            </g>
        );
    },
});

module.exports = KaleCell;
