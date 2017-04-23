const _ = require('lodash');
const tinycolor = require('tinycolor2');
const {posMod} = require('js/core/utils/math');

const pieceName = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);

const mappingPaletteByPieceName = {
    // flora palette (red, orange, greens)
    flora: [-15, 45, 115, 100, 25],
    // snowstorm palette (cyans, blues)
    snowstorm: [185, 210, 235, 285],
    wall_snowstorm: [185, 210, 235, 285],
    // earthday palette (orange, greens)
    earthday: [35, 115, 100],
    wall_earthday: [35, 115, 100],
};

const MAPPING_PALETTE = mappingPaletteByPieceName[pieceName];

const USE_COLOR_MAPPING = !!MAPPING_PALETTE;

function mapColorToPalette(color, palette) {
    const paletteSize = palette.length;

    const hsv = color.toHsv();
    const originalHue = hsv.h;

    const unroundedIndexInPalette = originalHue * paletteSize / 360;
    const primaryIndexInPalette = Math.round(unroundedIndexInPalette);
    const difference = unroundedIndexInPalette - primaryIndexInPalette;
    const secondaryIndexInPalette = difference > 0 ? (primaryIndexInPalette + 1) : (primaryIndexInPalette - 1);

    const primaryHue = palette[posMod(primaryIndexInPalette, paletteSize)];
    const secondaryHue = palette[posMod(secondaryIndexInPalette, paletteSize)];

    const primaryColor = {...hsv, h: primaryHue};
    const secondaryColor = {...hsv, h: secondaryHue};

    const mixAmount = (1 - Math.cos(difference * Math.PI)) / 2; // 0...0.5
    const result = tinycolor.mix(primaryColor, secondaryColor, mixAmount * 100);
    return result;
}

const cache = {};

function mapColorString(colorString) {
    if (USE_COLOR_MAPPING) {
        if (!_.has(cache, colorString)) {
            const original = tinycolor(colorString);
            const mapped = mapColorToPalette(original, MAPPING_PALETTE);
            cache[colorString] = mapped.toHexString();
        }

        return cache[colorString];
    } else {
        return colorString;
    }
}

module.exports = mapColorString;
