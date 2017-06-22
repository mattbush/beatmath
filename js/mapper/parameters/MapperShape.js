const {polarAngleDeg, centerOfPoints} = require('js/core/utils/math');

class MapperShape {
    constructor({index, existingData}) {
        if (existingData) {
            const {vertices, isMask} = existingData;
            this._vertices = vertices;
            this._isMask = isMask;
        } else {
            const offset = index * 50;
            this._vertices = [
                [-350 + offset, -40],
                [-300 + offset, 40],
                [-400 + offset, 40],
            ];
            this._isMask = false;
        }

        this._recalculateCenterAndRotation();
    }
    _recalculateCenterAndRotation() {
        // only valid if not modifying, lol
        [this._centerX, this._centerY] = centerOfPoints(this._vertices);

        this._rotationDeg = polarAngleDeg(
            this._vertices[0][0] - this._centerX,
            this._vertices[0][1] - this._centerY,
        ) + 90;
    }
    moveVertex(vertex, dx, dy) {
        this._vertices[vertex][0] += dx;
        this._vertices[vertex][1] += dy;
        this._recalculateCenterAndRotation();
    }
    addPoint() {
        if (this._vertices.length >= 30) {
            return;
        }
        this._vertices.push([
            (this._vertices[0][0] + this._vertices[this._vertices.length - 1][0]) / 2,
            (this._vertices[0][1] + this._vertices[this._vertices.length - 1][1]) / 2,
        ]);
        this._recalculateCenterAndRotation();
    }
    removePoint() {
        if (this._vertices.length <= 3) {
            return;
        }
        this._vertices.pop();
        this._recalculateCenterAndRotation();
    }
    getPointsString() {
        const pointsArray = this._vertices.map(vertex => {
            return `${vertex[0]},${vertex[1]}`;
        });
        return pointsArray.join(' ');
    }
    getX(vertex) {
        return this._vertices[vertex][0];
    }
    getY(vertex) {
        return this._vertices[vertex][1];
    }
    getNumPoints() {
        return this._vertices.length;
    }
    serialize() {
        return {
            vertices: this._vertices,
            isMask: this._isMask,
        };
    }
    isMask() {
        return this._isMask;
    }
    toggleIsMask() {
        this._isMask = !this._isMask;
    }
    getCenterX() {
        return this._centerX;
    }
    getCenterY() {
        return this._centerY;
    }
    getRotationDeg() {
        return this._rotationDeg;
    }
}

module.exports = MapperShape;
