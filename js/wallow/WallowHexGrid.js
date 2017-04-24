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

const winn2 = {color: '#00bb33', points: '3,3 6,0 0,0'};
const winn6 = {color: '#00bb33', points: '3,-3 -3,-3 0,0'};
const winn10 = {color: '#00bb33', points: '-3,3 -6,0 0,0'};
const winn4 = {color: '#00bb33', points: '3,-3 6,0 0,0'};
const winn8 = {color: '#00bb33', points: '-3,-3 -6,0 0,0'};
const winn12 = {color: '#00bb33', points: '-3,3 3,3 0,0'};

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

const a3h1 = {color: '#770099', points: '-6,2 6,2 3,-1'};
const a3h7 = {color: '#770099', points: '0,-4 -6,2 3,-1'};
const a3x6 = {color: '#770099', points: '-6,2 6,2 2,-2 -2,-2'};

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

const ag6 = {color: '#BB00DD', points: '0,-4 4,0 -4,0'};
const ag5 = {color: '#BB00DD', points: '0,-4 4,0 6,-2'};
const ag7 = {color: '#BB00DD', points: '0,-4 -4,0 -6,-2'};
const ag12 = {color: '#BB00DD', points: '0,4 4,0 -4,0'};
const ag12a = {color: '#BB00DD', points: '4,0 6,-2 -6,-2 -4,0'};
const ag3 = {color: '#BB00DD', points: '0,4 6,-2 0,-2'};
const ag9 = {color: '#BB00DD', points: '0,4 -6,-2 0,-2'};
const ah3 = {color: '#BB00DD', points: '0,-4 6,2 0,2'};
const ah9 = {color: '#BB00DD', points: '0,-4 -6,2 0,2'};

const b1 = {color: '#990077', points: '0,2 3,3 3,1'};
const b3 = {color: '#990077', points: '3,1 6,0 3,-1'};
const b5 = {color: '#990077', points: '3,-1 3,-3 0,-2'};
const b7 = {color: '#990077', points: '0,-2 -3,-3 -3,-1'};
const b9 = {color: '#990077', points: '-3,-1 -6,0 -3,1'};
const b11 = {color: '#990077', points: '-3,1 -3,3 0,2'};

const c0 = {color: '#666666', points: '0,2 3,1 3,-1 0,-2 -3,-1 -3,1'};
const ca0 = {color: '#666666', points: '2,2 4,0 2,-2 -2,-2 -4,0 -2,2'};
const ca12 = {color: '#666666', points: '2,2 4,0 -4,0 -2,2'};
const ca6 = {color: '#666666', points: '4,0 2,-2 -2,-2 -4,0'};

const cz0 = {color: '#666666', points: '0,4 6,2 6,-2 0,-4 -6,-2 -6,2'};
const czh0 = {color: '#666666', points: '6,2 6,-2 -6,-2 -6,2'};
const czh6 = {color: '#666666', points: '6,0 6,-2 -6,-2 -6,0'};
const czh12 = {color: '#666666', points: '6,2 6,0 -6,0 -6,2'};

const cah6 = {color: '#666666', points: '3,-3 6,0 -6,0 -3,-3'};
const cah12 = {color: '#666666', points: '3,3 6,0 -6,0 -3,3'};

const cc2 = {color: '#999999', points: '1.5,1.5 3,1 3,0 0,0'};
const cc4 = {color: '#999999', points: '3,0 3,-1 1.5,-1.5 0,0'};
const cc6 = {color: '#999999', points: '1.5,-1.5 0,-2 -1.5,-1.5 0,0'};
const cc8 = {color: '#999999', points: '-1.5,-1.5 -3,-1 -3,0 0,0'};
const cc10 = {color: '#999999', points: '-3,0 -3,1 -1.5,1.5 0,0'};
const cc12 = {color: '#999999', points: '-1.5,1.5 0,2 1.5,1.5 0,0'};

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

