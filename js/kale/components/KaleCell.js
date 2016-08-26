const _ = require('lodash');
const React = require('react');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
const KaleSubject = require('js/kale/components/KaleSubject');
const {lerp, posMod, xyRotatedAroundOriginWithAngle, modAndShiftToHalf} = require('js/core/utils/math');
const tinycolor = require('tinycolor2');
const {clipPathXCenters, clipPathYCenters} = require('js/kale/components/KaleClipPaths');

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
    _getColorByShifting: function(x, y) {
        const colorsByCoords = this.context.kaleParameters.colorsByCoords;
        const color = tinycolor(colorsByCoords['0,0'].getValue().toHexString()); // clone
        let colColorShift = this.context.kaleParameters.colColorShift.getValue();
        if (this.context.beatmathParameters.triangleCompressionPercent.getValue()) {
            const colorShiftForAFullRotation = 360 / (this.context.kaleParameters.numCols.getValue() * 2 + 1);
            const distanceFromClosestMultiple = modAndShiftToHalf(colColorShift, colorShiftForAFullRotation);
            colColorShift = colColorShift - distanceFromClosestMultiple;
        }
        const rowColorShift = this.context.kaleParameters.rowColorShift.getValue();
        const colorShift = colColorShift * x + rowColorShift * y;
        if (colorShift !== 0) {
            color.spin(colorShift);
        }
        return color.toHexString();
    },
    _getColor: function(x, y) {
        return this._getColorByShifting(x, y);
    },
    _getColorByAnchor: function() {
        const x = this.props.logicalX;
        const y = this.props.logicalY;
        let xMod6 = posMod(x, 6);
        const xDiv6 = (x - xMod6) / 6;
        let yMod6 = posMod(y, 6);
        const yDiv6 = (y - yMod6) / 6;

        let lowerLeft = [xDiv6 * 6, yDiv6 * 6].join(',');
        let lowerRight = [xDiv6 * 6 + 6, yDiv6 * 6].join(',');
        const mid = [xDiv6 * 6 + 3, yDiv6 * 6 + 3].join(',');
        let upperLeft = [xDiv6 * 6, yDiv6 * 6 + 6].join(',');
        let upperRight = [xDiv6 * 6 + 6, yDiv6 * 6 + 6].join(',');

        if (xMod6 > 3) {
            xMod6 = 6 - xMod6;
            [lowerLeft, lowerRight, upperLeft, upperRight] = [lowerRight, lowerLeft, upperRight, upperLeft];
        }
        if (yMod6 > 3) {
            yMod6 = 6 - yMod6;
            [lowerLeft, lowerRight, upperLeft, upperRight] = [upperLeft, upperRight, lowerLeft, lowerRight];
        }
        switch (`${xMod6},${yMod6}`) {
            case '0,0':
                return this._mixColors(lowerLeft);
            case '0,2':
                return this._mixColors(lowerLeft, lowerLeft, lowerRight);
            case '1,1':
                return this._mixColors(lowerLeft, lowerLeft, mid);
            case '1,3':
                return this._mixColors(lowerLeft, mid, lowerRight);
            case '2,0':
                return this._mixColors(lowerLeft, lowerLeft, upperLeft);
            case '2,2':
                return this._mixColors(lowerLeft, mid, mid);
            case '3,1':
                return this._mixColors(lowerLeft, mid, upperLeft);
            case '3,3':
                return this._mixColors(mid);
            default:
                throw new Error('color combo shouldnt exist');
        }
    },
    _mixColors: function(...coords) {
        const colorsByCoords = this.context.kaleParameters.colorsByCoords;
        if (coords.length === 1) {
            return colorsByCoords[coords[0]].getValue();
        } else {
            const initialMix = tinycolor.mix(
                colorsByCoords[coords[0]].getValue(),
                colorsByCoords[coords[1]].getValue(),
                50,
            );

            return tinycolor.mix(
                initialMix,
                colorsByCoords[coords[2]].getValue(),
                33,
            );
        }
    },
    render: function() {
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

            return (
                <g key={index} transform={`${scale}rotate(${rotationDeg})`} stroke={this._getColor(xWithMapperShapeOffset, yWithMapperShapeOffset)}>
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
