const _ = require('lodash');
const React = require('react');
const mapColorString = require('js/core/utils/mapColorString');

const TWOPI = Math.PI * 2;

function generateFlowerPath(aperture, rotundity) {
    const aperturePercent = aperture / 128;
    const rotundityPercent = rotundity / 128;

    const apertureCoeff = 0.3 * aperturePercent + 0.05;
    const scale = 2 - apertureCoeff + rotundityPercent / 4;
    const points = _.times(6, i => {
        if (i % 2) {
            return [Math.cos(i / 6 * TWOPI) * scale, Math.sin(i / 6 * TWOPI) * scale].map(x => _.round(x, 5));
        } else {
            return [Math.cos(i / 6 * TWOPI) * apertureCoeff * scale, Math.sin(i / 6 * TWOPI) * apertureCoeff * scale].map(x => _.round(x, 5));
        }
    });

    let d = '';
    d += 'M ' + points[points.length - 1].join(' ');

    const arcRadius = (scale / 2) * (3 ** rotundityPercent);

    points.forEach(point => {
        d += ` A ${arcRadius} ${arcRadius}, 0, 0, 1, ` + point.join(' ');
    });

    return d;
}

const GENERATED_FLOWER_PATHS = _.times(129, aperture => {
    return _.times(129, rotundity => {
        return generateFlowerPath(aperture, rotundity);
    });
});

const FloraInnerPixel = React.createClass({
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
    },
    render: function() {
        const colorSpin = this.context.beatmathParameters.colorSpin.getValue();
        const brightness = this.context.beatmathParameters.brightness.getValue();

        let color = this.props.color;
        if (colorSpin !== 0) {
            color = color.spin(colorSpin);
        }
        if (brightness !== 1) {
            color = color.darken((1 - brightness) * 100);
        }
        const fill = mapColorString(color.toHexString(true));

        const d = GENERATED_FLOWER_PATHS[this.props.aperture][this.props.rotundity];

        return (
            <path d={d} fill={fill} />
        );
    },
});

module.exports = FloraInnerPixel;
