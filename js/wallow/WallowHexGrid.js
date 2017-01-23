/* eslint-disable no-unused-vars */
const _ = require('lodash');
const {polarAngleDeg, posMod} = require('js/core/utils/math');

const Y_AXIS_SCALE = Math.sqrt(3) / 2;
const USE_OFFSETS = false;

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

const zz1 = {color: '#806800', points: '-3,3 0,4 6,2 3,1'};
const zz5 = {color: '#806800', points: '-3,-3 0,-4 6,-2 3,-1'};
const zz7 = {color: '#806800', points: '3,-3 -0,-4 -6,-2 -3,-1'};
const zz11 = {color: '#806800', points: '3,3 -0,4 -6,2 -3,1'};

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

const yy3 = {color: '#152260', points: '3,-3 6,-2 6,2 3,1'};
const yy5 = {color: '#152260', points: '6,-2 6,0 0,-2 0,-4'};
const yy9 = {color: '#152260', points: '-3,3 -6,2 -6,-2 -3,-1'};
const yy11 = {color: '#152260', points: '-6,2 -6,0 0,2 0,4'};

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

const xx1 = {color: '#601515', points: '6,2 6,0 0,2 0,4'};
const xx3 = {color: '#601515', points: '3,3 6,2 6,-2 3,-1'};
const xx7 = {color: '#601515', points: '-6,-2 -6,0 0,-2 0,-4'};
const xx9 = {color: '#601515', points: '-3,-3 -6,-2 -6,2 -3,1'};

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

// wa: variant of w with an inscribed small upward triangle
const wa1 = {color: '#00aaaa', points: '0,4 6,2 1.5,0.5 0,2'};
const wa3 = {color: '#00aaaa', points: '6,2 6,-2 3,-1, 1.5,0.5'};
const wa5 = {color: '#00aaaa', points: '6,-2 0,-4 0,-1 3,-1'};
const wa7 = {color: '#00aaaa', points: '0,-4 -6,-2 -3,-1 0,-1'};
const wa9 = {color: '#00aaaa', points: '-6,-2 -6,2 -1.5,0.5 -3,-1'};
const wa11 = {color: '#00aaaa', points: '-6,2 0,4 0,2 -1.5,0.5'};

const wa2 = {color: '#00bb33', points: '0,4 6,2 6,-2 3,-1 0,2'};
const wa6 = {color: '#00bb33', points: '6,-2 0,-4 -6,-2 -3,-1 3,-1'};
const wa10 = {color: '#00bb33', points: '-6,-2 -6,2 0,4 0,2 -3,-1'};
const wa4 = {color: '#00bb33', points: '6,2 6,-2 0,-4 0,-1 3,-1 1.5,0.5'};
const wa8 = {color: '#00bb33', points: '0,-4 -6,-2 -6,2 -1.5,0.5 -3,-1 0,-1'};
const wa12 = {color: '#00bb33', points: '-6,2 0,4 6,2 1.5,0.5 0,2 -1.5,0.5'};

const v0 = {color: '#444444', points: '0,2 3,3 3,1 6,0 3,-1 3,-3 0,-2 -3,-3 -3,-1 -6,0 -3,1 -3,3'};
const v1 = {color: '#444444', points: '3,3 3,-1 -3,-3, -3,1'};
const v3 = {color: '#444444', points: '0,2 6,0 0,-2 -6,0'};
const v5 = {color: '#444444', points: '3,1 3,-3 -3,-1 -3,3'};

const v4 = {color: '#688000', points: '0,0 6,2 6,0 3,-1 3,-3 0,-4'};
const v8 = {color: '#688000', points: '0,0 -6,2 -6,0 -3,-1 -3,-3 0,-4'};
const v12 = {color: '#688000', points: '0,0 6,2 3,3 0,2 -3,3 -6,2'};
const v4x = {color: '#688000', points: '0,0 6,2 6,0 0,-2'};
const v8x = {color: '#688000', points: '0,0 -6,2 -6,0 0,-2'};

