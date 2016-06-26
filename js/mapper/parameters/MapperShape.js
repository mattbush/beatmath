class MapperShape {
    constructor({index, existingData}) {
        if (existingData) {
            this._vertices = existingData;
        } else {
            const offset = index * 50;
            this._vertices = [
                [-400 + offset, 40],
                [-350 + offset, -40],
                [-300 + offset, 40],
            ];
        }

        this._centerX = (this._vertices[0][0] + this._vertices[1][0] + this._vertices[2][0]) / 3;
        this._centerY = (this._vertices[0][1] + this._vertices[1][1] + this._vertices[2][1]) / 3;
    }
    moveVertex(vertex, dx, dy) {
        this._vertices[vertex][0] += dx;
        this._vertices[vertex][1] += dy;
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
    serialize() {
        return this._vertices;
    }
    getCenterX() {
        return this._centerX;
    }
    getCenterY() {
        return this._centerY;
    }
}

module.exports = MapperShape;
