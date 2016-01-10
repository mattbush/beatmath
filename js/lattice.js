var React = require('react');
var ReactDOM = require('react-dom');
var tinycolor = require('tinycolor2');
var LatticeGrid = require('js/components/lattice/LatticeGrid');

const {NUM_COLS, NUM_ROWS, MAX_SIZE} = require('js/lattice_constants');
const {ColorInfluence, RotationInfluence, SizeInfluence} = require('js/influence');

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

document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
      <div className="main">
        <LatticeGrid numRows={NUM_ROWS} numCols={NUM_COLS} influences={influences} />
      </div>,
      document.getElementById('start')
    );
});