const uu1 = {color: '#688000', points: '-3,3 -3,-1 -6,0 -6,2'};
const uu2 = {color: '#688000', points: '-3,3 -3,-1 0,0 0,2'};
const uu3 = {color: '#688000', points: '3,3 3,-1 0,0 0,2'};
const uu4 = {color: '#688000', points: '3,3 3,-1 6,0 6,2'};
const u5 = {color: '#688000', points: '0,2 3,1 3,-1 0,0 -3,-1 -3,1'};
const u6 = {color: '#688000', points: '0,0 3,-1 3,-3 0,-2 -3,-3 -3,-1'};
const u4 = {color: '#688000', points: '0,0 3,1 6,0 3,-1 3,-3 0,-2'};
const u8 = {color: '#688000', points: '0,0 -3,1 -6,0 -3,-1 -3,-3 0,-2'};
const u12 = {color: '#688000', points: '0,0 3,1 3,3 0,2 -3,3 -3,1'};

const a1 = {color: '#550077', points: '0,4 6,-2 -6,-2'};
const a5 = {color: '#770099', points: '0,2 3,-1 -3,-1'};
const a3 = {color: '#550077', points: '0,-4 -6,2 6,2'};
const a7 = {color: '#770099', points: '0,-2 -3,1 3,1'};

const b55 = {color: '#9900BB', points: '0,-1 -1.5,0.5 1.5,0.5'};
const a54 = {color: '#9900BB', points: '3,-1 0,-1 1.5,0.5'};
const a58 = {color: '#9900BB', points: '-3,-1 0,-1 -1.5,0.5'};
const a512 = {color: '#9900BB', points: '0,2 -1.5,0.5 1.5,0.5'};
const a555 = {color: '#BB00DD', points: '0,0.5 0.75,-0.25 -0.75,-0.25'};

const a2 = {color: '#770099', points: '6,2 3,-1 0,2'};
const a6 = {color: '#770099', points: '0,-4 -3,-1 3,-1'};
const a10 = {color: '#770099', points: '-6,2 0,2 -3,-1'};

const a4 = {color: '#770099', points: '6,-2 0,-2 3,1'};
const a8 = {color: '#770099', points: '-6,-2 -3,1 0,-2'};
const a12 = {color: '#770099', points: '0,4 3,1 -3,1'};

const b1 = {color: '#990077', points: '0,2 3,3 3,1'};
const b3 = {color: '#990077', points: '3,1 6,0 3,-1'};
const b5 = {color: '#990077', points: '3,-1 3,-3 0,-2'};
const b7 = {color: '#990077', points: '0,-2 -3,-3 -3,-1'};
const b9 = {color: '#990077', points: '-3,-1 -6,0 -3,1'};
const b11 = {color: '#990077', points: '-3,1 -3,3 0,2'};

const c1 = {color: '#666666', points: '0,2  3,1  3,-1 0,-2 -3,-1 -3,1'};

const c2 = {color: '#666666', points: '3,3 6,2 6,0 3,-1 0,0 0,2'};
const c4 = {color: '#666666', points: '3,1 6,0 6,-2 3,-3 0,-2 0,0'};
const c6 = {color: '#666666', points: '0,0  3,-1  3,-3 0,-4 -3,-3 -3,-1'};
const c8 = {color: '#666666', points: '-3,1  0,0  0,-2 -3,-3 -6,-2 -6,0'};
const c10 = {color: '#666666', points: '-3,3 0,2  0,0 -3,-1 -6,0 -6,2'};
const c12 = {color: '#666666', points: '0,4 3,3  3,1 0,0 -3,1 -3,3'};

const e2 = {color: '#773800', points: '0,4 6,2 6,-2'};
const e6 = {color: '#773800', points: '6,-2 0,-4 -6,-2'};
const e10 = {color: '#773800', points: '-6,-2 -6,2 0,4'};
const e1 = {color: '#AA6622', points: '0,4 6,2 3,1'};
const e3 = {color: '#AA6622', points: '3,1 6,2 6,-2'};
const e5 = {color: '#AA6622', points: '6,-2 0,-4 0,-2'};
const e7 = {color: '#AA6622', points: '0,-2 0,-4 -6,-2'};
const e9 = {color: '#AA6622', points: '-6,-2 -6,2 -3,1'};
const e11 = {color: '#AA6622', points: '-3,1 -6,2 0,4'};

