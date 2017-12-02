const _ = require('lodash');
const React = require('react');
const MonitorValue = require('js/core/outputs/monitor/MonitorValue');
const PieceNameToLoadInput = require('js/core/outputs/monitor/PieceNameToLoadInput');
const MonitorChannelManager = require('js/core/outputs/monitor/MonitorChannelManager');

const Monitor = React.createClass({
    getInitialState() {
        return {
            isInChannelManager: false,
        };
    },
    componentDidMount() {
        this._parsedStorage = {};
        this._throttledForceUpdate = _.throttle(this.forceUpdate.bind(this), 50);
        window.addEventListener('storage', this._onStorage);
    },
    _onStorage(event) {
        if (event.key === 'mapping' || event.key === 'pieceNameToLoad') {
            return;
        }
        this._parsedStorage[event.key] = JSON.parse(event.newValue);
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
                    <MonitorChannelManager /> :
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