const ef1 = {color: '#BB7733', points: '2,2 6,2 0,4'};
const ef2 = {color: '#BB7733', points: '4,0 6,2 2,2'};
const ef3 = {color: '#BB7733', points: '6,-2 6,2 4,0'};
const ef5 = {color: '#BB7733', points: '6,-2 0,-4 2,-2'};
const ef6 = {color: '#BB7733', points: '2,-2 0,-4 -2,-2'};
const ef7 = {color: '#BB7733', points: '-2,-2 0,-4 -6,-2'};
const ef9 = {color: '#BB7733', points: '-4,0 -6,2 -6,-2'};
const ef10 = {color: '#BB7733', points: '-2,2 -6,2 -4,0'};
const ef11 = {color: '#BB7733', points: '0,4 -6,2 -2,2'};

const ef1and2 = {color: '#887733', points: '6,2 0,4 4,0'};
const ef10and11 = {color: '#887733', points: '-6,2 0,4 -4,0'};

const ef1230 = {color: '#EE7733', points: '3,3 0,4 2,2'};
const ef130 = {color: '#EE7733', points: '6,2 3,3 2,2'};
const ef230 = {color: '#EE7733', points: '6,0 6,2 4,0'};
const ef330 = {color: '#EE7733', points: '6,0 6,-2 4,0'};
const ef430 = {color: '#EE7733', points: '6,-2 3,-3 2,-2'};
const ef530 = {color: '#EE7733', points: '3,-3 0,-4 2,-2'};
const ef630 = {color: '#EE7733', points: '-2,-2 0,-4 -3,-3'};
const ef730 = {color: '#EE7733', points: '-2,-2 -3,-3 -6,-2'};
const ef830 = {color: '#EE7733', points: '-6,0 -6,-2 -4,0'};
const ef930 = {color: '#EE7733', points: '-6,0 -6,2 -4,0'};
const ef1030 = {color: '#EE7733', points: '-2,2 -3,3 -6,2'};
const ef1130 = {color: '#EE7733', points: '-2,2 0,4 -3,3'};

const ef2and230 = {color: '#EE7733', points: '4,0 6,0 6,2 2,2'};
const ef930and10 = {color: '#EE7733', points: '-4,0 -6,0 -6,2 -2,2'};

const ff3 = {color: '#BB7733', points: '6,2 6,-2 4,0'};
const ff4 = {color: '#BB7733', points: '4,0 6,-2 2,-2'};
const ff5 = {color: '#BB7733', points: '2,-2 6,-2 0,-4'};
const ff7 = {color: '#BB7733', points: '0,-4 -6,-2 -2,-2'};
const ff8 = {color: '#BB7733', points: '-2,-2 -6,-2 -4,0'};
const ff9 = {color: '#BB7733', points: '-4,0 -6,-2 -6,2'};
const ff11 = {color: '#BB7733', points: '-6,2 0,4 -2,2'};
const ff12 = {color: '#BB7733', points: '-2,2 0,4 2,2'};
const ff1 = {color: '#BB7733', points: '2,2 0,4 6,2'};

const ff3and4 = {color: '#BB7733', points: '6,2 6,-2 2,-2'};
const ff8and9 = {color: '#BB7733', points: '-2,-2 -6,-2 -6,2'};

const ef2a = {color: '#CC9911', points: '4,0 0,0 2,2'};
const ef6a = {color: '#CC9911', points: '2,-2 0,0 -2,-2'};
const ef10a = {color: '#CC9911', points: '-2,2 0,0 -4,0'};
const ff4a = {color: '#CC9911', points: '4,0 0,0 2,-2'};
const ff8a = {color: '#CC9911', points: '-2,-2 0,0 -4,0'};
const ff12a = {color: '#CC9911', points: '-2,2 0,0 2,2'};

const e2b = {color: '#CC9911', points: '0,4 6,2 6,-2 4,0 0,0 2,2'};
const e6b = {color: '#CC9911', points: '6,-2 0,-4 -6,-2 -2,-2 0,0 2,-2'};
const e10b = {color: '#CC9911', points: '0,4 -6,2 -6,-2 -4,0 0,0 -2,2'};

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

