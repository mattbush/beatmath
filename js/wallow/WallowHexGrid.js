// const _ = require('lodash');

/*
   < z1 >
< z2 >< z3 >
| >< z4 >< |
< z5 >< z6 >
| >< z7 >< |
< z8 >< z9 >
   < z0 >

y
   / || \
/ ||3//6|| \
|1// || //9|
/ ||4//7|| /
|2// || //0|
/ ||5//8|| /
   \ || /

x
 */
const z1 = {color: '#A09000', points: '6,8 9,7 6,6 3,7'};
const z2 = {color: '#A09000', points: '3,7 6,6 3,5 0,6'};
const z3 = {color: '#A09000', points: '9,7 12,6 9,5 6,6'};
const z4 = {color: '#A09000', points: '6,6 9,5 6,4 3,5'};
const z5 = {color: '#A09000', points: '3,5 6,4 3,3 0,4'};
const z6 = {color: '#A09000', points: '9,5 12,4 9,3 6,4'};
const z7 = {color: '#A09000', points: '6,4 9,3 6,2 3,3'};
const z8 = {color: '#A09000', points: '3,3 6,2 3,1 0,2'};
const z9 = {color: '#A09000', points: '9,3 12,2 9,1 6,2'};
const z0 = {color: '#A09000', points: '6,2 9,1 6,0 3,1'};

const y1 = {color: '#203080', points: '0,6 0,4 3,5 3,7'};
const y2 = {color: '#203080', points: '0,4 0,2 3,3 3,5'};
const y3 = {color: '#203080', points: '3,7 3,5 6,6 6,8'};
const y4 = {color: '#203080', points: '3,5 3,3 6,4 6,6'};
const y5 = {color: '#203080', points: '3,3 3,1 6,2 6,4'};
const y6 = {color: '#203080', points: '6,6 6,4 9,5 9,7'};
const y7 = {color: '#203080', points: '6,4 6,2 9,3 9,5'};
const y8 = {color: '#203080', points: '6,2 6,0 9,1 9,3'};
const y9 = {color: '#203080', points: '9,5 9,3 12,4 12,6'};
const y0 = {color: '#203080', points: '9,3 9,1 12,2 12,4'};

const x1 = {color: '#802020', points: '12,6 12,4 9,5 9,7'};
const x2 = {color: '#802020', points: '9,7 9,5 6,6 6,8'};
const x3 = {color: '#802020', points: '12,4 12,2 9,3 9,5'};
const x4 = {color: '#802020', points: '9,5 9,3 6,4 6,6'};
const x5 = {color: '#802020', points: '6,6 6,4 3,5 3,7'};
const x6 = {color: '#802020', points: '9,3 9,1 6,2 6,4'};
const x7 = {color: '#802020', points: '6,4 6,2 3,3 3,5'};
const x8 = {color: '#802020', points: '3,5 3,3 0,4 0,6'};
const x9 = {color: '#802020', points: '6,2 6,0 3,1 3,3'};
const x0 = {color: '#802020', points: '3,3 3,1 0,2 0,4'};

const s1 = {color: '#ff0000', points: '3,4 6,4 6,2'};

const hexGrid = [
    [[], [], [], [], [], [], [], [x0, y0, z1], [x0, y0, z1], [x0, y0, z1], [x1, x0, y1, y0, z1, z0], [x1, x0, y1, y0, z1, z0, z4, z5, z6, z7], [x1, y6, x5, y1, x0, y5, x6, y0, z1, z5, z6, z0], [x1, x2, x9, x0, y1, y3, y8, y0], [], [x1, x0, y1, y0, z1, z0]],

    [/**/[], [], [], [], [], [], [], [], [], [], [z1, z2, z3, x8, x9, x0, y8, y9, y0], [x1, x2, y3, y1, x0, x9, y8, y0, z4, z5, z6, z7], [x1, x0, y1, y0, z4, z5, z6, z7], [x1, x0, y1, y0], []],

    [[], [], [], [], [], [], [], [], [], [], [x4, y4, z7], [z1, z2, z3, x8, y4, x4, y9, z7, x0, x9, y8, y0], [z1, z2, z3, x8, y4, x4, y9, x0, y5, x6, y0, z0], [x1, x0, y1, y0, z5, z6], [x0, y5, x6, y0, z1, z0], [x8, x0, z0, y9, y0]],

    [/**/[], [], [], [], [], [], [], [], [], [z4, x7, y7], [z4, x7, y7], [z1, z2, z3, z4, x8, x7, y7, y9, x0, x9, y8, y0], [x0, x9, y8, y0, z1], [x0, y0, z1], [x1, x0, y1, y0, z1, z0]],

    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],

    [/**/[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],

    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
];

module.exports = hexGrid;
