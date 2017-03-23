const _ = require('lodash');
const React = require('react');
const MonitorValue = require('js/core/outputs/monitor/MonitorValue');
const PieceNameToLoadInput = require('js/core/outputs/monitor/PieceNameToLoadInput');

const Monitor = React.createClass({
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
    render() {
        return (
            <div className="main">
                {_.map(_.pickBy(this._parsedStorage), (value, key) =>
                    <MonitorValue
                        key={key}
                        value={value}
                    />
                )}
                <PieceNameToLoadInput />
            </div>
        );
    },
});

module.exports = Monitor;