const icc2 = {color: '#AAAAAA', points: '3,3 6,2 6,0 3,-1 3,0 0,0 1.5,1.5 0,2'};
const icc6 = {color: '#AAAAAA', points: '-1.5,-1.5 0,0 1.5,-1.5 3,-1 3,-3 0,-4 -3,-3 -3,-1'};
const icc10 = {color: '#AAAAAA', points: '-3,3 0,2 -1.5,1.5 0,0 -3,0 -3,-1 -6,0 -6,2'};

const icca2 = {color: '#AAAAAA', points: '3,3 6,2 6,0'};
const icca6 = {color: '#AAAAAA', points: '3,-3 0,-4 -3,-3'};
const icca10 = {color: '#AAAAAA', points: '-3,3 -6,0 -6,2'};
const icca4 = {color: '#AAAAAA', points: '3,-3 6,-2 6,0'};
const icca8 = {color: '#AAAAAA', points: '-3,-3 -6,-0 -6,-2'};
const icca12 = {color: '#AAAAAA', points: '3,3 0,4 -3,3'};

const iccaa2 = {color: '#AAAAAA', points: '3,3 3,1 6,0'};
const iccaa6 = {color: '#AAAAAA', points: '3,-3 0,-2 -3,-3'};
const iccaa10 = {color: '#AAAAAA', points: '-3,3 -6,0 -3,1'};
const iccaa4 = {color: '#AAAAAA', points: '3,-3 3,-1 6,0'};
const iccaa8 = {color: '#AAAAAA', points: '-3,-3 -6,-0 -3,-1'};
const iccaa12 = {color: '#AAAAAA', points: '3,3 0,2 -3,3'};

const iccb2 = {color: '#AAAAAA', points: '3,3 6,0 3,-1 3,0 0,0 1.5,1.5 0,2'};
const iccb6 = {color: '#AAAAAA', points: '-1.5,-1.5 0,0 1.5,-1.5 3,-1 3,-3 -3,-3 -3,-1'};
const iccb10 = {color: '#AAAAAA', points: '-3,3 0,2 -1.5,1.5 0,0 -3,0 -3,-1 -6,0'};

const iccb2sq = {color: '#AAAAAA', points: '3,3 6,0 3,-1 3,0.5 1.5,0.5 2.25,1.25 0,2'};
const iccb6sq = {color: '#AAAAAA', points: '-0.75,-1.75 0,-1 0.75,-1.75 3,-1 3,-3 -3,-3 -3,-1'};
const iccb10sq = {color: '#AAAAAA', points: '-3,3 0,2 -2.25,1.25 -1.5,0.5 -3,0.5 -3,-1 -6,0'};
const cc4sq = {color: '#999999', points: '3,0.5 3,-1 0.75,-1.75 0,-1 1.5,0.5'};
const cc8sq = {color: '#999999', points: '-0.75,-1.75 -3,-1 -3,0.5 -1.5,0.5 0,-1'};
const cc12sq = {color: '#999999', points: '-2.25,1.25 0,2 2.25,1.25 1.5,0.5 -1.5,0.5'};
const cc0sq = {color: '#999999', points: '-1.5,0.5 1.5,0.5 0,-1'};

const isec2 = {color: '#AAAAAA', points: '3,3 6,2 6,0 0,0'};
const isec6 = {color: '#AAAAAA', points: '3,-3 0,-4 -3,-3 0,0'};
const isec10 = {color: '#AAAAAA', points: '-3,3 -6,2 -6,0 0,0'};

const iarr4 = {color: '#CCBB77', points: '3,-3 3,-1 6,0 0,0'};
const iarr8 = {color: '#CCBB77', points: '-3,-3 -3,-1 -6,0 0,0'};
const iarr12 = {color: '#CCBB77', points: '3,3 0,2 -3,3 0,0'};

const iarr130 = {color: '#DDCC88', points: '3,3 3,1 0,0'};
const iarr230 = {color: '#DDCC88', points: '3,1 6,0 0,0'};
const iarr330 = {color: '#DDCC88', points: '3,-1 6,0 0,0'};
const iarr430 = {color: '#DDCC88', points: '3,-3 3,-1 0,0'};
const iarr530 = {color: '#DDCC88', points: '3,-3 0,-2 0,0'};
const iarr630 = {color: '#DDCC88', points: '0,-2 -3,-3 0,0'};
const iarr730 = {color: '#DDCC88', points: '-3,-3 -3,-1 0,0'};
const iarr830 = {color: '#DDCC88', points: '-3,-1 -6,0 0,0'};
const iarr930 = {color: '#DDCC88', points: '-3,1 -6,0 0,0'};
const iarr1030 = {color: '#DDCC88', points: '-3,3 -3,1 0,0'};
const iarr1130 = {color: '#DDCC88', points: '0,2 -3,3 0,0'};
const iarr1230 = {color: '#DDCC88', points: '3,3 0,2 0,0'};