const f4 = {color: '#773800', points: '6,2 6,-2 0,-4'};
const f8 = {color: '#773800', points: '0,-4 -6,-2 -6,2'};
const f12 = {color: '#773800', points: '-6,2 0,4 6,2'};
const f1 = {color: '#AA6622', points: '0,2 0,4 6,2'};
const f3 = {color: '#AA6622', points: '6,2 6,-2 3,-1'};
const f5 = {color: '#AA6622', points: '3,-1 6,-2 0,-4'};
const f7 = {color: '#AA6622', points: '0,-4 -6,-2 -3,-1'};
const f9 = {color: '#AA6622', points: '-3,-1 -6,-2 -6,2'};
const f11 = {color: '#AA6622', points: '-6,2 0,4 0,2'};

const ea2 = {color: '#884810', points: '0,4 0,0 6,-2'};
const ea6 = {color: '#884810', points: '6,-2 0,0 -6,-2'};
const ea10 = {color: '#884810', points: '-6,-2 0,0 0,4'};
const fa4 = {color: '#884810', points: '6,2 0,0 0,-4'};
const fa8 = {color: '#884810', points: '0,-4 0,0 -6,2'};
const fa12 = {color: '#884810', points: '-6,2 0,0 6,2'};

const ef5 = {color: '#BB7733', points: '6,-2 0,-4 2,-2'};
const ef6 = {color: '#BB7733', points: '2,-2 0,-4 -2,-2'};
const ef7 = {color: '#BB7733', points: '-2,-2 0,-4 -6,-2'};

const ff3 = {color: '#BB7733', points: '6,2 6,-2 4,0'};
const ff4 = {color: '#BB7733', points: '4,0 6,-2 2,-2'};
const ff5 = {color: '#BB7733', points: '2,-2 6,-2 0,-4'};
const ff7 = {color: '#BB7733', points: '0,-4 -6,-2 -2,-2'};
const ff8 = {color: '#BB7733', points: '-2,-2 -6,-2 -4,0'};
const ff9 = {color: '#BB7733', points: '-4,0 -6,-2 -6,2'};
const ff11 = {color: '#BB7733', points: '-6,2 0,4 -2,2'};
const ff12 = {color: '#BB7733', points: '-2,2 0,4 2,2'};
const ff1 = {color: '#BB7733', points: '2,2 0,4 6,2'};

const g12 = {color: '#669988', points: '0,4 6,2 3,1 0,2 -3,1 -6,2'};
const g4 = {color: '#669988', points: '3,1 6,2 6,-2 0,-4 0,-2 3,-1'};
const g8 = {color: '#669988', points: '-3,1 -3,-1 0,-2 0,-4 -6,-2 -6,2'};

const g1 = {color: '#88BBAA', points: '0,4 6,2 3,1 0,2'};
const g3 = {color: '#88BBAA', points: '3,1 6,2 6,-2 3,-1'};
const g5 = {color: '#88BBAA', points: '6,-2 0,-4 0,-2 3,-1'};
const g7 = {color: '#88BBAA', points: '-3,-1 0,-2 0,-4 -6,-2'};
const g9 = {color: '#88BBAA', points: '-3,1 -3,-1 -6,-2 -6,2'};
const g11 = {color: '#88BBAA', points: '0,4 0,2 -3,1 -6,2'};

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

const l4 = {color: '#66556A', points: '3,1 6,-2 0,-2 0,0'};
const l8 = {color: '#66556A', points: '-3,1 0,0 0,-2 -6,-2'};
const l12 = {color: '#66556A', points: '0,4 3,1 0,0 -3,1'};
const l2 = {color: '#66556A', points: '0,2 6,2 3,-1 0,0'};
const l6 = {color: '#66556A', points: '0,0 3,-1 0,-4 -3,-1'};
const l10 = {color: '#66556A', points: '0,0 -3,-1 -6,2 0,2'};

