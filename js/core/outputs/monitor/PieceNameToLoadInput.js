// const _ = require('lodash');
const React = require('react');

const VALUE_X_SPACING = 115;
const VALUE_Y_SPACING = 100;

const PieceNameToLoadInput = React.createClass({
    _onKeyDown(e) {
        if (e.key === 'Enter') {
            window.localStorage.setItem('pieceNameToLoad', e.target.value);
            e.target.value = '';
            e.target.blur();
        }
    },
    _onClick() {
        this._input.focus();
    },
    render() {
        const style = {
            left: VALUE_X_SPACING * 9.5,
            top: VALUE_Y_SPACING * 0,
        };

        return (
            <div className="foo monitorCell" style={style} onClick={this._onClick}>
                <div className="monitorName">
                    Load Piece
                </div>
                <div className="monitorValue">
                    <input type="text" ref={el => this._input = el} onKeyDown={this._onKeyDown} />
                </div>
            </div>
        );
    },
});

module.exports = PieceNameToLoadInput;
