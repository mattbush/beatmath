const _ = require('underscore');
const React = require('react');

const VALUE_X_SPACING = 125;
const VALUE_Y_SPACING = 100;

const MonitorValue = React.createClass({
    render: function() {
        const payload = this.props.value;
        const style = payload.x !== undefined ? {
            left: VALUE_X_SPACING * payload.x,
            top: VALUE_Y_SPACING * payload.y,
        } : null;
        const value = payload.value;
        const valueString = (_.isNumber(value) && !Number.isInteger(value)) ? value.toPrecision(4) : value;

        return (
            <div className="monitorCell" style={style}>
                <div className="monitorName">
                    {payload.name}
                </div>
                <div className="monitorValue">
                    {valueString}
                </div>
            </div>
        );
    },
});

module.exports = MonitorValue;