const qa0 = {color: '#9900BB', points: '0,0.67 1,-0.33 -1,-0.33'};
const qb0 = {color: '#9900BB', points: '0,1.33 2,-0.67 -2,-0.67'};
const qc0 = a5; // {color: '#770099', points: '0,2 3,-1 -3,-1'};
const qd0 = {color: '#9900BB', points: '0,2.67 4,-1.33 -4,-1.33'};
const qe0 = {color: '#9900BB', points: '0,3.33 5,-1.67 -5,-1.67'};
const qf0 = a1; // {color: '#550077', points: '0,4 6,-2 -6,-2'};

const qa2 = {color: '#993070', points: '0,0.67 6,2 1,-0.33'};
const qb2 = {color: '#993070', points: '0,1.33 6,2 2,-0.67'};
const qc2 = a2; // {color: '#770099', points: '0,2 6,2 3,-1'};
const qd2 = {color: '#993070', points: '0,2.67 6,2 4,-1.33'};
const qe2 = {color: '#993070', points: '0,3.33 6,2 5,-1.67'};
const qf2 = e2; // {color: '#773800', points: '0,4 6,2 6,-2'};

const qa6 = {color: '#993070', points: '1,-0.33 0,-4 -1,-0.33'};
const qb6 = {color: '#993070', points: '2,-0.67 0,-4 -2,-0.67'};
const qc6 = a6; // {color: '#770099', points: '3,-1 0,-4 -3,-1'};
const qd6 = {color: '#993070', points: '4,-1.33 0,-4 -4,-1.33'};
const qe6 = {color: '#993070', points: '5,-1.67 0,-4 -5,-1.67'};
const qf6 = e6; // {color: '#773800', points: '6,-2 0,-4 -6,-2'};

const qa10 = {color: '#993070', points: '0,0.67 -6,2 -1,-0.33'};
const qb10 = {color: '#993070', points: '0,1.33 -6,2 -2,-0.67'};
const qc10 = a10; // {color: '#770099', points: '0,2 -6,2 -3,-1'};
const qd10 = {color: '#993070', points: '0,2.67 -6,2 -4,-1.33'};
const qe10 = {color: '#993070', points: '0,3.33 -6,2 -5,-1.67'};
const qf10 = e10; // {color: '#773800', points: '0,4 -6,2 -6,-2'};

const qa1 = {color: '#88AA55', points: '0,4 6,2 0,0.67'};
const qb1 = {color: '#88AA55', points: '0,4 6,2 0,1.33'};
const qc1 = f1; // {color: '#AA6622', points: '0,4 6,2 0,2'};
const qd1 = {color: '#88AA55', points: '0,4 6,2 0,2.67'};
const qe1 = {color: '#88AA55', points: '0,4 6,2 0,3.33'};

const qa3 = {color: '#88AA55', points: '6,2 6,-2 1,-0.33'};
const qb3 = {color: '#88AA55', points: '6,2 6,-2 2,-0.67'};
const qc3 = f3; // {color: '#AA6622', points: '6,2 6,-2 3,-1'};
const qd3 = {color: '#88AA55', points: '6,2 6,-2 4,-1.33'};
const qe3 = {color: '#88AA55', points: '6,2 6,-2 5,-1.67'};

const qa5 = {color: '#88AA55', points: '6,-2 0,-4 1,-0.33'};
const qb5 = {color: '#88AA55', points: '6,-2 0,-4 2,-0.67'};
const qc5 = f5; // {color: '#AA6622', points: '6,-2 0,-4 3,-1'};
const qd5 = {color: '#88AA55', points: '6,-2 0,-4 4,-1.33'};
const qe5 = {color: '#88AA55', points: '6,-2 0,-4 5,-1.67'};

const qa7 = {color: '#88AA55', points: '-6,-2 0,-4 -1,-0.33'};
const qb7 = {color: '#88AA55', points: '-6,-2 0,-4 -2,-0.67'};
const qc7 = f7; // {color: '#AA6622', points: '-6,-2 0,-4 -3,-1'};
const qd7 = {color: '#88AA55', points: '-6,-2 0,-4 -4,-1.33'};
const qe7 = {color: '#88AA55', points: '-6,-2 0,-4 -5,-1.67'};

