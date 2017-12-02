const _ = require('lodash');
const React = require('react');

const {NUM_CHANNELS} = require('js/core/outputs/updateChannel');

const MonitorChannelLight = React.createClass({
    render() {
        const hueConfig = this.props.hueConfig;
        const light = hueConfig.lights[this.props.index];
        const colorsByChannel = this.props.colorsByChannel;

        return (
            <div className="lightContainer">
                <div
                    className="lightStatus"
                    style={{
                        backgroundColor: light.state.reachable ? (light.state.on ? '#fff' : '#808080') : '#000',
                        borderColor: (light.state.reachable && light.state.on) ? '#fff' : '#808080',
                    }}
                />
                <div className="lightName">
                    {light.name}
                </div>
                {_.times(NUM_CHANNELS, channelIndex =>
                    <div
                        className="channel"
                        key={channelIndex}
                        style={{
                            width: 5,
                            margin: '0px 12px',
                            backgroundColor: colorsByChannel[channelIndex] ? colorsByChannel[channelIndex].toHexString() : null,
                        }}
                    />
                )}
            </div>
        );
    },
});

const MonitorChannelRoom = React.createClass({
    render() {
        const hueConfig = this.props.hueConfig;
        const room = hueConfig.groups[this.props.index];

        return (
            <div className="roomContainer">
                <div className="roomName">
                    {room.name}
                </div>
                <div className="lightList">
                    {room.lights.map(index =>
                        <MonitorChannelLight
                            key={index}
                            index={index}
                            hueConfig={hueConfig}
                            colorsByChannel={this.props.colorsByChannel}
                        />
                    )}
                </div>
            </div>
        );
    },
});

const MonitorChannelManager = React.createClass({
    render() {
        const hueConfig = this.props.hueConfig;

        if (hueConfig) {
            return (
                <div className="roomList">
                    {_.map(hueConfig.groups, (room, index) =>
                        <MonitorChannelRoom
                            key={index}
                            index={index}
                            hueConfig={hueConfig}
                            colorsByChannel={this.props.colorsByChannel}
                        />
                    )}
                </div>
            );
        } else {
            return null;
        }
    },
});

module.exports = MonitorChannelManager;
