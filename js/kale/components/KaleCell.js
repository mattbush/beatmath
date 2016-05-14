const _ = require('underscore');
const React = require('react');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
const KaleSubject = require('js/kale/components/KaleSubject');
const {posMod} = require('js/core/utils/math');
const tinycolor = require('tinycolor2');

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
        };
    },
    _getColor: function() {
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
        switch(`${xMod6},${yMod6}`) {
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
        const reflectionsPerCell = this.getParameterValue('reflectionsPerCell');
        const clipPathPrefix = (isInfinite ? 'I' : 'C') + reflectionsPerCell;

        const x = this.props.logicalX;
        const y = this.props.logicalY * Y_AXIS_SCALE;

        const reflectionElements = _.times(reflectionsPerCell, index => {
            const rotationDeg = Math.floor(index / 2) * (360 / (reflectionsPerCell / 2));
            const scale = (index % 2) ? ' scale(-1, 1)' : '';
            const clipPathPrefixFull = clipPathPrefix + ((reflectionsPerCell === 6 && index >= 2) ? 'B' : '');

            const clipPath = `url(#${clipPathPrefixFull}~1)`;

            return (
                <g key={index} transform={`rotate(${rotationDeg})${scale}`}>
                    <g clipPath={clipPath}>
                        <KaleSubject cellX={x} cellY={y} />
                    </g>
                </g>
            );
        });

        return (
            <g transform={`translate(${x}, ${y})`} stroke={this._getColor().toHexString()}>
                {reflectionElements}
            </g>
        );
    },
});

module.exports = KaleCell;
