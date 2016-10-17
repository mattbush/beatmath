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
const z1 = {color: '#A09000', points: '0,4 3,3 0,2 -3,3'};
const z2 = {color: '#A09000', points: '-3,3 0,2 -3,1 -6,2'};
const z3 = {color: '#A09000', points: '3,3 6,2 3,1 0,2'};
const z4 = {color: '#A09000', points: '0,2 3,1 0,0 -3,1'};
const z5 = {color: '#A09000', points: '-3,1 0,0 -3,-1 -6,0'};
const z6 = {color: '#A09000', points: '3,1 6,0 3,-1 0,0'};
const z7 = {color: '#A09000', points: '0,0 3,-1 0,-2 -3,-1'};
const z8 = {color: '#A09000', points: '-3,-1 0,-2 -3,-3 -6,-2'};
const z9 = {color: '#A09000', points: '3,-1 6,-2 3,-3 0,-2'};
const z0 = {color: '#A09000', points: '0,-2 3,-3 0,-4 -3,-3'};

const y1 = {color: '#203080', points: '-6,2 -6,0 -3,1 -3,3'};
const y2 = {color: '#203080', points: '-6,0 -6,-2 -3,-1 -3,1'};
const y3 = {color: '#203080', points: '-3,3 -3,1 0,2 0,4'};
const y4 = {color: '#203080', points: '-3,1 -3,-1 0,0 0,2'};
const y5 = {color: '#203080', points: '-3,-1 -3,-3 0,-2 0,0'};
const y6 = {color: '#203080', points: '0,2 0,0 3,1 3,3'};
const y7 = {color: '#203080', points: '0,0 0,-2 3,-1 3,1'};
const y8 = {color: '#203080', points: '0,-2 0,-4 3,-3 3,-1'};
const y9 = {color: '#203080', points: '3,1 3,-1 6,0 6,2'};
const y0 = {color: '#203080', points: '3,-1 3,-3 6,-2 6,0'};

const x1 = {color: '#802020', points: '6,2 6,0 3,1 3,3'};
const x2 = {color: '#802020', points: '3,3 3,1 0,2 0,4'};
const x3 = {color: '#802020', points: '6,0 6,-2 3,-1 3,1'};
const x4 = {color: '#802020', points: '3,1 3,-1 0,0 0,2'};
const x5 = {color: '#802020', points: '0,2 0,0 -3,1 -3,3'};
const x6 = {color: '#802020', points: '3,-1 3,-3 0,-2 0,0'};
const x7 = {color: '#802020', points: '0,0 0,-2 -3,-1 -3,1'};
const x8 = {color: '#802020', points: '-3,1 -3,-1 -6,0 -6,2'};
const x9 = {color: '#802020', points: '0,-2 0,-4 -3,-3 -3,-1'};
const x0 = {color: '#802020', points: '-3,-1 -3,-3 -6,-2 -6,0'};

const w1 = {color: '#00aaaa', points: '0,4 6,2 0,0'};
const w3 = {color: '#00aaaa', points: '6,2 6,-2 0,0'};
const w5 = {color: '#00aaaa', points: '6,-2 0,-4 0,0'};
const w7 = {color: '#00aaaa', points: '0,-4 -6,-2 0,0'};
const w9 = {color: '#00aaaa', points: '-6,-2 -6,2 0,0'};
const w11 = {color: '#00aaaa', points: '-6,2 0,4 0,0'};

const w2 = {color: '#00bb33', points: '0,4 6,2 6,-2 0,0'};
const w6 = {color: '#00bb33', points: '6,-2 0,-4 -6,-2 0,0'};
const w10 = {color: '#00bb33', points: '-6,-2 -6,2 0,4 0,0'};
const w4 = {color: '#00bb33', points: '6,2 6,-2 0,-4 0,0'};
const w8 = {color: '#00bb33', points: '0,-4 -6,-2 -6,2 0,0'};
const w12 = {color: '#00bb33', points: '-6,2 0,4 6,2 0,0'};

const a1 = {color: '#550077', points: '0,4 6,-2 -6,-2'};
const a5 = {color: '#770099', points: '0,2 3,-1 -3,-1'};
const a3 = {color: '#550077', points: '0,-4 -6,2 6,2'};
const a7 = {color: '#770099', points: '0,-2 -3,1 3,1'};

const a2 = {color: '#770099', points: '6,2 3,-1 0,2'};
const a6 = {color: '#770099', points: '0,-4 -3,-1 3,-1'};
const a10 = {color: '#770099', points: '-6,2 0,2 -3,-1'};

const a4 = {color: '#770099', points: '6,-2 0,-2 3,1'};
const a8 = {color: '#770099', points: '-6,-2 -3,1 0,-2'};
const a12 = {color: '#770099', points: '0,4 3,1 -3,1'};

const c1 = {color: '#666666', points: '0,2  3,1  3,-1 0,-2 -3,-1 -3,1'};

const c2 = {color: '#666666', points: '3,3 6,2 6,0 3,-1 0,0 0,2'};
const c4 = {color: '#666666', points: '3,1 6,0 6,-2 3,-3 0,-2 0,0'};
const c6 = {color: '#666666', points: '0,0  3,-1  3,-3 0,-4 -3,-3 -3,-1'};
const c8 = {color: '#666666', points: '-3,1  0,0  0,-2 -3,-3 -6,-2 -6,0'};
const c10 = {color: '#666666', points: '-3,3 0,2  0,0 -3,-1 -6,0 -6,2'};
const c12 = {color: '#666666', points: '0,4 3,3  3,1 0,0 -3,1 -3,3'};