const qa9 = {color: '#88AA55', points: '-6,2 -6,-2 -1,-0.33'};
const qb9 = {color: '#88AA55', points: '-6,2 -6,-2 -2,-0.67'};
const qc9 = f9; // {color: '#AA6622', points: '-6,2 -6,-2 -3,-1'};
const qd9 = {color: '#88AA55', points: '-6,2 -6,-2 -4,-1.33'};
const qe9 = {color: '#88AA55', points: '-6,2 -6,-2 -5,-1.67'};

const qa11 = {color: '#88AA55', points: '0,4 -6,2 0,0.67'};
const qb11 = {color: '#88AA55', points: '0,4 -6,2 0,1.33'};
const qc11 = f11; // {color: '#AA6622', points: '0,4 -6,2 0,2'};
const qd11 = {color: '#88AA55', points: '0,4 -6,2 0,2.67'};
const qe11 = {color: '#88AA55', points: '0,4 -6,2 0,3.33'};

const ra2 = {color: '#1166AA', points: '-2,2 6,2 4,0 0,0'};
const ra6 = {color: '#1166AA', points: '0,0 4,0 0,-4 -2,-2'};
const ra10 = {color: '#1166AA', points: '0,0 -2,-2 -6,2 -2,2'};
// rb2,6,10 are l2,6,10
const rc2 = {color: '#1166AA', points: '0,2 6,2 3,-1 0,-1 0,0 1.5,0.5'};
const rc6 = {color: '#1166AA', points: '0,0 0,-1 3,-1 0,-4 -3,-1 -1.5,0.5'};
const rc10 = {color: '#1166AA', points: '0,0 -1.5,0.5 -3,-1 -6,2 0,2 1.5,0.5'};

const sa12 = {color: '#3344BB', points: '-2,2 -6,2 0,4 6,2 4,0 0,0'};
const sa4 = {color: '#3344BB', points: '0,0 4,0 6,2 6,-2 0,-4 -2,-2'};
const sa8 = {color: '#3344BB', points: '0,0 -2,-2 0,-4 -6,-2 -6,2 -2,2'};
const sb12 = {color: '#3344BB', points: '0,2 -6,2 0,4 6,2 3,-1 0,0'};
const sb4 = {color: '#3344BB', points: '0,0 3,-1 6,2 6,-2 0,-4 -3,-1'};
const sb8 = {color: '#3344BB', points: '0,0 -3,-1 0,-4 -6,-2 -6,2 0,2'};
const sc12 = {color: '#3344BB', points: '0,2 -6,2 0,4 6,2 3,-1 0,-1 0,0 1.5,0.5'};
const sc4 = {color: '#3344BB', points: '0,0 0,-1 3,-1 6,2 6,-2 0,-4 -3,-1 -1.5,0.5'};
const sc8 = {color: '#3344BB', points: '0,0 -1.5,0.5 -3,-1 0,-4 -6,-2 -6,2 0,2 1.5,0.5'};

const sa11 = {color: '#4460DD', points: '0,0 -2,2 -6,2 0,4 2,2'};
const sa1 = {color: '#4460DD', points: '0,0 2,2 0,4 6,2 4,0'};
const sa3 = {color: '#4460DD', points: '0,0 4,0 6,2 6,-2 2,-2'};
const sa5 = {color: '#4460DD', points: '0,0 2,-2 6,-2 0,-4 -2,-2'};
const sa7 = {color: '#4460DD', points: '0,0 -2,-2 0,-4 -6,-2 -4,0'};
const sa9 = {color: '#4460DD', points: '0,0 -4,0 -6,-2 -6,2 -2,2'};
const sb11 = {color: '#4460DD', points: '0,0 0,2 -6,2 0,4 3,1'};
const sb1 = {color: '#4460DD', points: '0,0 3,1 0,4 6,2 3,-1'};
const sb3 = {color: '#4460DD', points: '0,0 3,-1 6,2 6,-2 0,-2'};
const sb5 = {color: '#4460DD', points: '0,0 0,-2 6,-2 0,-4 -3,-1'};
const sb7 = {color: '#4460DD', points: '0,0 -3,-1 0,-4 -6,-2 -3,1'};
const sb9 = {color: '#4460DD', points: '0,0 -3,1 -6,-2 -6,2 0,2'};
const sc11 = {color: '#4460DD', points: '0,0 1.5,0.5 0,2 -6,2 0,4 3,1 1.5,-0.5'};
const sc1 = {color: '#4460DD', points: '0,0 1.5,-0.5 3,1 0,4 6,2 3,-1 0,-1'};
const sc3 = {color: '#4460DD', points: '0,0 0,-1 3,-1 6,2 6,-2 0,-2 -1.5,-0.5'};
const sc5 = {color: '#4460DD', points: '0,0 -1.5,-0.5 0,-2 6,-2 0,-4 -3,-1 -1.5,0.5'};
const sc7 = {color: '#4460DD', points: '0,0 -1.5,0.5 -3,-1 0,-4 -6,-2 -3,1 0,1'};
const sc9 = {color: '#4460DD', points: '0,0 0,1 -3,1 -6,-2 -6,2 0,2 1.5,0.5'};

