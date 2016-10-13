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

const h1 = {color: '#00aaaa', points: '6,8 12,6 6,4'};
const h3 = {color: '#00aaaa', points: '12,6 12,2 6,4'};
const h5 = {color: '#00aaaa', points: '12,2 6,0 6,4'};
const h7 = {color: '#00aaaa', points: '6,0 0,2 6,4'};
const h9 = {color: '#00aaaa', points: '0,2 0,6 6,4'};
const h11 = {color: '#00aaaa', points: '0,6 6,8 6,4'};

const h2 = {color: '#00bb33', points: '6,8 12,6 12,2 6,4'};
const h6 = {color: '#00bb33', points: '12,2 6,0 0,2 6,4'};
const h10 = {color: '#00bb33', points: '0,2 0,6 6,8 6,4'};
const h4 = {color: '#00bb33', points: '12,6 12,2 6,0 6,4'};
const h8 = {color: '#00bb33', points: '6,0 0,2 0,6 6,4'};
const h12 = {color: '#00bb33', points: '0,6 6,8 12,6 6,4'};

const a1 = {color: '#550077', points: '6,8 12,2 0,2'};
const a5 = {color: '#770099', points: '6,6 9,3 3,3'};
const a3 = {color: '#550077', points: '6,0 0,6 12,6'};
const a7 = {color: '#770099', points: '6,2 3,5 9,5'};

const a2 = {color: '#770099', points: '12,6 9,3 6,6'};
const a6 = {color: '#770099', points: '6,0 3,3 9,3'};
const a10 = {color: '#770099', points: '0,6 6,6 3,3'};

const a4 = {color: '#770099', points: '12,2 6,2 9,5'};
const a8 = {color: '#770099', points: '0,2 3,5 6,2'};
const a12 = {color: '#770099', points: '6,8 9,5 3,5'};

const c1 = {color: '#666666', points: '6,6 9,5 9,3 6,2 3,3 3,5'};

const hexGrid = [
    [[], [], [a3], [a3, a5], [h2, h6, h10, a3, a5], [h2, h6, h10, a5], [h2, h6, h10, a5], [x0, y0, z1, a5], [x0, y0, z1, c1, a5], [x0, y0, z1, c1], [x1, x0, y1, y0, z1, z0, c1], [x1, x0, y1, y0, z1, z0, z4, z5, z6, z7], [x1, y6, x5, y1, x0, y5, x6, y0, z1, z5, z6, z0], [x1, x2, x9, x0, y1, y3, y8, y0], [], [x1, x0, y1, y0, z1, z0]],

    [/**/[], [], [a3], [a3, a5], [h4, h8, h12, a5], [h4, h8, h12, a5], [h1, h3, h5, h7, h9, h11, a5], [h1, h3, h5, h7, h9, h11, c1, a5], [h1, h3, h5, h7, h9, h11, c1], [h4, h8, h12, c1], [z1, z2, z3, x8, x9, x0, y8, y9, y0, c1], [x1, x2, y3, y1, x0, x9, y8, y0, z4, z5, z6, z7], [x1, x0, y1, y0, z4, z5, z6, z7], [x1, x0, y1, y0], []],

    [[], [], [], [a3], [a3, a5], [a3, a5], [h4, h8, h12, a1, a5], [a1, a5], [a1, c1], [h4, h8, h12, a1, c1], [h4, h8, h12, x4, y4, z7], [z1, z2, z3, x8, y4, x4, y9, z7, x0, x9, y8, y0], [z1, z2, z3, x8, y4, x4, y9, x0, y5, x6, y0, z0], [x1, x0, y1, y0, z5, z6], [x0, y5, x6, y0, z1, z0], [x8, x0, z0, y9, y0]],

    [/**/[], [h1, h3, h5, h7, h9, h11], [h1, h3, h5, h7, h9, h11], [h1, h3, h5, h7, h9, h11], [h1, h3, h5, h7, h9, h11, a3, a5], [h1, h3, h5, h7, h9, h11], [h1, h3, h5, h7, h9, h11], [a1], [a1], [h4, h8, h12, a1, z4, x7, y7], [h4, h8, h12, z4, x7, y7], [z1, z2, z3, z4, x8, x7, y7, y9, x0, x9, y8, y0], [h4, h8, h12, x0, x9, y8, y0, z1], [h4, h8, h12, x0, y0, z1], [h4, h8, h12, x1, x0, y1, y0, z1, z0]],

    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],

    [/**/[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],

    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
];

module.exports = hexGrid;
