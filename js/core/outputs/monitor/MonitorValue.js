const _ = require('underscore');
const React = require('react');
const {posMod} = require('js/core/utils/math');

const VALUE_X_SPACING = 125;
const VALUE_Y_SPACING = 100;

const MonitorValue = React.createClass({
    render: function() {
        const payload = this.props.value;
        const style = payload.x !== undefined ? {
            left: VALUE_X_SPACING * payload.x,
            top: VALUE_Y_SPACING * payload.y,
        } : null;
        let value = payload.value;
        if (payload.type === 'Angle') {
            value = posMod(value, 360);
        }

        let valueString = (_.isNumber(value) && !Number.isInteger(value)) ? value.toPrecision(4) : value;
        if (payload.type === 'Angle') {
            valueString += '°';
        } else if (payload.type === 'Toggle') {
            valueString = value ? 'ON' : 'OFF';
        }

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