const ta0 = {color: '#22CC88', points: '2,-0.67 .5,-1.17 -1.5,-0.8 -2,0.67 -.5,1.17 1.5,0.83'};
const ta1 = {color: '#11AA66', points: '0,4 6,2 2,-0.67'};
const ta3 = {color: '#11AA66', points: '6,2 6,-2 .5,-1.17'};
const ta5 = {color: '#11AA66', points: '6,-2 0,-4 -1.5,-0.83'};
const ta7 = {color: '#11AA66', points: '-0,-4 -6,-2 -2,0.67'};
const ta9 = {color: '#11AA66', points: '-6,-2 -6,2 -.5,1.17'};
const ta11 = {color: '#11AA66', points: '-6,2 -0,4 1.5,0.83'};

const tb2 = {color: '#11AA66', points: '3,3 6,2 6,0 3,-1'};
const tb4 = {color: '#11AA66', points: '6,0 6,-2 3,-3 0,-2'};
const tb6 = {color: '#11AA66', points: '3,-3 0,-4 -3,-3 -3,-1'};
const tb8 = {color: '#11AA66', points: '-3,-3 -6,-2 -6,0 -3,1'};
const tb10 = {color: '#11AA66', points: '-6,0 -6,2 -3,3 0,2'};
const tb12 = {color: '#11AA66', points: '-3,3 -0,4 3,3 3,1'};

const tc1 = {color: '#11AA66', points: '0,2 6,2 1.5,0.5'};
const tc3 = {color: '#11AA66', points: '3,-1 6,2 1.5,0.5'};
const tc5 = {color: '#11AA66', points: '3,-1 0,-4 0,-1'};
const tc7 = {color: '#11AA66', points: '-3,-1 0,-4 0,-1'};
const tc9 = {color: '#11AA66', points: '-3,-1 -6,2 -1.5,0.5'};
const tc11 = {color: '#11AA66', points: '0,2 -6,2 -1.5,0.5'};

/* eslint-enable no-unused-vars */

