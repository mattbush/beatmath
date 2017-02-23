const _ = require('lodash');

class StopwatchVisList {
    constructor(stopwatchParameters) {
        this._stopwatchParameters = stopwatchParameters;

        this._objects = [];
        this._stopwatchParameters.numVisibleTrails.addListener(this._adjustSize.bind(this));
        this._stopwatchParameters.hidePercent.addListener(this._onHidePercentChange.bind(this));

        this._adjustSize();
    }
    _onHidePercentChange() {
        if (this._getHiddenCountFromParams() === this._hiddenCount) {
            return;
        }
        this._adjustSize();
    }
    _adjustSize() {
        // const formerOverallCount = this._objects.length;
        // const formerVisibleCount = this._objects.filter(x => x.visibility).length;
        // const formerHiddenCount = formerOverallCount - formerVisibleCount;
        // todo: cleverly recycle existing object order

        this._hiddenCount = this._getHiddenCountFromParams();
        this._visibleCount = this._getVisibleCountFromParams();
        this._overallCount = this._visibleCount + this._hiddenCount;

        this._objects = _.times(this._overallCount, id => ({
            id: id,
            visibility: id < this._visibleCount,
        }));
        this._recalculateIndices();
        this._stopwatchParameters.numTrailsChanged._updateListeners();
    }
    _recalculateIndices() {
        this._visibleObjects = this._objects.filter(x => x.visibility);
        this._visibleIndicesById = _.invert(this._visibleObjects.map(x => x.id));
    }
    getOverallCount() {
        return this._overallCount;
    }
    getVisibleIndexForId(id) {
        return this._visibleIndicesById[id];
    }
    isIdVisible() {
        return this.getVisibleIndexForId() !== undefined;
    }
    update() {
        const hiddenObjects = this._objects.filter(x => !x.visibility);

        // hide n visible objects
        const shuffledVisibleObjects = _.shuffle(this._visibleObjects);
        for (const obj of shuffledVisibleObjects.slice(0, this._hiddenCount)) {
            obj.visibility = false;
        }

        // show n hidden objets
        for (let obj of hiddenObjects) {
            obj.visibility = true;
        }

        // shuffle
        this._objects = _.shuffle(this._objects);
        this._recalculateIndices();
    }
    _getVisibleCountFromParams() {
        return this._stopwatchParameters.numVisibleTrails.getValue();
    }
    _getHiddenCountFromParams() {
        return Math.round(
            this._getVisibleCountFromParams() * this._stopwatchParameters.hidePercent.getValue(),
        );
    }
}

module.exports = StopwatchVisList;
