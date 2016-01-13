var React = require('react');
var ReactDOM = require('react-dom');
var TwentySixteen = require('js/components/twenty_sixteen/TwentySixteen');

const {WIDTH_PX, DESIRED_HEIGHT_PX} = require('js/parameters/BeatmathConstants');

document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
      <div className="main">
          <svg width={WIDTH_PX} height={DESIRED_HEIGHT_PX} className="main">
              <g transform={`translate(${WIDTH_PX / 2}, ${DESIRED_HEIGHT_PX / 2})`}>
                  <TwentySixteen />
              </g>
          </svg>
      </div>,
      document.getElementById('start')
    );
});