const hexGridShapes = [
    {0: [sc1, sc3, sc5, sc7, sc9, sc11], 1: [sc4, sc8, sc12], 2: [f4, f8, f12, rc2, rc6, rc10], 3: [f4, f8, f12, a2, a6, a10, b55, a54, a58, a512, a555], 4: [f1, f3, f5, f7, f9, f11, a2, a6, a10, b55, a54, a58, a512],
     5: [wa2, wa6, wa10, b55, a54, a58, a512], 6: [wa2, wa6, wa10, a5], 7: [x0, y0, z1, a5, h2, h6, h10], 8: [i2, i6, i10, x0, y0, z1, k2, k6, k10, a5], 9: [i2, i6, i10, x0, y0, z1, c1],
     10: [x1, x0, y1, y0, z1, z0, b1, b3, b5, b7, b9, b11, c1], 11: [x1, x0, y1, y0, z1, z0, z4, z5, z6, z7, b1, b5, b7, b11], 12: [x1, y6, x5, y1, x0, y5, x6, y0, z1, z5, z6, z0], 13: [x1, x2, x9, x0, y1, y3, y8, y0, v3], 14: [xx1, yy5, xx7, yy11, v3], 15: [x1, x0, y1, y0, z1, z0, v0]},

    {/**/0: [sb1, sb3, sb5, sb7, sb9, sb11], 1: [sb4, sb8, sb12], 2: [f4, f8, f12, l2, l6, l10], 3: [f4, f8, f12, a2, a6, a10, b55, a54, a58, a512], 4: [wa4, wa8, wa12, b55, a54, a58, a512],
         5: [wa4, wa8, wa12, a5], 6: [wa1, wa3, wa5, wa7, wa9, wa11, a5], 7: [g1, g3, g5, g7, g9, g11, k2, k6, k10, a5], 8: [g1, g3, g5, g7, g9, g11, c1], 9: [g12, g4, g8, c1],
         10: [z1, z2, z3, x8, x9, x0, y8, y9, y0, c1], 11: [x1, x2, y3, y1, x0, x9, y8, y0, z4, z5, z6, z7], 12: [x1, x0, y1, y0, z4, z5, z6, z7, i6, i12], 13: [x1, x0, y1, y0, i6, i12, v3], 14: [xx3, zz5, xx9, zz11, v1]},

    {0: [tb2, tb4, tb6, tb8, tb10, tb12, c1], 1: [sa1, sa3, sa5, sa7, sa9, sa11], 2: [sa4, sa8, sa12], 3: [f4, f8, f12, ra2, ra6, ra10], 4: [f4, f8, f12, a2, a6, a10, a5],
    5: [f4, f8, f12, tc1, tc3, tc5, tc7, tc9, tc11, a5], 6: [e1, e3, e5, e7, e9, e11, a1, a5], 7: [e2, e6, e10, a1, a5], 8: [e2, e6, e10, j4, j8, j12, c1], 9: [e1, e3, e5, e7, e9, e11, j4, j8, j12, c1],
    10: [g12, g4, g8, x4, y4, z7], 11: [z1, z2, z3, x8, y4, x4, y9, z7, x0, x9, y8, y0], 12: [z1, z2, z3, x8, y4, x4, y9, x0, y5, x6, y0, z0], 13: [x1, x0, y1, y0, z5, z6, c6, c12], 14: [x0, y5, x6, y0, z1, z0, uu1, uu2, uu3, uu4], 15: [x8, x0, z0, y9, y0, g12, u5, u6]},

    {/**/0: [ta0, ta1, ta3, ta5, ta7, ta9, ta11], 1: [w1, w3, w5, w7, w9, w11], 2: [qa1, qa3, qa5, qa7, qa9, qa11, qa0, qa2, qa6, qa10], 3: [qb1, qb3, qb5, qb7, qb9, qb11, qb0, qb2, qb6, qb10], 4: [qc1, qc3, qc5, qc7, qc9, qc11, qc0, qc2, qc6, qc10],
         5: [qd1, qd3, qd5, qd7, qd9, qd11, qd0, qd2, qd6, qd10], 6: [qe1, qe3, qe5, qe7, qe9, qe11, qe0, qe2, qe6, qe10], 7: [qf0, qf2, qf6, qf10], 8: [e1, e3, e5, e7, e9, e11, l4, l8, l12], 9: [e1, e3, e5, e7, e9, e11, j4, j8, j12, z4, x7, y7],
         10: [g12, g4, g8, z4, x7, y7], 11: [z1, z2, z3, z4, x8, x7, y7, y9, x0, x9, y8, y0], 12: [v4x, v8x, v12, x0, x9, y8, y0, z1], 13: [v4, v8, v12, x0, y0, z1], 14: [u4, u8, u12, x1, x0, y1, y0, z1, z0]},

    {0: [e2, e6, e10, ea2, ea6, ea10], 1: [w1, w3, e6, e10, ea6, ea10], 2: [w1, w3, e6, ea6, w9, w11], 3: [f1, f3, f5, f7, f9, f11, l2, l6, l10], 4: [f1, f3, f5, f7, f9, f11, a3],
    5: [ff11, ff12, ff1, ff3, ff4, ff5, ff7, ff8, ff9, a2, a6, a10, a5], 6: [e2, e5, f8, f11], 7: [e2, ef5, ef6, ef7, e10, a1], 8: [e2, ef5, ef6, ef7, e10], 9: [e2, e10],
    10: [e2, e6, e10, j4, j8, j12, z4, x7, y7], 11: [e2, e6, e10, j4, j8, j12], 12: [x0, y0, z1], 13: [x0, y0, z1], 14: [x0, y0, z1], 15: [x0, y0, z1]},

    {/**/0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [], 13: [], 14: []},

    {0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [], 13: [], 14: [], 15: []},
];

