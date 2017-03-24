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
            visibility: id % 3 !== 1, // TODO Fragile
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

        const hideUsingCrisscross = true;

        if (this._stopwatchParameters.hideRandomly.getValue()) {
            // hide n visible objects
            const shuffledVisibleObjects = _.shuffle(this._visibleObjects);
            for (const obj of shuffledVisibleObjects.slice(0, this._hiddenCount)) {
                obj.visibility = false;
            }
            // show n hidden objets
            for (let obj of hiddenObjects) {
                obj.visibility = true;
            }
        } else if (!hideUsingCrisscross) {
            const numVisiblePerNumHidden = this._visibleCount / this._hiddenCount;
            _.times(this._hiddenCount, index => {
                const visibleIndex = index * numVisiblePerNumHidden + this._numUpdates % numVisiblePerNumHidden;
                const nearestIndex = posMod(Math.round(visibleIndex), this._visibleCount);
                this._visibleObjects[nearestIndex].visibility = false;
            });
            // show n hidden objets
            for (let obj of hiddenObjects) {
                obj.visibility = true;
            }
        }

        // shuffle hidden ones?
        // this._objects = _.shuffle(this._objects);

        // basic criscross
        const crisscrossPercent = this._stopwatchParameters.crisscrossPercent.getValue();
        const groupSize = 24; // TODO turn this into a param

        if (crisscrossPercent > 0) {
            _.times(this._overallCount, i => {
                // should we cross at this offset?
                // i % 2 === 0
                // i % 2 === Math.floor(this._numUpdates / 2) % 2
                if (i % 3 === 0) {
                    // whether to cross (random chance)
                    if (crisscrossPercent === 1 || crisscrossPercent >= Math.random()) {
                        const startIndexInGroup = i - (i % groupSize);
                        const actualGroupSize = Math.min(groupSize, this._overallCount - startIndexInGroup);
                        const firstIndexInGroup = i % actualGroupSize;
                        const secondIndexInGroup = (firstIndexInGroup + 1) % actualGroupSize;
                        const thirdIndexInGroup = (firstIndexInGroup + 2) % actualGroupSize;

                        if (firstIndexInGroup < secondIndexInGroup ||
                            (groupSize === this._overallCount && this._stopwatchParameters.polarGridAmount.getValue() > 0.9)) {
                            const firstIndex = startIndexInGroup + firstIndexInGroup;
                            const secondIndex = startIndexInGroup + secondIndexInGroup;
                            const thirdIndex = startIndexInGroup + thirdIndexInGroup;
                            this._objects[firstIndex].visibility = false;
                            this._objects[secondIndex].visibility = true;
                            [this._objects[firstIndex], this._objects[secondIndex], this._objects[thirdIndex]] = [this._objects[thirdIndex], this._objects[firstIndex], this._objects[secondIndex]];
                            console.log(firstIndex, secondIndex, thirdIndex);
                        }
                    }
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
