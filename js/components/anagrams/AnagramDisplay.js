var React = require('react');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var AnagramSet = require('js/state/anagrams/AnagramSet');
var AnagramSetComponent = require('js/components/anagrams/AnagramSet');
var DancingText = require('js/components/anagrams/DancingText');

var timeout = duration => new Promise(cb => setTimeout(cb, duration));

const {WIDTH_PX, DESIRED_HEIGHT_PX} = require('js/beatmath_constants.js');
const {ANAGRAM_SET_CYCLE_TIME, LETTER_TRANSITION_TIME} = require('js/anagram_constants');

var AnagramSetCycler = React.createClass({
    getInitialState: function() {
        return {
            prevAnagramSetIndex: -1,
            anagramSetIndex: 0,
            nextAnagramSetIndex: -1,
        };
    },
    componentDidMount: function() {
        this._intervalId = setInterval(this._cycleAnagramSetIndex, ANAGRAM_SET_CYCLE_TIME);
    },
    componentWillUnmount: function() {
        clearInterval(this._intervalId);
    },
    _cycleAnagramSetIndex: async function() {
        var newAnagramSetIndex = (this.state.anagramSetIndex + 1) % this.props.anagramSets.length;
        this.setState({
            nextAnagramSetIndex: newAnagramSetIndex,
        });
        await timeout(LETTER_TRANSITION_TIME);
        this.setState({
            nextAnagramSetIndex: -1,
            anagramSetIndex: this.state.nextAnagramSetIndex,
            prevAnagramSetIndex: this.state.anagramSetIndex,
        });
        await timeout(LETTER_TRANSITION_TIME);
        this.setState({
            prevAnagramSetIndex: -1,
        });
    },
    render: function() {
        var prev = this.props.anagramSets[this.state.prevAnagramSetIndex];
        var cur = this.props.anagramSets[this.state.anagramSetIndex];
        var next = this.props.anagramSets[this.state.nextAnagramSetIndex];

        return (
            <g>
                {prev &&
                    <AnagramSetComponent xPosition={-1} anagramSet={prev} key={prev.getId()} />
                }
                <AnagramSetComponent xPosition={0} anagramSet={cur} key={cur.getId()} />
                {next &&
                    <AnagramSetComponent xPosition={1} anagramSet={next} key={next.getId()} />
                }
            </g>
        );
    },
});

var AnagramDisplay = React.createClass({
    mixins: [LinkedStateMixin],
    getInitialState: function() {
        return {
            anagramSets: [
                new AnagramSet(['MATT BUSH', 'MATHTUBS']),
                new AnagramSet(['ANAGRAMS NEVER LIE', 'A RENAMING REVEALS']),
            ],
            inputState: null,
            error: false,
            textValue: '',
            textEntries: [],
        };
    },
    _onInputKeyDown: function(e) {
        if (this.state.inputState === null) {
            this.setState({
                inputState: 0,
                textValue: '',
                textEntries: [],
                error: false,
            });
            e.preventDefault();
        } else if (this.state.inputState === 0) {
            if (e.key === 'Enter') {
                this.state.textEntries.push(this.state.textValue.trim());
                this.setState({
                    textValue: '',
                    inputState: 1,
                    error: false,
                });
            } else if (e.key === 'Escape') {
                this.setState({inputState: null});
            }
        } else {
            if (e.key === 'Enter') {
                this.state.textEntries.push(this.state.textValue.trim());

                if (e.getModifierState('Shift')) {
                    this.setState({
                        textValue: '',
                        inputState: this.state.inputState + 1,
                        error: false,
                    });
                } else {
                    var anagramSet = new AnagramSet(this.state.textEntries);
                    if (anagramSet.isValid()) {
                        this.state.anagramSets.unshift(anagramSet);
                        this.setState({inputState: null});
                    } else {
                        this.state.textEntries.pop();
                        this.setState({
                            textValue: '',
                            error: true,
                        });
                    }
                }
            } else if (e.key === 'Escape') {
                this.setState({inputState: null});
            }
        }
    },
    _renderContents: function() {
        if (this.state.inputState === null) {
            return <AnagramSetCycler key={this.state.anagramSets.length} anagramSets={this.state.anagramSets} />;
        } else {
            var headerText = ['Enter your name', 'Enter your anagram'][this.state.inputState] || 'Enter another anagram';
            if (this.state.error) {
                headerText = 'Invalid. Re-' + headerText;
            }
            return (
                <g>
                    <text className="header" textAnchor="middle" x="0" y="-56">
                        {headerText.toUpperCase()}
                    </text>
                    <DancingText text={this.state.textValue.toUpperCase()} />
                </g>
            );
        }
    },
    render: function() {
        return (
            <div>
                {/* <div className="backgroundImage" style={{top: (DESIRED_HEIGHT_PX - HEIGHT_PX) / 2}} /> */}
                <div className="main">
                    <svg width={WIDTH_PX} height={DESIRED_HEIGHT_PX} className="brickGrid">
                        <g transform={`translate(${WIDTH_PX / 2}, ${DESIRED_HEIGHT_PX / 2}) scale(1)`}>
                            {this._renderContents()}
                        </g>
                    </svg>
                </div>
                <input
                    autoFocus={true}
                    className="anagramTextInput"
                    onKeyDown={this._onInputKeyDown}
                    type="text"
                    valueLink={this.linkState('textValue')}
                />
            </div>
        );
    },
});

module.exports = AnagramDisplay;