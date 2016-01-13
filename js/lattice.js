var React = require('react');
var ReactDOM = require('react-dom');
var LatticeGrid = require('js/components/lattice/LatticeGrid');

document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
      <LatticeGrid />,
      document.getElementById('start')
    );
});
