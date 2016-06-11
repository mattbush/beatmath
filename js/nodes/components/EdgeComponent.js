const React = require('react');
const ReactDOM = require('react-dom');
const {lerp} = require('js/core/utils/math');

const EdgeComponent = React.createClass({
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        nodesParameters: React.PropTypes.object,
    },
    componentDidMount() {
        this._currentX1 = this._nextX1 = this.props.node1.x;
        this._currentY1 = this._nextY1 = this.props.node1.y;
        this._currentX2 = this._nextX2 = this.props.node2.x;
        this._currentY2 = this._nextY2 = this.props.node2.y;
        this._tickStart = performance.now();
        this.context.nodesParameters.addAnimationFrameListener(this._onAnimationFrame);
    },
    componentDidUpdate() {
        this._currentX1 = this._nextX1;
        this._currentY1 = this._nextY1;
        this._currentX2 = this._nextX2;
        this._currentY2 = this._nextY2;
        this._nextX1 = this.props.node1.x;
        this._nextY1 = this.props.node1.y;
        this._nextX2 = this.props.node2.x;
        this._nextY2 = this.props.node2.y;
        this._tickStart = performance.now();
    },
    componentWillUnmount() {
        this.context.nodesParameters.removeAnimationFrameListener(this._onAnimationFrame);
    },
    _onAnimationFrame(timestamp) {
        const interpolation = (timestamp - this._tickStart) / this.context.beatmathParameters.tempo.getPeriod();
        const el = ReactDOM.findDOMNode(this);
        el.setAttribute('x1', lerp(this._currentX1, this._nextX1, interpolation));
        el.setAttribute('y1', lerp(this._currentY1, this._nextY1, interpolation));
        el.setAttribute('x2', lerp(this._currentX2, this._nextX2, interpolation));
        el.setAttribute('y2', lerp(this._currentY2, this._nextY2, interpolation));
    },
    render() {
        const distance = this.props.node1.distanceFrom(this.props.node2);
        let distanceCoefficient = Math.min(0.1 / distance, 1); // if off, use 0.5
        const distanceCutoff = 0.15;
        distanceCoefficient = Math.max(0, (distanceCoefficient - distanceCutoff) * (1 / (1 - distanceCutoff)));
        const tempo = this.context.beatmathParameters.tempo;
        const style = {
            stroke: '#ff9900',
            strokeWidth: 0.01 * distanceCoefficient,
            transition: `strokeWidth ${tempo.getPeriod()}ms linear`,
        };
        return (
            <line style={style} />
        );
    },
});

module.exports = EdgeComponent;
