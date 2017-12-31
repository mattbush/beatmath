const _ = require('lodash');
const React = require('react');
const tinycolor = require('tinycolor2');
const updateHue = require('js/core/outputs/updateHue');
const MonitorValue = require('js/core/outputs/monitor/MonitorValue');
const PieceNameToLoadInput = require('js/core/outputs/monitor/PieceNameToLoadInput');
const MonitorChannelManager = require('js/core/outputs/monitor/MonitorChannelManager');
const {HUE_BRIDGE_IP_ADDRESS, HUE_API_KEY} = require('js/hue_constants');

const IS_TESTING_CHANNEL_MANAGER = false;
// const IS_TESTING_CHANNEL_MANAGER = true;

const BLACK = tinycolor('#000');

const Monitor = React.createClass({
    getInitialState() {
        return {
            isInChannelManager: IS_TESTING_CHANNEL_MANAGER,
            hueConfig: null,
        };
    },
    componentDidMount() {
        this._parsedStorage = {};
        this._colorsByChannel = {};
        this._channelsByLightIndex = {};
        this._brightnessPercentsByLightIndex = {};
        this._throttledForceUpdate = _.throttle(this.forceUpdate.bind(this), 60);
        window.addEventListener('storage', this._onStorage);

        const url = `http://${HUE_BRIDGE_IP_ADDRESS}/api/${HUE_API_KEY}`;
        fetch(url)
            .then(x => x.json())
            .then(json => {
                this.setState({hueConfig: json});
            });
    },
    _broadcastChannelColor(channelIndex) {
        const color = this._colorsByChannel[channelIndex];
        _.each(this._channelsByLightIndex, (channelIndexForLight, lightIndex) => {
            if (channelIndexForLight === channelIndex) {
                const rawBrightnessPercent = this._brightnessPercentsByLightIndex[lightIndex];
                const brightnessPercent = typeof rawBrightnessPercent === 'number' ? rawBrightnessPercent : 1;

                updateHue(Number(lightIndex), color, {briCoeff: brightnessPercent});
            }
        });
    },
    _tickChannels(numTicks) {
        const halfNumTicks = Math.floor(numTicks / 2);
        const isTurningOn = numTicks % 2 === 0;
        let targetMod4;
        if (isTurningOn) {
            targetMod4 = halfNumTicks % 4;
        } else {
            targetMod4 = halfNumTicks % 4;
        }

        _.each(this._channelsByLightIndex, (channelIndex, lightIndex) => {
            if (lightIndex % 4 !== targetMod4) {
                return;
            }
            if (typeof channelIndex !== 'number') {
                return;
            }
            const color = this._colorsByChannel[channelIndex];
            const rawBrightnessPercent = this._brightnessPercentsByLightIndex[lightIndex];
            const brightnessPercent = typeof rawBrightnessPercent === 'number' ? rawBrightnessPercent : 1;
            if (isTurningOn) {
                updateHue(Number(lightIndex), color, {briCoeff: brightnessPercent});
            } else {
                updateHue(Number(lightIndex), BLACK);
            }
        });
    },
    _onMapLightToChannel(lightIndex, channelIndex) {
        this._channelsByLightIndex[lightIndex] = channelIndex;
        this._throttledForceUpdate();
    },
    _onChangeLightBrightnessPercent(lightIndex, brightnessPercent) {
        this._brightnessPercentsByLightIndex[lightIndex] = brightnessPercent;
        this._throttledForceUpdate();
    },
    _onStorage(event) {
        if (event.key === 'mapping' || event.key === 'pieceNameToLoad') {
            return;
        }
        if (event.key === 'channelColor') {
            const {channelIndex, color} = JSON.parse(event.newValue);
            this._colorsByChannel[channelIndex] = tinycolor(color);
            this._broadcastChannelColor(channelIndex);
        } else if (event.key === 'tick') {
            this._tickChannels(JSON.parse(event.newValue));
        } else {
            this._parsedStorage[event.key] = JSON.parse(event.newValue);
        }
        this._throttledForceUpdate();
    },
    _onTabsClick() {
        this.setState({
            isInChannelManager: !this.state.isInChannelManager,
        });
    },
    render() {
        const {isInChannelManager} = this.state;

        return (
            <div className="main">
                <div onClick={this._onTabsClick}>
                    <span className={isInChannelManager ? 'tab' : 'tab sel'}>Monitor</span>
                    <span className={isInChannelManager ? 'tab sel' : 'tab'}>Channel Manager</span>
                </div>
                {isInChannelManager ?
                    <MonitorChannelManager
                        hueConfig={this.state.hueConfig}
                        colorsByChannel={this._colorsByChannel}
                        channelsByLightIndex={this._channelsByLightIndex}
                        onMapLightToChannel={this._onMapLightToChannel}
                        brightnessPercentsByLightIndex={this._brightnessPercentsByLightIndex}
                        onChangeLightBrightnessPercent={this._onChangeLightBrightnessPercent}
                    /> :
                    <div>
                        {_.map(_.pickBy(this._parsedStorage), (value, key) =>
                            <MonitorValue
                                key={key}
                                value={value}
                            />
                        )}
                        <PieceNameToLoadInput />

                    </div>
                }
            </div>
        );
    },
});

module.exports = Monitor;
