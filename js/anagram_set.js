var _ = require('underscore');

class AnagramSet {
    constructor(anagrams) {
        this._originalAnagrams = anagrams;
        this._anagramLetterOffsets = [];
        this._isValid = true;
        _.each(anagrams, (anagram, index) => {
            anagram = anagram.toUpperCase();
            if (index === 0) {
                this._sortedLetters = this._getSortedLettersFromAnagram(anagram);
            } else {
                var sortedLetters = this._getSortedLettersFromAnagram(anagram);
                if (sortedLetters !== this._sortedLetters) {
                    this._isValid = false;
                    return; // continue
                }
            }
            this._anagramLetterOffsets.push(this._getAnagramLetterOffsets(anagram));
        });
    }
    _getSortedLettersFromAnagram(anagramString) {
        return anagramString.replace(/\s/g, '').split('').sort().join('');
    }
    _getAnagramLetterOffsets(anagramString) {
        var prev;
        var lastIndexOfOriginal = -1;
        return _.map(this._sortedLetters.split(''), char => {
            if (char !== prev) {
                prev = char;
                lastIndexOfOriginal = -1;
            }
            lastIndexOfOriginal = anagramString.indexOf(char, lastIndexOfOriginal + 1);
            return lastIndexOfOriginal;
        });
    }
    isValid() {
        return this._isValid;
    }
    getLetterCount() {
        return this._sortedLetters.length;
    }
    getAnagramCount() {
        return this._anagramLetterOffsets.length;
    }
    getLetterAtLetterIndex(letterIndex) {
        return this._sortedLetters[letterIndex];
    }
    getLengthOfAnagram(anagramIndex) {
        return this._originalAnagrams[anagramIndex].length;
    }
    getLetterOffsetForAnagram(anagramIndex, letterIndex) {
        return this._anagramLetterOffsets[anagramIndex][letterIndex];
    }
}

module.exports = AnagramSet;
