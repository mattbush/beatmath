const React = require('react');
const LinkedStateMixin = require('react-addons-linked-state-mixin');
const AnagramsParameters = require('js/anagrams/parameters/AnagramsParameters');
const AnagramSet = require('js/anagrams/state/AnagramSet');
const AnagramSetComponent = require('js/anagrams/components/AnagramSet');
const DancingText = require('js/anagrams/components/DancingText');
const BeatmathFrame = require('js/core/components/BeatmathFrame');

const timeout = duration => new Promise(cb => setTimeout(cb, duration));

const {ANAGRAM_SET_CYCLE_TIME, LETTER_TRANSITION_TIME} = require('js/anagrams/parameters/AnagramsConstants');

const AnagramSetCycler = React.createClass({
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
        const newAnagramSetIndex = (this.state.anagramSetIndex + 1) % this.props.anagramSets.length;
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
        const prev = this.props.anagramSets[this.state.prevAnagramSetIndex];
        const cur = this.props.anagramSets[this.state.anagramSetIndex];
        const next = this.props.anagramSets[this.state.nextAnagramSetIndex];

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

const AnagramDisplay = React.createClass({
    mixins: [LinkedStateMixin],
    childContextTypes: {
        anagramsParameters: React.PropTypes.object,
    },
    contextTypes: {
        mixboard: React.PropTypes.object,
        beatmathParameters: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            anagramsParameters: this.state.anagramsParameters,
        };
    },
    getInitialState: function() {
        return {
            anagramsParameters: new AnagramsParameters(this.context.mixboard, this.context.beatmathParameters),
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
                    const anagramSet = new AnagramSet(this.state.textEntries);
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
            let headerText = ['Enter your name', 'Enter your anagram'][this.state.inputState] || 'Enter another anagram';
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
                <BeatmathFrame>
                    {this._renderContents()}
                </BeatmathFrame>
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
