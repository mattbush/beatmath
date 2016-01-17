var {Parameter} = require('js/parameters/Parameter');

class IndexMappingParameter extends Parameter {
    mapValue(mapFn) {
        this._value = mapFn(this._value);
        this._updateListeners();
    }
}

module.exports = IndexMappingParameter;