// const cc2 = {color: '#999999', points: '1.5,1.5 3,1 3,0 0,0'};
// const cc6 = {color: '#999999', points: '1.5,-1.5 0,-2 -1.5,-1.5 0,0'};
// const cc10 = {color: '#999999', points: '-3,0 -3,1 -1.5,1.5 0,0'};

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

const hex15 = [icca2, icca4, icca6, icca8, icca10, icca12, iccaa2, iccaa4, iccaa6, iccaa8, iccaa10, iccaa12, iarr130, iarr230, iarr330, iarr430, iarr530, iarr630, iarr730, iarr830, iarr930, iarr1030, iarr1130, iarr1230];

const get = index => (index >= 4 && index <= 11 ? hex15 : []);

const hexGridShapes = [
    _.times(16, get),
    _.times(15, get),
    _.times(16, get),
    _.times(15, get),
    _.times(16, get),
    _.times(15, get),
    _.times(16, get),
];

const hexGridOffsets = [
    {0: '15,-5', 1: '10,-4', 2: '8,-4', 3: '6,-4', 4: '3,-4', 5: '1,-3', 6: '-1,-3', 7: '-1,-1', 8: '-1,-1', 9: '-2,0', 10: '-1,0', 11: '2,0', 12: '5,0', 13: '9,2', 14: '15,3', 15: '19,4'},

    {/**/0: '12,-5', 1: '8,-4', 2: '6,-5', 3: '3,-4', 4: '1,-4', 5: '-0.5,-4', 6: '-2,-2', 7: '-3,-1', 8: '-4,0', 9: '-3,0', 10: '0,1', 11: '2,4', 12: '6,8', 13: '9,9', 14: '14,10'},

    {0: '13,-8', 1: '11,-8', 2: '7,-7', 3: '5,-6', 4: '3,-6', 5: '1,-5', 6: '0,-3', 7: '-2,-2', 8: '-4,0', 9: '-3,1', 10: '-1,2', 11: '0,5', 12: '3,7', 13: '7,9', 14: '11,10', 15: '16,11'},

    {/**/0: '12,-11', 1: '9,-10', 2: '6,-9', 3: '3,-8', 4: '1,-7', 5: '0,-4', 6: '-1,-3', 7: '-4,-2', 8: '-3,0', 9: '-2,2', 10: '0,4', 11: '2,5', 12: '5,8', 13: '9,10', 14: '14,12'},

    {0: '10,-15', 1: '9,-13', 2: '7,-12', 3: '5,-10', 4: '1,-8', 5: '0,-7', 6: '-2,-6', 7: '-3,-4', 8: '-4,-2', 9: '-3,0', 10: '-3,4', 11: '-1,4', 12: '2,7', 13: '6,9', 14: '9,12', 15: '14,15'},

    {/**/0: '10,-14', 1: '9,-12', 2: '6,-12', 3: '4,-11', 4: '1,-9', 5: '0,-6', 6: '-1,-5', 7: '-5,-3', 8: '-4,-1', 9: '-4,1', 10: '-3,4', 11: '-1,7', 12: '2,10', 13: '6,13', 14: '10,15'},

    {0: '10,-15', 1: '9,-15', 2: '6,-15', 3: '4,-15', 4: '1,-13', 5: '0,-11', 6: '-3,-9', 7: '-3,-6', 8: '-5,-3', 9: '-6,0', 10: '-5,3', 11: '-2,6', 12: '-1,9', 13: '1,11', 14: '6,14', 15: '9,18'},
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
    shape.pointsAroundCenter = shape.points.map(([x, y]) => [x - centerX, y - centerY]);
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
