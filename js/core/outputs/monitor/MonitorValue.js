const _ = require('lodash');
const React = require('react');
const {posMod} = require('js/core/utils/math');
const AutoupdateStatus = require('js/core/parameters/AutoupdateStatus');
const ParameterStatus = require('js/core/parameters/ParameterStatus');

const VALUE_X_SPACING = 125;
const VALUE_Y_SPACING = 100;

const STATUS_TO_COLOR = {
    [ParameterStatus.DETACHED]: '#f41',
    [ParameterStatus.BASE]: '#f81',
    [ParameterStatus.MIN]: '#ea1',
    [ParameterStatus.MAX]: '#ea1',
    [ParameterStatus.CHANGED]: '#de1',
    [ParameterStatus.CHANGING]: '#3e2',
};

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
            value = Math.round(value * 10) / 10;
        } else if (_.isNumber(value) && !Number.isInteger(value)) {
            value = value.toPrecision(value >= 1 ? 4 : 3);
        }

        if (payload.type === 'Angle') {
            value += '°';
        } else if (payload.type === 'Toggle') {
            value = value ? 'ON' : 'OFF';
        }

        const statusStyle = (payload.autoStatus === AutoupdateStatus.ACTIVE) ? {} : {
            color: STATUS_TO_COLOR[payload.status],
        };

        return (
            <div className="monitorCell" style={style}>
                <div className="monitorName">
                    {payload.name}
                </div>
                <div className="monitorValue">
                    {value}
                </div>
                <div className={`monitorStatus ${payload.autoStatus}`} style={statusStyle}>
                    {payload.autoStatus === AutoupdateStatus.ACTIVE ? 'AUTO' :
                        payload.status
                    }
                </div>
            </div>
        );
    },
});

module.exports = MonitorValue;
