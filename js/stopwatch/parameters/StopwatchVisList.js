const _ = require('lodash');
const {posMod} = require('js/core/utils/math');

class StopwatchVisList {
    constructor(stopwatchParameters) {
        this._stopwatchParameters = stopwatchParameters;

        this._numUpdates = 0;

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
        const visibleIndexString = this._visibleIndicesById[id];
        if (visibleIndexString) {
            return Number(visibleIndexString);
        }
        return visibleIndexString;
    }
    isIdVisible() {
        return this.getVisibleIndexForId() !== undefined;
    }
    update() {
        this._numUpdates++;

        const hiddenObjects = this._objects.filter(x => !x.visibility);

        if (this._stopwatchParameters.hideRandomly.getValue()) {
            // hide n visible objects
            const shuffledVisibleObjects = _.shuffle(this._visibleObjects);
            for (const obj of shuffledVisibleObjects.slice(0, this._hiddenCount)) {
                obj.visibility = false;
            }
        } else {
            const numVisiblePerNumHidden = this._visibleCount / this._hiddenCount;
            _.times(this._hiddenCount, index => {
                const visibleIndex = index * numVisiblePerNumHidden + this._numUpdates % numVisiblePerNumHidden;
                const nearestIndex = posMod(Math.round(visibleIndex), this._visibleCount);
                this._visibleObjects[nearestIndex].visibility = false;
            });
        }

        // show n hidden objets
        for (let obj of hiddenObjects) {
            obj.visibility = true;
        }

        // shuffle hidden ones?
        // this._objects = _.shuffle(this._objects);

        // basic criscross
        const crisscrossPercent = this._stopwatchParameters.crisscrossPercent.getValue();
        if (crisscrossPercent > 0) {
            _.times(this._overallCount / 2, i => {
                if (crisscrossPercent === 1 || crisscrossPercent >= Math.random()) {
                    const firstIndex = (2 * i + (this._numUpdates % 2 ? 2 : 0)) % this._overallCount;
                    const secondIndex = 2 * i + 1;

                    [this._objects[firstIndex], this._objects[secondIndex]] = [this._objects[secondIndex], this._objects[firstIndex]];
                }
            });
        }

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
