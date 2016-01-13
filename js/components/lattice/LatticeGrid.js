var _ = require('underscore');
var React = require('react');
var InfluenceCircle = require('js/components/lattice/InfluenceCircle');
var LatticePixel = require('js/components/lattice/LatticePixel');

const {WIDTH_PX, HEIGHT_PX} = require('js/parameters/lattice/LatticeConstants');

const SHOW_INFLUENCES = false;

var LatticeGrid = React.createClass({
    render: function() {
        const children = [];
        for (let row = 0; row < this.props.numRows; row++) {
            for (let col = 0; col < this.props.numCols; col++) {
                children.push(<LatticePixel influences={this.props.influences} row={row} col={col} key={row + '|' + col} />);
            }
        }

        return (
            <svg width={WIDTH_PX} height={HEIGHT_PX} className="colorGrid">
                <g>
                    {children}
                </g>
                {SHOW_INFLUENCES && <g>
                    {_.map(this.props.influences, (influence, index) =>
                        <InfluenceCircle influence={influence} key={index} />
                    )}
                </g>}
            </svg>
        );
    },
});

module.exports = LatticeGrid;
