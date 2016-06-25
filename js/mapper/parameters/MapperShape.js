class MapperShape {
    constructor(index) {
        const offset = index * 50;
        this._vertices = [
            [-350 + offset, -40],
            [-400 + offset, 40],
            [-300 + offset, 40],
        ];
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
}

module.exports = MapperShape;
