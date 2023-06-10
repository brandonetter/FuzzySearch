
const exp = require('constants');
const { searchWords, searchWordsOrdered } = require('./dist/search');

let words = ['hello', 'world', 'foo', 'bar', 'baz'];

test('searchWords function exists', () => {
    expect(searchWords).toBeDefined();
}
);

test('searchWords returns an array', () => {
    expect(Array.isArray(searchWords('hello', words, 1))).toBe(true);
}
);

test('searchWords returns an empty array if no matches found', () => {
    expect(searchWords('b', words, 0)).toEqual(['bar', 'baz']);
    expect(searchWords('x', words, 1)).toEqual([]);
}
);

test('searchWords returns partial matches on words', () => {
    expect(searchWords('he', words, 2)).toEqual(['hello']);
    expect(searchWords('hel', words, 2)).toEqual(['hello']);
    expect(searchWords('hell', words, 2)).toEqual(['hello']);
    expect(searchWords('hello', words, 2)).toEqual(['hello']);
}
);

let states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
    'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
    'West Virginia', 'Wisconsin', 'Wyoming'
];


test('searchWords returns partial matches on states', () => {
    expect(searchWords('al', states, 0)).toEqual(['Alabama', 'Alaska']);
    expect(searchWords('ala', states, 1)).toEqual(['Alabama', 'Alaska']);
    expect(searchWords('alas', states, 1)).toEqual(['Alaska']);
    expect(searchWords('alaska', states, 1)).toEqual(['Alaska']);
    expect(searchWords('new', states, 2)).toEqual(['New Hampshire', 'New Jersey', 'New Mexico', 'New York']);
}
);

test('searchWords returns fuzzy matches', () => {
    expect(searchWords('alsk', states, 3)).toEqual(['Alaska']);
    expect(searchWords('misour', states, 3)).toEqual(['Missouri']);
    expect(searchWords('Jersey', states, 4)).toEqual(['New Jersey']);
}
);

test('searchWords returns partial matches on states using JaroWinkler', () => {
    let fuzz = 0.8;
    expect(searchWords('al', states, fuzz, "jaro-winkler")).toEqual(['Alabama', 'Alaska']);
    expect(searchWords('ala', states, fuzz, "jaro-winkler")).toEqual(['Alabama', 'Alaska']);
    expect(searchWords('alas', states, fuzz, "jaro-winkler")).toEqual(['Alaska']);
    expect(searchWords('alaska', states, fuzz, "jaro-winkler")).toEqual(['Alaska']);
    expect(searchWords('new', states, fuzz, "jaro-winkler")).toEqual(['New Hampshire', 'New Jersey', 'New Mexico', 'New York']);
}
);

test('searchWords returns fuzzy matches using JaroWinker', () => {
    let fuzz = 0.8;
    expect(searchWords('alsk', states, fuzz, "jaro-winkler")).toEqual(['Alaska']);
    expect(searchWords('misour', states, fuzz, "jaro-winkler")).toEqual(['Missouri']);

}
);
test('searchWords returns loose matches on states using JaroWinkler', () => {
    let fuzz = 0.75;
    expect(searchWords('i', states, fuzz, "jaro-winkler")).toEqual(['Idaho', 'Illinois', 'Indiana', 'Iowa']);
    expect(searchWords('or', states, fuzz, "jaro-winkler").length).toBeGreaterThan(3);
}
);