const g12 = {color: '#888888', points: '0,4 6,2  3,1 0,2 -3,1 -6,2'};

const h2 = {color: '#888888', points: '3,3 6,2 6,0 3,-1 0,2'};
const h4 = {color: '#888888', points: '3,1 6,0 6,-2 3,-3 0,-2'};
const h6 = {color: '#888888', points: '3,-1 3,-3 0,-4 -3,-3 -3,-1'};
const h8 = {color: '#888888', points: '-3,1 0,-2 -3,-3 -6,-2 -6,0'};
const h10 = {color: '#888888', points: '-3,3 0,2 -3,-1 -6,0 -6,2'};
const h12 = {color: '#888888', points: '0,4 3,3 3,1 -3,1 -3,3'};

const i2 = {color: '#888888', points: '3,3 6,2 6,0 3,-1 3,1 0,2'};
const i4 = {color: '#888888', points: '3,1 6,0 6,-2 3,-3 0,-2 3,-1'};
const i6 = {color: '#888888', points: '0,-2  3,-1  3,-3 0,-4 -3,-3 -3,-1'};
const i8 = {color: '#888888', points: '-3,1  -3,-1  0,-2 -3,-3 -6,-2 -6,0'};
const i10 = {color: '#888888', points: '-3,3 0,2  -3,1 -3,-1 -6,0 -6,2'};
const i12 = {color: '#888888', points: '0,4 3,3  3,1 0,2 -3,1 -3,3'};

const j4 = {color: '#AAAAAA', points: '3,1 6,-2 0,-2 3,-1'};
const j8 = {color: '#AAAAAA', points: '-3,1  -3,-1 0,-2 -6,-2'};
const j12 = {color: '#AAAAAA', points: '0,4 3,1 0,2 -3,1'};

const k2 = {color: '#AAAAAA', points: '3,-1 3,1 0,2'};
const k6 = {color: '#AAAAAA', points: '0,-2  3,-1 -3,-1'};
const k10 = {color: '#AAAAAA', points: '0,2 -3,1 -3,-1'};


const hexGrid = [
    {0: [], 1: [], 2: [a3], 3: [a2, a6, a10, a5], 4: [w2, w6, w10, a2, a6, a10, a5],
     5: [w2, w6, w10, a5], 6: [w2, w6, w10, a5], 7: [x0, y0, z1, a5, h2, h6, h10], 8: [i2, i6, i10, x0, y0, z1, k2, k6, k10, a5], 9: [i2, i6, i10, x0, y0, z1, c1], 10: [x1, x0, y1, y0, z1, z0, c1], 11: [x1, x0, y1, y0, z1, z0, z4, z5, z6, z7], 12: [x1, y6, x5, y1, x0, y5, x6, y0, z1, z5, z6, z0], 13: [x1, x2, x9, x0, y1, y3, y8, y0], 14: [], 15: [x1, x0, y1, y0, z1, z0]},

    {/**/0: [], 1: [], 2: [a3], 3: [a2, a6, a10, a5], 4: [w4, w8, w12, a5],
         5: [w4, w8, w12, a5], 6: [w1, w3, w5, w7, w9, w11, a5], 7: [w1, w3, w5, w7, w9, w11, k2, k6, k10, a5], 8: [w1, w3, w5, w7, w9, w11, c1], 9: [w4, w8, w12, c1],
         10: [z1, z2, z3, x8, x9, x0, y8, y9, y0, c1], 11: [x1, x2, y3, y1, x0, x9, y8, y0, z4, z5, z6, z7], 12: [x1, x0, y1, y0, z4, z5, z6, z7, i6, i12], 13: [x1, x0, y1, y0, i6, i12], 14: []},

    {0: [], 1: [], 2: [], 3: [a3], 4: [a2, a6, a10, a5],
    5: [a2, a6, a10, a5], 6: [w4, w8, w12, a1, a5], 7: [a1, a5], 8: [j4, j8, j12, c1], 9: [w4, w8, w12, j4, j8, j12, c1],
    10: [w4, w8, w12, x4, y4, z7], 11: [z1, z2, z3, x8, y4, x4, y9, z7, x0, x9, y8, y0], 12: [z1, z2, z3, x8, y4, x4, y9, x0, y5, x6, y0, z0], 13: [x1, x0, y1, y0, z5, z6, c6, c12], 14: [x0, y5, x6, y0, z1, z0], 15: [x8, x0, z0, y9, y0, g12]},

    {/**/0: [], 1: [w1, w3, w5, w7, w9, w11], 2: [w1, w3, w5, w7, w9, w11], 3: [w1, w3, w5, w7, w9, w11], 4: [w1, w3, w5, w7, w9, w11, a2, a6, a10, a5],
         5: [w1, w3, w5, w7, w9, w11], 6: [w1, w3, w5, w7, w9, w11], 7: [a1], 8: [a1], 9: [w4, w8, w12, a1, z4, x7, y7],
         10: [w4, w8, w12, z4, x7, y7], 11: [z1, z2, z3, z4, x8, x7, y7, y9, x0, x9, y8, y0], 12: [w4, w8, w12, x0, x9, y8, y0, z1], 13: [w4, w8, w12, x0, y0, z1], 14: [w4, w8, w12, x1, x0, y1, y0, z1, z0]},

    {0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [], 13: [], 14: [], 15: []},

    {/**/0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [], 13: [], 14: []},

    {0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [], 13: [], 14: [], 15: []},
];

module.exports = hexGrid;
