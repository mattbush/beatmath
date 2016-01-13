var _ = require('underscore');
var React = require('react');
var InfluenceCircle = require('js/components/lattice/InfluenceCircle');
var LatticePixel = require('js/components/lattice/LatticePixel');

const {WIDTH_PX, HEIGHT_PX, NUM_COLS, NUM_ROWS, MAX_SIZE} = require('js/parameters/lattice/LatticeConstants');

var tinycolor = require('tinycolor2');
var {ColorInfluence, RotationInfluence, SizeInfluence} = require('js/state/lattice/Influence');

const SHOW_INFLUENCES = false;

var influences = [
    new ColorInfluence({startCol: 0.2 * NUM_COLS, startRow: 0.2 * NUM_ROWS, startValue: tinycolor('#800'), index: 0}),
    new ColorInfluence({startCol: 0.8 * NUM_COLS, startRow: 0.2 * NUM_ROWS, startValue: tinycolor('#080'), index: 1}),
    new ColorInfluence({startCol: 0.5 * NUM_COLS, startRow: 0.8 * NUM_ROWS, startValue: tinycolor('#008'), index: 2}),

    new SizeInfluence({startCol: 0.2 * NUM_COLS, startRow: 0.2 * NUM_ROWS, startValue: MAX_SIZE * 0.5}),
    new SizeInfluence({startCol: 0.8 * NUM_COLS, startRow: 0.2 * NUM_ROWS, startValue: MAX_SIZE * 0.5}),
    new SizeInfluence({startCol: 0.5 * NUM_COLS, startRow: 0.8 * NUM_ROWS, startValue: MAX_SIZE * 0.5}),

    new RotationInfluence({startCol: 0.2 * NUM_COLS, startRow: 0.2 * NUM_ROWS, startValue: 0}),
    new RotationInfluence({startCol: 0.8 * NUM_COLS, startRow: 0.2 * NUM_ROWS, startValue: 0}),
    new RotationInfluence({startCol: 0.5 * NUM_COLS, startRow: 0.8 * NUM_ROWS, startValue: 0}),
];

var LatticeGrid = React.createClass({
    render: function() {
        const children = [];
        for (let row = 0; row < NUM_ROWS; row++) {
            for (let col = 0; col < NUM_COLS; col++) {
                children.push(<LatticePixel influences={influences} row={row} col={col} key={row + '|' + col} />);
            }
        }

        return (
            <svg width={WIDTH_PX} height={HEIGHT_PX} className="colorGrid">
                <g>
                    {children}
                </g>
                {SHOW_INFLUENCES && <g>
                    {_.map(influences, (influence, index) =>
                        <InfluenceCircle influence={influence} key={index} />
                    )}
                </g>}
            </svg>
        );
    },
});

module.exports = LatticeGrid;
