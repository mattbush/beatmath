const _ = require('underscore');
const React = require('react');

const SQRT_3 = Math.pow(3, 0.5);
const ClipPaths = _.map([
    <clipPath id="halfInfinite" key="0">
        <rect x="0" y="-1000" width="1000" height="2000" />
    </clipPath>,
    <clipPath id="sixthInfinite" key="0">
        <polygon points={`0,0 1000,${1000 / SQRT_3} 1000,-${1000 / SQRT_3}`} />
    </clipPath>,
    <clipPath id="halfCell" key="0">
    <polygon points={`0,0 0,${2 / SQRT_3} 1,${1 / SQRT_3} 1,-${1 / SQRT_3} 0,-${2 / SQRT_3}`} />
    </clipPath>,
    <clipPath id="sixthCell" key="0">
        <polygon points={`0,0 1,${1 / SQRT_3} 1,-${1 / SQRT_3}`} />
    </clipPath>,
], (clipPath, i) => React.cloneElement(clipPath, {key: i}));

module.exports = ClipPaths;