const hexGridOffsets = [
    {0: '15,-3', 1: '10,-2', 2: '8,-2', 3: '6,-2', 4: '3,-1', 5: '1,-2', 6: '-1,-2', 7: '-1,0', 8: '-1,0', 9: '-2,0', 10: '-1,0', 11: '1,2', 12: '3,3', 13: '7,4', 14: '11,5', 15: '13,7'},

    {/**/0: '12,-5', 1: '8,-3', 2: '6,-3', 3: '3,-3', 4: '2,-3', 5: '1,-3', 6: '0,-2', 7: '-2,0', 8: '-2,0', 9: '-1,0', 10: '0,1', 11: '2,3', 12: '6,7', 13: '9,8', 14: '14,8'},

    {0: '9,-7', 1: '11,-6', 2: '7,-5', 3: '5,-6', 4: '3,-6', 5: '1,-5', 6: '0,-3', 7: '-1,-2', 8: '-2,0', 9: '-1,0', 10: '0,0', 11: '0,4', 12: '3,5', 13: '7,8', 14: '10,9', 15: '15,10'},

    {/**/0: '10,-10', 1: '9,-9', 2: '6,-8', 3: '4,-7', 4: '1,-5', 5: '0,-4', 6: '0,-3', 7: '-4,-2', 8: '-3,0', 9: '-2,2', 10: '0,4', 11: '2,5', 12: '5,7', 13: '8,9', 14: '13,11'},

    {0: '10,-10', 1: '9,-9', 2: '7,-8', 3: '5,-7', 4: '2,-6', 5: '1,-5', 6: '0,-3', 7: '-2,-2', 8: '-3,-1', 9: '-2,1', 10: '-1,3', 11: '1,4', 12: '4,6', 13: '6,8', 14: '10,10', 15: '13,11'},

    {/**/0: '10,-10', 1: '9,-9', 2: '6,-8', 3: '4,-7', 4: '1,-5', 5: '0,-4', 6: '0,-3', 7: '-4,-2', 8: '-3,0', 9: '-2,2', 10: '0,4', 11: '2,5', 12: '5,7', 13: '8,9', 14: '13,11'},

    {0: '10,-10', 1: '9,-9', 2: '7,-8', 3: '5,-7', 4: '2,-6', 5: '1,-5', 6: '0,-3', 7: '-2,-2', 8: '-3,-1', 9: '-2,1', 10: '-1,3', 11: '1,4', 12: '4,6', 13: '6,8', 14: '10,10', 15: '13,11'},
];

const processShapeIfNeeded = function(shape) {
    if (shape.processed) {
        return;
    }

    shape.processed = true;
    const pointsUnscaled = _.filter(shape.points.split(' ')).map(x => x.split(','));
    const points = pointsUnscaled.map(([x, y]) => [x * 1 / 12, -y * 1 / 8 * 4 / 3 * Y_AXIS_SCALE]);
    shape.points = points;

    const centerX = points.map(p => p[0]).reduce((x, xx) => x + xx, 0) / points.length;
    const centerY = points.map(p => p[1]).reduce((x, xx) => x + xx, 0) / points.length;

    const deg = polarAngleDeg(centerX, centerY);
    const yMax = -_.min(points.map(p => p[1]));

    shape.center = [centerX, centerY];
    shape.clockNumber = Math.round(posMod(deg + 90, 360) / 30);
    shape.yMax = yMax;
};

const hexGrid = _.map(hexGridShapes, (row, rowIndex) => _.mapValues(row, (shapes, colIndex) => {

    shapes.forEach(processShapeIfNeeded);

    return {
        shapes: shapes,
        offsets: hexGridOffsets[rowIndex][colIndex].split(',').map(Number).map(x => (USE_OFFSETS ? x / 100 : 0)),
    };
}));

module.exports = hexGrid;
