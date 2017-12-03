/* eslint-disable no-unused-vars */
const _ = require('lodash');
const {polarAngleDeg, posMod, xyRotatedAroundOriginWithAngle, lerp} = require('js/core/utils/math');

const Y_AXIS_SCALE = Math.sqrt(3) / 2;
const USE_OFFSETS = true;

const CYAN = 0;
const PINK = 1;
const RED = 2;
const ORANGE = 3;

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
const z1 = {name: 'z1', color: '#A09000', points: '0,4 3,3 0,2 -3,3'};
const z2 = {name: 'z2', color: '#A09000', points: '-3,3 0,2 -3,1 -6,2'};
const z3 = {name: 'z3', color: '#A09000', points: '3,3 6,2 3,1 0,2'};
const z4 = {name: 'z4', color: '#A09000', points: '0,2 3,1 0,0 -3,1'};
const z5 = {name: 'z5', color: '#A09000', points: '-3,1 0,0 -3,-1 -6,0'};
const z6 = {name: 'z6', color: '#A09000', points: '3,1 6,0 3,-1 0,0'};
const z7 = {name: 'z7', color: '#A09000', points: '0,0 3,-1 0,-2 -3,-1'};
const z8 = {name: 'z8', color: '#A09000', points: '-3,-1 0,-2 -3,-3 -6,-2'};
const z9 = {name: 'z9', color: '#A09000', points: '3,-1 6,-2 3,-3 0,-2'};
const z0 = {name: 'z0', color: '#A09000', points: '0,-2 3,-3 0,-4 -3,-3'};

const zz1 = {name: 'zz1', color: '#806800', points: '-3,3 0,4 6,2 3,1'};
const zz5 = {name: 'zz5', color: '#806800', points: '-3,-3 0,-4 6,-2 3,-1'};
const zz7 = {name: 'zz7', color: '#806800', points: '3,-3 -0,-4 -6,-2 -3,-1'};
const zz11 = {name: 'zz11', color: '#806800', points: '3,3 -0,4 -6,2 -3,1'};

const y1 = {name: 'y1', color: '#203080', points: '-6,2 -6,0 -3,1 -3,3'};
const y2 = {name: 'y2', color: '#203080', points: '-6,0 -6,-2 -3,-1 -3,1'};
const y3 = {name: 'y3', color: '#203080', points: '-3,3 -3,1 0,2 0,4'};
const y4 = {name: 'y4', color: '#203080', points: '-3,1 -3,-1 0,0 0,2'};
const y5 = {name: 'y5', color: '#203080', points: '-3,-1 -3,-3 0,-2 0,0'};
const y6 = {name: 'y6', color: '#203080', points: '0,2 0,0 3,1 3,3'};
const y7 = {name: 'y7', color: '#203080', points: '0,0 0,-2 3,-1 3,1'};
const y8 = {name: 'y8', color: '#203080', points: '0,-2 0,-4 3,-3 3,-1'};
const y9 = {name: 'y9', color: '#203080', points: '3,1 3,-1 6,0 6,2'};
const y0 = {name: 'y0', color: '#203080', points: '3,-1 3,-3 6,-2 6,0'};

const yy3 = {name: 'yy3', color: '#152260', points: '3,-3 6,-2 6,2 3,1'};
const yy5 = {name: 'yy5', color: '#152260', points: '6,-2 6,0 0,-2 0,-4'};
const yy9 = {name: 'yy9', color: '#152260', points: '-3,3 -6,2 -6,-2 -3,-1'};
const yy11 = {name: 'yy11', color: '#152260', points: '-6,2 -6,0 0,2 0,4'};
const yy90 = {name: 'yy90', color: '#152260', points: '-3,-3 0,-2 0,2 -3,1'};

const x1 = {name: 'x1', color: '#802020', points: '6,2 6,0 3,1 3,3'};
const x2 = {name: 'x2', color: '#802020', points: '3,3 3,1 0,2 0,4'};
const x3 = {name: 'x3', color: '#802020', points: '6,0 6,-2 3,-1 3,1'};
const x4 = {name: 'x4', color: '#802020', points: '3,1 3,-1 0,0 0,2'};
const x5 = {name: 'x5', color: '#802020', points: '0,2 0,0 -3,1 -3,3'};
const x6 = {name: 'x6', color: '#802020', points: '3,-1 3,-3 0,-2 0,0'};
const x7 = {name: 'x7', color: '#802020', points: '0,0 0,-2 -3,-1 -3,1'};
const x8 = {name: 'x8', color: '#802020', points: '-3,1 -3,-1 -6,0 -6,2'};
const x9 = {name: 'x9', color: '#802020', points: '0,-2 0,-4 -3,-3 -3,-1'};
const x0 = {name: 'x0', color: '#802020', points: '-3,-1 -3,-3 -6,-2 -6,0'};

const xx1 = {name: 'xx1', color: '#601515', points: '6,2 6,0 0,2 0,4'};
const xx3 = {name: 'xx3', color: '#601515', points: '3,3 6,2 6,-2 3,-1'};
const xx7 = {name: 'xx7', color: '#601515', points: '-6,-2 -6,0 0,-2 0,-4'};
const xx9 = {name: 'xx9', color: '#601515', points: '-3,-3 -6,-2 -6,2 -3,1'};
const xx30 = {name: 'xx30', color: '#601515', points: '3,-3 0,-2 0,2 3,1'};

const w1 = {name: 'w1', color: '#00aaaa', points: '0,4 6,2 0,0'};
const w3 = {name: 'w3', color: '#00aaaa', points: '6,2 6,-2 0,0'};
const w5 = {name: 'w5', color: '#00aaaa', points: '6,-2 0,-4 0,0'};
const w7 = {name: 'w7', color: '#00aaaa', points: '0,-4 -6,-2 0,0'};
const w9 = {name: 'w9', color: '#00aaaa', points: '-6,-2 -6,2 0,0'};
const w11 = {name: 'w11', color: '#00aaaa', points: '-6,2 0,4 0,0'};

const w2 = {name: 'w2', color: '#00bb33', points: '0,4 6,2 6,-2 0,0'};
const w6 = {name: 'w6', color: '#00bb33', points: '6,-2 0,-4 -6,-2 0,0'};
const w10 = {name: 'w10', color: '#00bb33', points: '-6,-2 -6,2 0,4 0,0'};
const w4 = {name: 'w4', color: '#00bb33', points: '6,2 6,-2 0,-4 0,0'};
const w8 = {name: 'w8', color: '#00bb33', points: '0,-4 -6,-2 -6,2 0,0'};
const w12 = {name: 'w12', color: '#00bb33', points: '-6,2 0,4 6,2 0,0'};

const w130 = {name: 'w130', color: '#00cc66', points: '0,0 3,3 6,2'};
const w230 = {name: 'w230', color: '#00cc66', points: '0,0 6,2 6,0'};
const w330 = {name: 'w330', color: '#00cc66', points: '0,0 6,0 6,-2'};
const w430 = {name: 'w430', color: '#00cc66', points: '0,0 6,-2 3,-3'};

const winn2 = {name: 'winn2', color: '#00bb33', points: '3,3 6,0 0,0'};
const winn6 = {name: 'winn6', color: '#00bb33', points: '3,-3 -3,-3 0,0'};
const winn10 = {name: 'winn10', color: '#00bb33', points: '-3,3 -6,0 0,0'};
const winn4 = {name: 'winn4', color: '#00bb33', points: '3,-3 6,0 0,0'};
const winn8 = {name: 'winn8', color: '#00bb33', points: '-3,-3 -6,0 0,0'};
const winn12 = {name: 'winn12', color: '#00bb33', points: '-3,3 3,3 0,0'};

const winn24 = {name: 'winn24', color: '#00992b', points: '3,3 6,0 3,-3 0,0'};
const winn24o = {name: 'winn24o', color: '#00992b', points: '3,3 6,0 3,-3'};
const winn24i = {name: 'winn24i', color: '#00992b', points: '3,3 3,-3 0,0'};
const winn810 = {name: 'winn810', color: '#00992b', points: '-3,3 -6,0 -3,-3 0,0'};
const winn810o = {name: 'winn810o', color: '#00992b', points: '-3,3 -6,0 -3,-3'};
const winn810i = {name: 'winn810i', color: '#00992b', points: '-3,3 -3,-3 0,0'};

// wa: variant of w with an inscribed small upward triangle
const wa1 = {name: 'wa1', color: '#00aaaa', points: '0,4 6,2 1.5,0.5 0,2'};
const wa3 = {name: 'wa3', color: '#00aaaa', points: '6,2 6,-2 3,-1, 1.5,0.5'};
const wa5 = {name: 'wa5', color: '#00aaaa', points: '6,-2 0,-4 0,-1 3,-1'};
const wa7 = {name: 'wa7', color: '#00aaaa', points: '0,-4 -6,-2 -3,-1 0,-1'};
const wa9 = {name: 'wa9', color: '#00aaaa', points: '-6,-2 -6,2 -1.5,0.5 -3,-1'};
const wa11 = {name: 'wa11', color: '#00aaaa', points: '-6,2 0,4 0,2 -1.5,0.5'};

const wa2 = {name: 'wa2', color: '#00bb33', points: '0,4 6,2 6,-2 3,-1 0,2'};
const wa6 = {name: 'wa6', color: '#00bb33', points: '6,-2 0,-4 -6,-2 -3,-1 3,-1'};
const wa10 = {name: 'wa10', color: '#00bb33', points: '-6,-2 -6,2 0,4 0,2 -3,-1'};
const wa4 = {name: 'wa4', color: '#00bb33', points: '6,2 6,-2 0,-4 0,-1 3,-1 1.5,0.5'};
const wa8 = {name: 'wa8', color: '#00bb33', points: '0,-4 -6,-2 -6,2 -1.5,0.5 -3,-1 0,-1'};
const wa12 = {name: 'wa12', color: '#00bb33', points: '-6,2 0,4 6,2 1.5,0.5 0,2 -1.5,0.5'};

const h6wa6 = {name: 'h6wa6', color: '#44a060', points: '3,-1 3,-3 0,-4 -6,-2 -3,-1'};

const v0 = {name: 'v0', color: '#444444', points: '0,2 3,3 3,1 6,0 3,-1 3,-3 0,-2 -3,-3 -3,-1 -6,0 -3,1 -3,3'};
const v1 = {name: 'v1', color: '#444444', points: '3,3 3,-1 -3,-3, -3,1'};
const v3 = {name: 'v3', color: '#444444', points: '0,2 6,0 0,-2 -6,0'};
const v5 = {name: 'v5', color: '#444444', points: '3,1 3,-3 -3,-1 -3,3'};

const v4 = {name: 'v4', color: '#688000', points: '0,0 6,2 6,0 3,-1 3,-3 0,-4'};
const v8 = {name: 'v8', color: '#688000', points: '0,0 -6,2 -6,0 -3,-1 -3,-3 0,-4'};
const v12 = {name: 'v12', color: '#688000', points: '0,0 6,2 3,3 0,2 -3,3 -6,2'};
const v4x = {name: 'v4x', color: '#688000', points: '0,0 6,2 6,0 0,-2'};
const v8x = {name: 'v8x', color: '#688000', points: '0,0 -6,2 -6,0 0,-2'};

const vh10 = {name: 'vh10', color: '#444444', points: '3,3 3,-1 -3,-3 -6,-2 -6,2 0,4'};
const vh12 = {name: 'vh12', color: '#444444', points: '6,0 0,-2 -6,0 -6,2 0,4 6,2'};

const vg690 = {name: 'vg690', color: '#444444', points: '0,-4 0,2 -6,0 -3,-1 -3,-3'};
const vg691 = {name: 'vg691', color: '#444444', points: '0,-4 0,2 -3,3 -6,2 -6,0 -3,-1 -3,-3'};

const trap45 = {name: 'trap45', color: '#688000', points: '6,0 6,-2 3,-3 0,-2'};
const trap78 = {name: 'trap78', color: '#688000', points: '-6,0 -6,-2 -3,-3 0,-2'};

const uu1 = {name: 'uu1', color: '#688000', points: '-3,3 -3,-1 -6,0 -6,2'};
const uu2 = {name: 'uu2', color: '#688000', points: '-3,3 -3,-1 0,0 0,2'};
const uu3 = {name: 'uu3', color: '#688000', points: '3,3 3,-1 0,0 0,2'};
const uu4 = {name: 'uu4', color: '#688000', points: '3,3 3,-1 6,0 6,2'};
const u5 = {name: 'u5', color: '#688000', points: '0,2 3,1 3,-1 0,0 -3,-1 -3,1'};
const u6 = {name: 'u6', color: '#688000', points: '0,0 3,-1 3,-3 0,-2 -3,-3 -3,-1'};
const u4 = {name: 'u4', color: '#688000', points: '0,0 3,1 6,0 3,-1 3,-3 0,-2'};
const u8 = {name: 'u8', color: '#688000', points: '0,0 -3,1 -6,0 -3,-1 -3,-3 0,-2'};
const u12 = {name: 'u12', color: '#688000', points: '0,0 3,1 3,3 0,2 -3,3 -3,1'};

const a1 = {name: 'a1', color: '#550077', points: '0,4 6,-2 -6,-2', skipEdgesOnHexCoords: ['2,6', '5,6']};
const a5 = {name: 'a5', color: '#770099', points: '0,2 3,-1 -3,-1', skipEdgesOnHexCoords: ['1,5', '1,6']};
const a3 = {name: 'a3', color: '#550077', points: '0,-4 -6,2 6,2', skipEdgesOnHexCoords: ['4,4', '5,5']};
const a7 = {name: 'a7', color: '#770099', points: '0,-2 -3,1 3,1'};

const a3h1 = {name: 'a3h1', color: '#770099', points: '-6,2 6,2 3,-1'};
const a3h7 = {name: 'a3h7', color: '#770099', points: '0,-4 -6,2 3,-1'};
const a3x6 = {name: 'a3x6', color: '#770099', points: '-6,2 6,2 2,-2 -2,-2'};

const b55 = {name: 'b55', color: '#9900BB', points: '0,-1 -1.5,0.5 1.5,0.5'};
const a54 = {name: 'a54', color: '#9900BB', points: '3,-1 0,-1 1.5,0.5'};
const a58 = {name: 'a58', color: '#9900BB', points: '-3,-1 0,-1 -1.5,0.5'};
const a512 = {name: 'a512', color: '#9900BB', points: '0,2 -1.5,0.5 1.5,0.5'};
const a555 = {name: 'a555', color: '#BB00DD', points: '0,0.5 0.75,-0.25 -0.75,-0.25', edgeChannel: RED};

const a2 = {name: 'a2', color: '#770099', points: '6,2 3,-1 0,2', skipEdgesOnHexCoords: ['4,5', '0,3', '0,4', '1,3', '1,4']};
const a6 = {name: 'a6', color: '#770099', points: '0,-4 -3,-1 3,-1', skipEdgesOnHexCoords: ['4,5', '0,3', '0,4', '1,3', '1,4']};
const a10 = {name: 'a10', color: '#770099', points: '-6,2 0,2 -3,-1', skipEdgesOnHexCoords: ['4,5', '0,3', '0,4', '1,3', '1,4']};

const a4 = {name: 'a4', color: '#770099', points: '6,-2 0,-2 3,1'};
const a8 = {name: 'a8', color: '#770099', points: '-6,-2 -3,1 0,-2'};
const a12 = {name: 'a12', color: '#770099', points: '0,4 3,1 -3,1'};

const ag6 = {name: 'ag6', color: '#BB00DD', points: '0,-4 4,0 -4,0'};
const ag5 = {name: 'ag5', color: '#BB00DD', points: '0,-4 4,0 6,-2'};
const ag7 = {name: 'ag7', color: '#BB00DD', points: '0,-4 -4,0 -6,-2'};
const ag12 = {name: 'ag12', color: '#BB00DD', points: '0,4 4,0 -4,0'};
const ag12a = {name: 'ag12a', color: '#BB00DD', points: '4,0 6,-2 -6,-2 -4,0'};
const ag3 = {name: 'ag3', color: '#BB00DD', points: '0,4 6,-2 0,-2'};
const ag9 = {name: 'ag9', color: '#BB00DD', points: '0,4 -6,-2 0,-2'};
const ah3 = {name: 'ah3', color: '#BB00DD', points: '0,-4 6,2 0,2'};
const ah9 = {name: 'ah9', color: '#BB00DD', points: '0,-4 -6,2 0,2'};

const b1 = {name: 'b1', color: '#990077', points: '0,2 3,3 3,1'};
const b3 = {name: 'b3', color: '#990077', points: '3,1 6,0 3,-1'};
const b5 = {name: 'b5', color: '#990077', points: '3,-1 3,-3 0,-2'};
const b7 = {name: 'b7', color: '#990077', points: '0,-2 -3,-3 -3,-1'};
const b9 = {name: 'b9', color: '#990077', points: '-3,-1 -6,0 -3,1'};
const b11 = {name: 'b11', color: '#990077', points: '-3,1 -3,3 0,2'};

const c0 = {name: 'c0', color: '#666666', points: '0,2 3,1 3,-1 0,-2 -3,-1 -3,1'};
const ca0 = {name: 'ca0', color: '#666666', points: '2,2 4,0 2,-2 -2,-2 -4,0 -2,2'};
const ca12 = {name: 'ca12', color: '#666666', points: '2,2 4,0 -4,0 -2,2'};
const ca6 = {name: 'ca6', color: '#666666', points: '4,0 2,-2 -2,-2 -4,0'};

const cz0 = {name: 'cz0', color: '#666666', points: '0,4 6,2 6,-2 0,-4 -6,-2 -6,2'};
const czh0 = {name: 'czh0', color: '#666666', points: '6,2 6,-2 -6,-2 -6,2'};
const czh6 = {name: 'czh6', color: '#666666', points: '6,0 6,-2 -6,-2 -6,0'};
const czh12 = {name: 'czh12', color: '#666666', points: '6,2 6,0 -6,0 -6,2'};
const czh02 = {name: 'czh02', color: '#666666', points: '0,4 6,-2 0,-4 -6,2'};
const czh2 = {name: 'czh2', color: '#666666', points: '0,4 6,-2 3,-3 -3,3'};
const czh8 = {name: 'czh8', color: '#666666', points: '-3,3 -6,2 0,-4 3,-3'};

const czh1 = {name: 'czh1', color: '#666666', points: '6,2 6,-2 -6,2'};
const czh7 = {name: 'czh7', color: '#666666', points: '6,-2 -6,-2 -6,2'};

const czh04 = {name: 'czh04', color: '#666666', points: '0,4 6,2 0,-4 -6,-2'};
const czh4 = {name: 'czh4', color: '#666666', points: '0,4 -6,-2 -3,-3 3,3'};
const czh10 = {name: 'czh10', color: '#666666', points: '3,3 6,2 0,-4 -3,-3'};

const cah4 = {name: 'cah4', color: '#666666', points: '3,3 6,0 3,-3 -3,-3'};
const cah10 = {name: 'cah10', color: '#666666', points: '-3,-3 -6,0 -3,3 3,3'};
const cah6 = {name: 'cah6', color: '#666666', points: '3,-3 6,0 -6,0 -3,-3'};
const cah12 = {name: 'cah12', color: '#666666', points: '3,3 6,0 -6,0 -3,3'};

const cc2 = {name: 'cc2', color: '#999999', points: '1.5,1.5 3,1 3,0 0,0'};
const cc4 = {name: 'cc4', color: '#999999', points: '3,0 3,-1 1.5,-1.5 0,0'};
const cc6 = {name: 'cc6', color: '#999999', points: '1.5,-1.5 0,-2 -1.5,-1.5 0,0'};
const cc8 = {name: 'cc8', color: '#999999', points: '-1.5,-1.5 -3,-1 -3,0 0,0'};
const cc10 = {name: 'cc10', color: '#999999', points: '-3,0 -3,1 -1.5,1.5 0,0'};
const cc12 = {name: 'cc12', color: '#999999', points: '-1.5,1.5 0,2 1.5,1.5 0,0'};

const c2 = {name: 'c2', color: '#666666', points: '3,3 6,2 6,0 3,-1 0,0 0,2'};
const c4 = {name: 'c4', color: '#666666', points: '3,1 6,0 6,-2 3,-3 0,-2 0,0'};
const c6 = {name: 'c6', color: '#666666', points: '0,0  3,-1  3,-3 0,-4 -3,-3 -3,-1'};
const c8 = {name: 'c8', color: '#666666', points: '-3,1  0,0  0,-2 -3,-3 -6,-2 -6,0'};
const c10 = {name: 'c10', color: '#666666', points: '-3,3 0,2  0,0 -3,-1 -6,0 -6,2'};
const c12 = {name: 'c12', color: '#666666', points: '0,4 3,3  3,1 0,0 -3,1 -3,3'};

const e2 = {name: 'e2', color: '#773800', points: '0,4 6,2 6,-2', skipEdgesOnHexCoords: ['2,8', '4,8', '4,10', '4,11', '5,10']};
const e6 = {name: 'e6', color: '#773800', points: '6,-2 0,-4 -6,-2', skipEdgesOnHexCoords: ['2,8', '4,8', '4,10', '4,11', '5,10']};
const e10 = {name: 'e10', color: '#773800', points: '-6,-2 -6,2 0,4', skipEdgesOnHexCoords: ['2,8', '4,8', '4,10', '4,11', '5,10']};
const e1 = {name: 'e1', color: '#AA6622', points: '0,4 6,2 3,1'};
const e3 = {name: 'e3', color: '#AA6622', points: '3,1 6,2 6,-2'};
const e5 = {name: 'e5', color: '#AA6622', points: '6,-2 0,-4 0,-2'};
const e7 = {name: 'e7', color: '#AA6622', points: '0,-2 0,-4 -6,-2'};
const e9 = {name: 'e9', color: '#AA6622', points: '-6,-2 -6,2 -3,1'};
const e11 = {name: 'e11', color: '#AA6622', points: '-3,1 -6,2 0,4'};

const f4 = {name: 'f4', color: '#773800', points: '6,2 6,-2 0,-4', skipEdgesOnHexCoords: ['0,2', '1,2', '2,3', '2,4', '2,5']};
const f8 = {name: 'f8', color: '#773800', points: '0,-4 -6,-2 -6,2', skipEdgesOnHexCoords: ['0,2', '1,2', '2,3', '2,4', '2,5']};
const f12 = {name: 'f12', color: '#773800', points: '-6,2 0,4 6,2', skipEdgesOnHexCoords: ['0,2', '1,2', '2,3', '2,4', '2,5']};
const f1 = {name: 'f1', color: '#AA6622', points: '0,2 0,4 6,2'};
const f3 = {name: 'f3', color: '#AA6622', points: '6,2 6,-2 3,-1'};
const f5 = {name: 'f5', color: '#AA6622', points: '3,-1 6,-2 0,-4'};
const f7 = {name: 'f7', color: '#AA6622', points: '0,-4 -6,-2 -3,-1'};
const f9 = {name: 'f9', color: '#AA6622', points: '-3,-1 -6,-2 -6,2'};
const f11 = {name: 'f11', color: '#AA6622', points: '-6,2 0,4 0,2'};

const ea2 = {name: 'ea2', color: '#884810', points: '0,4 0,0 6,-2'};
const ea6 = {name: 'ea6', color: '#884810', points: '6,-2 0,0 -6,-2'};
const ea10 = {name: 'ea10', color: '#884810', points: '-6,-2 0,0 0,4'};
const fa4 = {name: 'fa4', color: '#884810', points: '6,2 0,0 0,-4'};
const fa8 = {name: 'fa8', color: '#884810', points: '0,-4 0,0 -6,2'};
const fa12 = {name: 'fa12', color: '#884810', points: '-6,2 0,0 6,2'};

const ef1 = {name: 'ef1', color: '#BB7733', points: '2,2 6,2 0,4'};
const ef2 = {name: 'ef2', color: '#BB7733', points: '4,0 6,2 2,2'};
const ef3 = {name: 'ef3', color: '#BB7733', points: '6,-2 6,2 4,0'};
const ef5 = {name: 'ef5', color: '#BB7733', points: '6,-2 0,-4 2,-2'};
const ef6 = {name: 'ef6', color: '#BB7733', points: '2,-2 0,-4 -2,-2'};
const ef7 = {name: 'ef7', color: '#BB7733', points: '-2,-2 0,-4 -6,-2'};
const ef9 = {name: 'ef9', color: '#BB7733', points: '-4,0 -6,2 -6,-2'};
const ef10 = {name: 'ef10', color: '#BB7733', points: '-2,2 -6,2 -4,0'};
const ef11 = {name: 'ef11', color: '#BB7733', points: '0,4 -6,2 -2,2'};

const ef1and2 = {name: 'ef1and2', color: '#887733', points: '6,2 0,4 4,0'};
const ef3and4 = {name: 'ef3and4', color: '#887733', points: '6,-2 6,2 2,-2'};
const ef5and6 = {name: 'ef5and6', color: '#887733', points: '0,-4 6,-2 -2,-2'};
const ef7and8 = {name: 'ef7and8', color: '#887733', points: '-6,-2 0,-4 -4,0'};
const ef9and10 = {name: 'ef9and10', color: '#887733', points: '-6,2 -6,-2 -2,2'};
const ef11and12 = {name: 'ef11and12', color: '#887733', points: '0,4 -6,2 2,2'};

const ef10and11 = {name: 'ef10and11', color: '#887733', points: '-6,2 0,4 -4,0'};

const ef1230 = {name: 'ef1230', color: '#EE7733', points: '3,3 0,4 2,2'};
const ef130 = {name: 'ef130', color: '#EE7733', points: '6,2 3,3 2,2'};
const ef230 = {name: 'ef230', color: '#EE7733', points: '6,0 6,2 4,0'};
const ef330 = {name: 'ef330', color: '#EE7733', points: '6,0 6,-2 4,0'};
const ef430 = {name: 'ef430', color: '#EE7733', points: '6,-2 3,-3 2,-2'};
const ef530 = {name: 'ef530', color: '#EE7733', points: '3,-3 0,-4 2,-2'};
const ef630 = {name: 'ef630', color: '#EE7733', points: '-2,-2 0,-4 -3,-3'};
const ef730 = {name: 'ef730', color: '#EE7733', points: '-2,-2 -3,-3 -6,-2'};
const ef830 = {name: 'ef830', color: '#EE7733', points: '-6,0 -6,-2 -4,0'};
const ef930 = {name: 'ef930', color: '#EE7733', points: '-6,0 -6,2 -4,0'};
const ef1030 = {name: 'ef1030', color: '#EE7733', points: '-2,2 -3,3 -6,2'};
const ef1130 = {name: 'ef1130', color: '#EE7733', points: '-2,2 0,4 -3,3'};

const ef2and230 = {name: 'ef2and230', color: '#EE7733', points: '4,0 6,0 6,2 2,2'};
const ef930and10 = {name: 'ef930and10', color: '#EE7733', points: '-4,0 -6,0 -6,2 -2,2'};

const ff3 = {name: 'ff3', color: '#BB7733', points: '6,2 6,-2 4,0'};
const ff4 = {name: 'ff4', color: '#BB7733', points: '4,0 6,-2 2,-2'};
const ff5 = {name: 'ff5', color: '#BB7733', points: '2,-2 6,-2 0,-4'};
const ff7 = {name: 'ff7', color: '#BB7733', points: '0,-4 -6,-2 -2,-2'};
const ff8 = {name: 'ff8', color: '#BB7733', points: '-2,-2 -6,-2 -4,0'};
const ff9 = {name: 'ff9', color: '#BB7733', points: '-4,0 -6,-2 -6,2'};
const ff11 = {name: 'ff11', color: '#BB7733', points: '-6,2 0,4 -2,2'};
const ff12 = {name: 'ff12', color: '#BB7733', points: '-2,2 0,4 2,2'};
const ff1 = {name: 'ff1', color: '#BB7733', points: '2,2 0,4 6,2'};

const ff3and4 = {name: 'ff3and4', color: '#BB7733', points: '6,2 6,-2 2,-2'};
const ff8and9 = {name: 'ff8and9', color: '#BB7733', points: '-2,-2 -6,-2 -6,2'};

const ef2a = {name: 'ef2a', color: '#CC9911', points: '4,0 0,0 2,2'};
const ef6a = {name: 'ef6a', color: '#CC9911', points: '2,-2 0,0 -2,-2'};
const ef10a = {name: 'ef10a', color: '#CC9911', points: '-2,2 0,0 -4,0'};
const ff4a = {name: 'ff4a', color: '#CC9911', points: '4,0 0,0 2,-2'};
const ff8a = {name: 'ff8a', color: '#CC9911', points: '-2,-2 0,0 -4,0'};
const ff12a = {name: 'ff12a', color: '#CC9911', points: '-2,2 0,0 2,2'};

const e2b = {name: 'e2b', color: '#CC9911', points: '0,4 6,2 6,-2 4,0 0,0 2,2'};
const e6b = {name: 'e6b', color: '#CC9911', points: '6,-2 0,-4 -6,-2 -2,-2 0,0 2,-2'};
const e10b = {name: 'e10b', color: '#CC9911', points: '0,4 -6,2 -6,-2 -4,0 0,0 -2,2'};

const g12 = {name: 'g12', color: '#669988', points: '0,4 6,2 3,1 0,2 -3,1 -6,2'};
const g4 = {name: 'g4', color: '#669988', points: '3,1 6,2 6,-2 0,-4 0,-2 3,-1'};
const g8 = {name: 'g8', color: '#669988', points: '-3,1 -3,-1 0,-2 0,-4 -6,-2 -6,2'};

const g1 = {name: 'g1', color: '#88BBAA', points: '0,4 6,2 3,1 0,2'};
const g3 = {name: 'g3', color: '#88BBAA', points: '3,1 6,2 6,-2 3,-1'};
const g5 = {name: 'g5', color: '#88BBAA', points: '6,-2 0,-4 0,-2 3,-1'};
const g7 = {name: 'g7', color: '#88BBAA', points: '-3,-1 0,-2 0,-4 -6,-2'};
const g9 = {name: 'g9', color: '#88BBAA', points: '-3,1 -3,-1 -6,-2 -6,2'};
const g11 = {name: 'g11', color: '#88BBAA', points: '0,4 0,2 -3,1 -6,2'};

const h2 = {name: 'h2', color: '#888888', points: '3,3 6,2 6,0 3,-1 0,2'};
const h4 = {name: 'h4', color: '#888888', points: '3,1 6,0 6,-2 3,-3 0,-2'};
const h6 = {name: 'h6', color: '#888888', points: '3,-1 3,-3 0,-4 -3,-3 -3,-1'};
const h8 = {name: 'h8', color: '#888888', points: '-3,1 0,-2 -3,-3 -6,-2 -6,0'};
const h10 = {name: 'h10', color: '#888888', points: '-3,3 0,2 -3,-1 -6,0 -6,2'};
const h12 = {name: 'h12', color: '#888888', points: '0,4 3,3 3,1 -3,1 -3,3'};

const i2 = {name: 'i2', color: '#888888', points: '3,3 6,2 6,0 3,-1 3,1 0,2'};
const i4 = {name: 'i4', color: '#888888', points: '3,1 6,0 6,-2 3,-3 0,-2 3,-1'};
const i6 = {name: 'i6', color: '#888888', points: '0,-2  3,-1  3,-3 0,-4 -3,-3 -3,-1'};
const i8 = {name: 'i8', color: '#888888', points: '-3,1  -3,-1  0,-2 -3,-3 -6,-2 -6,0'};
const i10 = {name: 'i10', color: '#888888', points: '-3,3 0,2  -3,1 -3,-1 -6,0 -6,2'};
const i12 = {name: 'i12', color: '#888888', points: '0,4 3,3  3,1 0,2 -3,1 -3,3'};

const icc2 = {name: 'icc2', color: '#AAAAAA', points: '3,3 6,2 6,0 3,-1 3,0 0,0 1.5,1.5 0,2'};
const icc6 = {name: 'icc6', color: '#AAAAAA', points: '-1.5,-1.5 0,0 1.5,-1.5 3,-1 3,-3 0,-4 -3,-3 -3,-1'};
const icc10 = {name: 'icc10', color: '#AAAAAA', points: '-3,3 0,2 -1.5,1.5 0,0 -3,0 -3,-1 -6,0 -6,2'};

const icca2 = {name: 'icca2', color: '#AAAAAA', points: '3,3 6,2 6,0'};
const icca6 = {name: 'icca6', color: '#AAAAAA', points: '3,-3 0,-4 -3,-3'};
const icca10 = {name: 'icca10', color: '#AAAAAA', points: '-3,3 -6,0 -6,2'};
const icca4 = {name: 'icca4', color: '#AAAAAA', points: '3,-3 6,-2 6,0'};
const icca8 = {name: 'icca8', color: '#AAAAAA', points: '-3,-3 -6,-0 -6,-2'};
const icca12 = {name: 'icca12', color: '#AAAAAA', points: '3,3 0,4 -3,3'};

const iccaa2 = {name: 'iccaa2', color: '#AAAAAA', points: '3,3 3,1 6,0'};
const iccaa6 = {name: 'iccaa6', color: '#AAAAAA', points: '3,-3 0,-2 -3,-3'};
const iccaa10 = {name: 'iccaa10', color: '#AAAAAA', points: '-3,3 -6,0 -3,1'};
const iccaa4 = {name: 'iccaa4', color: '#AAAAAA', points: '3,-3 3,-1 6,0'};
const iccaa8 = {name: 'iccaa8', color: '#AAAAAA', points: '-3,-3 -6,-0 -3,-1'};
const iccaa12 = {name: 'iccaa12', color: '#AAAAAA', points: '3,3 0,2 -3,3'};

const issa0 = {name: 'issa0', color: '#999999', points: '-6,-2 -1,3 3,3 6,0 3,-3 0,-4'};
const issa10 = {name: 'issa10', color: '#AAAAAA', points: '-6,-2 -6,2 -3,3 -1,3'};
const issa11 = {name: 'issa11', color: '#AAAAAA', points: '-3,3 -1,3 0,4'};
const issa12 = {name: 'issa12', color: '#AAAAAA', points: '-1,3 0,4 3,3'};

const iccb2 = {name: 'iccb2', color: '#AAAAAA', points: '3,3 6,0 3,-1 3,0 0,0 1.5,1.5 0,2'};
const iccb6 = {name: 'iccb6', color: '#AAAAAA', points: '-1.5,-1.5 0,0 1.5,-1.5 3,-1 3,-3 -3,-3 -3,-1'};
const iccb10 = {name: 'iccb10', color: '#AAAAAA', points: '-3,3 0,2 -1.5,1.5 0,0 -3,0 -3,-1 -6,0'};

const iccb2sq = {name: 'iccb2sq', color: '#AAAAAA', points: '3,3 6,0 3,-1 3,0.5 1.5,0.5 2.25,1.25 0,2'};
const iccb6sq = {name: 'iccb6sq', color: '#AAAAAA', points: '-0.75,-1.75 0,-1 0.75,-1.75 3,-1 3,-3 -3,-3 -3,-1'};
const iccb10sq = {name: 'iccb10sq', color: '#AAAAAA', points: '-3,3 0,2 -2.25,1.25 -1.5,0.5 -3,0.5 -3,-1 -6,0'};
const cc4sq = {name: 'cc4sq', color: '#999999', points: '3,0.5 3,-1 0.75,-1.75 0,-1 1.5,0.5'};
const cc8sq = {name: 'cc8sq', color: '#999999', points: '-0.75,-1.75 -3,-1 -3,0.5 -1.5,0.5 0,-1'};
const cc12sq = {name: 'cc12sq', color: '#999999', points: '-2.25,1.25 0,2 2.25,1.25 1.5,0.5 -1.5,0.5'};
const cc0sq = {name: 'cc0sq', color: '#999999', points: '-1.5,0.5 1.5,0.5 0,-1'};

const isec2 = {name: 'isec2', color: '#AAAAAA', points: '3,3 6,2 6,0 0,0'};
const isec6 = {name: 'isec6', color: '#AAAAAA', points: '3,-3 0,-4 -3,-3 0,0'};
const isec10 = {name: 'isec10', color: '#AAAAAA', points: '-3,3 -6,2 -6,0 0,0'};

const iarr4 = {name: 'iarr4', color: '#CCBB77', points: '3,-3 3,-1 6,0 0,0'};
const iarr8 = {name: 'iarr8', color: '#CCBB77', points: '-3,-3 -3,-1 -6,0 0,0'};
const iarr12 = {name: 'iarr12', color: '#CCBB77', points: '3,3 0,2 -3,3 0,0'};

const iarr130 = {name: 'iarr130', color: '#DDCC88', points: '3,3 3,1 0,0'};
const iarr230 = {name: 'iarr230', color: '#DDCC88', points: '3,1 6,0 0,0'};
const iarr330 = {name: 'iarr330', color: '#DDCC88', points: '3,-1 6,0 0,0'};
const iarr430 = {name: 'iarr430', color: '#DDCC88', points: '3,-3 3,-1 0,0'};
const iarr530 = {name: 'iarr530', color: '#DDCC88', points: '3,-3 0,-2 0,0'};
const iarr630 = {name: 'iarr630', color: '#DDCC88', points: '0,-2 -3,-3 0,0'};
const iarr730 = {name: 'iarr730', color: '#DDCC88', points: '-3,-3 -3,-1 0,0'};
const iarr830 = {name: 'iarr830', color: '#DDCC88', points: '-3,-1 -6,0 0,0'};
const iarr930 = {name: 'iarr930', color: '#DDCC88', points: '-3,1 -6,0 0,0'};
const iarr1030 = {name: 'iarr1030', color: '#DDCC88', points: '-3,3 -3,1 0,0'};
const iarr1130 = {name: 'iarr1130', color: '#DDCC88', points: '0,2 -3,3 0,0'};
const iarr1230 = {name: 'iarr1230', color: '#DDCC88', points: '3,3 0,2 0,0'};

// const cc2 = {name: 'cc2', color: '#999999', points: '1.5,1.5 3,1 3,0 0,0'};
// const cc6 = {name: 'cc6', color: '#999999', points: '1.5,-1.5 0,-2 -1.5,-1.5 0,0'};
// const cc10 = {name: 'cc10', color: '#999999', points: '-3,0 -3,1 -1.5,1.5 0,0'};

const j4 = {name: 'j4', color: '#AAAAAA', points: '3,1 6,-2 0,-2 3,-1'};
const j8 = {name: 'j8', color: '#AAAAAA', points: '-3,1  -3,-1 0,-2 -6,-2'};
const j12 = {name: 'j12', color: '#AAAAAA', points: '0,4 3,1 0,2 -3,1'};

const k2 = {name: 'k2', color: '#AAAAAA', points: '3,-1 3,1 0,2'};
const k6 = {name: 'k6', color: '#AAAAAA', points: '0,-2  3,-1 -3,-1'};
const k10 = {name: 'k10', color: '#AAAAAA', points: '0,2 -3,1 -3,-1'};

const l4 = {name: 'l4', color: '#66556A', points: '3,1 6,-2 0,-2 0,0'};
const l8 = {name: 'l8', color: '#66556A', points: '-3,1 0,0 0,-2 -6,-2'};
const l12 = {name: 'l12', color: '#66556A', points: '0,4 3,1 0,0 -3,1'};
const l2 = {name: 'l2', color: '#66556A', points: '0,2 6,2 3,-1 0,0'};
const l6 = {name: 'l6', color: '#66556A', points: '0,0 3,-1 0,-4 -3,-1'};
const l10 = {name: 'l10', color: '#66556A', points: '0,0 -3,-1 -6,2 0,2'};

const qa0 = {name: 'qa0', color: '#9900BB', points: '0,0.67 1,-0.33 -1,-0.33'};
const qb0 = {name: 'qb0', color: '#9900BB', points: '0,1.33 2,-0.67 -2,-0.67'};
const qc0 = {...a5, name: 'qc0'}; // {color: '#770099', points: '0,2 3,-1 -3,-1'};
const qd0 = {name: 'qd0', color: '#9900BB', points: '0,2.665 4,-1.335 -4,-1.335'};
const qe0 = {name: 'qe0', color: '#9900BB', points: '0,3.3325 5,-1.6675 -5,-1.6675'};
const qf0 = {...a1, name: 'qf0'}; // {color: '#550077', points: '0,4 6,-2 -6,-2'};

const qa2 = {name: 'qa2', color: '#993070', points: '0,0.67 6,2 1,-0.33', edgeChannel: RED};
const qb2 = {name: 'qb2', color: '#993070', points: '0,1.33 6,2 2,-0.67', edgeChannel: RED};
const qc2 = {...a2, name: 'qc2'}; // {color: '#770099', points: '0,2 6,2 3,-1'};
const qd2 = {name: 'qd2', color: '#993070', points: '0,2.665 6,2 4,-1.335', edgeChannel: RED};
const qe2 = {name: 'qe2', color: '#993070', points: '0,3.3325 6,2 5,-1.6675', edgeChannel: RED};
const qf2 = {...e2, name: 'qf2'}; // {color: '#773800', points: '0,4 6,2 6,-2'};

const qa6 = {name: 'qa6', color: '#993070', points: '1,-0.33 0,-4 -1,-0.33', edgeChannel: RED};
const qb6 = {name: 'qb6', color: '#993070', points: '2,-0.67 0,-4 -2,-0.67', edgeChannel: RED};
const qc6 = {...a6, name: 'qc6'}; // {color: '#770099', points: '3,-1 0,-4 -3,-1'};
const qd6 = {name: 'qd6', color: '#993070', points: '4,-1.335 0,-4 -4,-1.335', edgeChannel: RED};
const qe6 = {name: 'qe6', color: '#993070', points: '5,-1.6675 0,-4 -5,-1.6675', edgeChannel: RED};
const qf6 = {...e6, name: 'qf6'}; // {color: '#773800', points: '6,-2 0,-4 -6,-2'};

const qa10 = {name: 'qa10', color: '#993070', points: '0,0.67 -6,2 -1,-0.33', edgeChannel: RED};
const qb10 = {name: 'qb10', color: '#993070', points: '0,1.33 -6,2 -2,-0.67', edgeChannel: RED};
const qc10 = {...a10, name: 'qc10'}; // {color: '#770099', points: '0,2 -6,2 -3,-1'};
const qd10 = {name: 'qd10', color: '#993070', points: '0,2.665 -6,2 -4,-1.335', edgeChannel: RED};
const qe10 = {name: 'qe10', color: '#993070', points: '0,3.3325 -6,2 -5,-1.6675', edgeChannel: RED};
const qf10 = {...e10, name: 'qf10'}; // {color: '#773800', points: '0,4 -6,2 -6,-2'};

const qa1 = {name: 'qa1', color: '#88AA55', points: '0,4 6,2 0,0.67', edgeChannel: ORANGE};
const qb1 = {name: 'qb1', color: '#88AA55', points: '0,4 6,2 0,1.33', edgeChannel: ORANGE};
const qc1 = {...f1, name: 'qc1'}; // {color: '#AA6622', points: '0,4 6,2 0,2'};
const qd1 = {name: 'qd1', color: '#88AA55', points: '0,4 6,2 0,2.665', edgeChannel: ORANGE};
const qe1 = {name: 'qe1', color: '#88AA55', points: '0,4 6,2 0,3.3325', edgeChannel: ORANGE};

const qa3 = {name: 'qa3', color: '#88AA55', points: '6,2 6,-2 1,-0.33', edgeChannel: ORANGE};
const qb3 = {name: 'qb3', color: '#88AA55', points: '6,2 6,-2 2,-0.67', edgeChannel: ORANGE};
const qc3 = {...f3, name: 'qc3'}; // {color: '#AA6622', points: '6,2 6,-2 3,-1'};
const qd3 = {name: 'qd3', color: '#88AA55', points: '6,2 6,-2 4,-1.335', edgeChannel: ORANGE};
const qe3 = {name: 'qe3', color: '#88AA55', points: '6,2 6,-2 5,-1.6675', edgeChannel: ORANGE};

const qa5 = {name: 'qa5', color: '#88AA55', points: '6,-2 0,-4 1,-0.33', edgeChannel: ORANGE};
const qb5 = {name: 'qb5', color: '#88AA55', points: '6,-2 0,-4 2,-0.67', edgeChannel: ORANGE};
const qc5 = {...f5, name: 'qc5'}; // {color: '#AA6622', points: '6,-2 0,-4 3,-1'};
const qd5 = {name: 'qd5', color: '#88AA55', points: '6,-2 0,-4 4,-1.335', edgeChannel: ORANGE};
const qe5 = {name: 'qe5', color: '#88AA55', points: '6,-2 0,-4 5,-1.6675', edgeChannel: ORANGE};

const qa7 = {name: 'qa7', color: '#88AA55', points: '-6,-2 0,-4 -1,-0.33', edgeChannel: ORANGE};
const qb7 = {name: 'qb7', color: '#88AA55', points: '-6,-2 0,-4 -2,-0.67', edgeChannel: ORANGE};
const qc7 = {...f7, name: 'qc7'}; // {color: '#AA6622', points: '-6,-2 0,-4 -3,-1'};
const qd7 = {name: 'qd7', color: '#88AA55', points: '-6,-2 0,-4 -4,-1.335', edgeChannel: ORANGE};
const qe7 = {name: 'qe7', color: '#88AA55', points: '-6,-2 0,-4 -5,-1.6675', edgeChannel: ORANGE};

const qa9 = {name: 'qa9', color: '#88AA55', points: '-6,2 -6,-2 -1,-0.33', edgeChannel: ORANGE};
const qb9 = {name: 'qb9', color: '#88AA55', points: '-6,2 -6,-2 -2,-0.67', edgeChannel: ORANGE};
const qc9 = {...f9, name: 'qc9'}; // {color: '#AA6622', points: '-6,2 -6,-2 -3,-1'};
const qd9 = {name: 'qd9', color: '#88AA55', points: '-6,2 -6,-2 -4,-1.335', edgeChannel: ORANGE};
const qe9 = {name: 'qe9', color: '#88AA55', points: '-6,2 -6,-2 -5,-1.6675', edgeChannel: ORANGE};

const qa11 = {name: 'qa11', color: '#88AA55', points: '0,4 -6,2 0,0.67', edgeChannel: ORANGE};
const qb11 = {name: 'qb11', color: '#88AA55', points: '0,4 -6,2 0,1.33', edgeChannel: ORANGE};
const qc11 = {...f11, name: 'qc11'}; // {color: '#AA6622', points: '0,4 -6,2 0,2'};
const qd11 = {name: 'qd11', color: '#88AA55', points: '0,4 -6,2 0,2.665', edgeChannel: ORANGE};
const qe11 = {name: 'qe11', color: '#88AA55', points: '0,4 -6,2 0,3.3325', edgeChannel: ORANGE};

const ra2 = {name: 'ra2', color: '#1166AA', points: '-2,2 6,2 4,0 0,0'};
const ra6 = {name: 'ra6', color: '#1166AA', points: '0,0 4,0 0,-4 -2,-2'};
const ra10 = {name: 'ra10', color: '#1166AA', points: '0,0 -2,-2 -6,2 -2,2'};
// rb2,6,10 are l2,6,10
const rc2 = {name: 'rc2', color: '#1166AA', points: '0,2 6,2 3,-1 0,-1 0,0 1.5,0.5'};
const rc6 = {name: 'rc6', color: '#1166AA', points: '0,0 0,-1 3,-1 0,-4 -3,-1 -1.5,0.5'};
const rc10 = {name: 'rc10', color: '#1166AA', points: '0,0 -1.5,0.5 -3,-1 -6,2 0,2 1.5,0.5'};

const sa12 = {name: 'sa12', color: '#3344BB', points: '-2,2 -6,2 0,4 6,2 4,0 0,0'};
const sa4 = {name: 'sa4', color: '#3344BB', points: '0,0 4,0 6,2 6,-2 0,-4 -2,-2'};
const sa8 = {name: 'sa8', color: '#3344BB', points: '0,0 -2,-2 0,-4 -6,-2 -6,2 -2,2'};
const sb12 = {name: 'sb12', color: '#3344BB', points: '0,2 -6,2 0,4 6,2 3,-1 0,0'};
const sb4 = {name: 'sb4', color: '#3344BB', points: '0,0 3,-1 6,2 6,-2 0,-4 -3,-1'};
const sb8 = {name: 'sb8', color: '#3344BB', points: '0,0 -3,-1 0,-4 -6,-2 -6,2 0,2'};
const sc12 = {name: 'sc12', color: '#3344BB', points: '0,2 -6,2 0,4 6,2 3,-1 0,-1 0,0 1.5,0.5'};
const sc4 = {name: 'sc4', color: '#3344BB', points: '0,0 0,-1 3,-1 6,2 6,-2 0,-4 -3,-1 -1.5,0.5'};
const sc8 = {name: 'sc8', color: '#3344BB', points: '0,0 -1.5,0.5 -3,-1 0,-4 -6,-2 -6,2 0,2 1.5,0.5'};

const sa11 = {name: 'sa11', color: '#4460DD', points: '0,0 -2,2 -6,2 0,4 2,2'};
const sa1 = {name: 'sa1', color: '#4460DD', points: '0,0 2,2 0,4 6,2 4,0'};
const sa3 = {name: 'sa3', color: '#4460DD', points: '0,0 4,0 6,2 6,-2 2,-2'};
const sa5 = {name: 'sa5', color: '#4460DD', points: '0,0 2,-2 6,-2 0,-4 -2,-2'};
const sa7 = {name: 'sa7', color: '#4460DD', points: '0,0 -2,-2 0,-4 -6,-2 -4,0'};
const sa9 = {name: 'sa9', color: '#4460DD', points: '0,0 -4,0 -6,-2 -6,2 -2,2'};
const sb11 = {name: 'sb11', color: '#4460DD', points: '0,0 0,2 -6,2 0,4 3,1'};
const sb1 = {name: 'sb1', color: '#4460DD', points: '0,0 3,1 0,4 6,2 3,-1'};
const sb3 = {name: 'sb3', color: '#4460DD', points: '0,0 3,-1 6,2 6,-2 0,-2'};
const sb5 = {name: 'sb5', color: '#4460DD', points: '0,0 0,-2 6,-2 0,-4 -3,-1'};
const sb7 = {name: 'sb7', color: '#4460DD', points: '0,0 -3,-1 0,-4 -6,-2 -3,1'};
const sb9 = {name: 'sb9', color: '#4460DD', points: '0,0 -3,1 -6,-2 -6,2 0,2'};
const sc11 = {name: 'sc11', color: '#4460DD', points: '0,0 1.5,0.5 0,2 -6,2 0,4 3,1 1.5,-0.5'};
const sc1 = {name: 'sc1', color: '#4460DD', points: '0,0 1.5,-0.5 3,1 0,4 6,2 3,-1 0,-1'};
const sc3 = {name: 'sc3', color: '#4460DD', points: '0,0 0,-1 3,-1 6,2 6,-2 0,-2 -1.5,-0.5'};
const sc5 = {name: 'sc5', color: '#4460DD', points: '0,0 -1.5,-0.5 0,-2 6,-2 0,-4 -3,-1 -1.5,0.5'};
const sc7 = {name: 'sc7', color: '#4460DD', points: '0,0 -1.5,0.5 -3,-1 0,-4 -6,-2 -3,1 0,1'};
const sc9 = {name: 'sc9', color: '#4460DD', points: '0,0 0,1 -3,1 -6,-2 -6,2 0,2 1.5,0.5'};

const sd11 = {name: 'sc11', color: '#4460DD', points: '0,0 2,0 3,1 0,4 -6,2 0,2 1,1'};
const sd1 = {name: 'sd1', color: '#4460DD', points: '0,0 1,-1 3,-1 6,2 0,4 3,1 2,0'};
const sd3 = {name: 'sd3', color: '#4460DD', points: '0,0 -1,-1 0,-2 6,-2 6,2 3,-1 1,-1'};
const sd5 = {name: 'sd5', color: '#4460DD', points: '0,0 -2,0 -3,-1 0,-4 6,-2 0,-2 -1,-1'};
const sd7 = {name: 'sd7', color: '#4460DD', points: '0,0 -1,1 -3,1 -6,-2 0,-4 -3,-1 -2,0'};
const sd9 = {name: 'sd9', color: '#4460DD', points: '0,0 1,1 0,2 -6,2 -6,-2 -3,1 -1,1'};

const ta0 = {name: 'ta0', color: '#22CC88', points: '2,-0.67 .5,-1.17 -1.5,-0.8 -2,0.67 -.5,1.17 1.5,0.83'};
const ta1 = {name: 'ta1', color: '#11AA66', points: '0,4 6,2 2,-0.67'};
const ta3 = {name: 'ta3', color: '#11AA66', points: '6,2 6,-2 .5,-1.17'};
const ta5 = {name: 'ta5', color: '#11AA66', points: '6,-2 0,-4 -1.5,-0.83'};
const ta7 = {name: 'ta7', color: '#11AA66', points: '-0,-4 -6,-2 -2,0.67'};
const ta9 = {name: 'ta9', color: '#11AA66', points: '-6,-2 -6,2 -.5,1.17'};
const ta11 = {name: 'ta11', color: '#11AA66', points: '-6,2 -0,4 1.5,0.83'};

const tb2 = {name: 'tb2', color: '#11AA66', points: '3,3 6,2 6,0 3,-1'};
const tb4 = {name: 'tb4', color: '#11AA66', points: '6,0 6,-2 3,-3 0,-2'};
const tb6 = {name: 'tb6', color: '#11AA66', points: '3,-3 0,-4 -3,-3 -3,-1'};
const tb8 = {name: 'tb8', color: '#11AA66', points: '-3,-3 -6,-2 -6,0 -3,1'};
const tb10 = {name: 'tb10', color: '#11AA66', points: '-6,0 -6,2 -3,3 0,2'};
const tb12 = {name: 'tb12', color: '#11AA66', points: '-3,3 -0,4 3,3 3,1'};

const tc1 = {name: 'tc1', color: '#11AA66', points: '0,2 6,2 1.5,0.5'};
const tc3 = {name: 'tc3', color: '#11AA66', points: '3,-1 6,2 1.5,0.5'};
const tc5 = {name: 'tc5', color: '#11AA66', points: '3,-1 0,-4 0,-1'};
const tc7 = {name: 'tc7', color: '#11AA66', points: '-3,-1 0,-4 0,-1'};
const tc9 = {name: 'tc9', color: '#11AA66', points: '-3,-1 -6,2 -1.5,0.5'};
const tc11 = {name: 'tc11', color: '#11AA66', points: '0,2 -6,2 -1.5,0.5'};

/* eslint-enable no-unused-vars */

// needs work: -1,6 | -1,9 | -1,13
// z1 is out of sight

const hexGridShapes = {
    '-1': {'-1': [e6, czh1, czh7], 0: [f4, f8, a3], 1: [f4, f8, a3], 2: [f4, f8, a3], 3: [f4, f8, a3], 4: [f4, f8, a3],
     5: [wa2, wa6, wa10, a5], 6: [h2, y0, h6wa6, wa10, a5], 7: [x0, y0, a5, h2, h6, h10], 8: [i2, i6, i10, x0, y0, c0], 9: [z0, trap45, trap78, vh12],
     10: [x1, x0, y1, y0, z0, b3, b5, b7, b9, c0], 11: [x1, x0, y1, y0, z0, z4, z5, z6, z7, b5, b7], 12: [yy3, xx9, xx30, yy90, z0], 13: [xx3, zz5, vh10], 14: [yy3, zz7, yy9, v5],
     15: [zz5, xx9, v1]},

    0: {'-1': [w1, f4, fa4], 0: [sc1, sc3, sc5, sc7, sc9, sc11], 1: [sc4, sc8, sc12], 2: [f4, f8, f12, rc2, rc6, rc10], 3: [f4, f8, f12, a2, a6, a10, b55, a555, a54, a58, a512], 4: [f1, f3, f5, f7, f9, f11, a2, a6, a10, b55, a54, a58, a512],
     5: [wa2, wa6, wa10, b55, a54, a58, a512], 6: [wa2, wa6, wa10, a5], 7: [x0, y0, z1, a5, h2, h6, h10], 8: [i2, i6, i10, x0, y0, z1, k2, k6, k10, a5], 9: [i2, i6, i10, x0, y0, z1, c0],
     10: [x1, x0, y1, y0, z1, z0, b1, b3, b5, b7, b9, b11, c0], 11: [x1, x0, y1, y0, z1, z0, z4, z5, z6, z7, b1, b5, b7, b11], 12: [x1, y6, x5, y1, x0, y5, x6, y0, z1, z5, z6, z0], 13: [x1, x2, x9, x0, y1, y3, y8, y0, v3], 14: [xx1, yy5, xx7, yy11, v3],
     15: [x1, x0, y1, y0, z1, z0, v0], 16: [xx1, yy5, xx7, yy11, v3]},

    1: {/**/'-1': [sd1, sd3, sd5, sd7, sd9, sd11], 0: [sb1, sb3, sb5, sb7, sb9, sb11], 1: [sb4, sb8, sb12], 2: [f4, f8, f12, l2, l6, l10], 3: [f4, f8, f12, a2, a6, a10, b55, a54, a58, a512], 4: [wa4, wa8, wa12, b55, a54, a58, a512],
         5: [wa4, wa8, wa12, a5], 6: [wa1, wa3, wa5, wa7, wa9, wa11, a5], 7: [g1, g3, g5, g7, g9, g11, k2, k6, k10, a5], 8: [g1, g3, g5, g7, g9, g11, c0], 9: [g12, g4, g8, c0],
         10: [z1, z2, z3, x8, x9, x0, y8, y9, y0, c0], 11: [x1, x2, y3, y1, x0, x9, y8, y0, z4, z5, z6, z7], 12: [x1, x0, y1, y0, z4, z5, z6, z7, i6, i12], 13: [x1, x0, y1, y0, i6, i12, v3], 14: [xx3, zz5, xx9, zz11, v1],
         15: [zz1, yy3, zz7, yy9, v5]},

    2: {'-1': [tb2, tb4, tb6, tb12, c0], 0: [tb2, tb4, tb6, tb8, tb10, tb12, c0], 1: [sa1, sa3, sa5, sa7, sa9, sa11], 2: [sa4, sa8, sa12], 3: [f4, f8, f12, ra2, ra6, ra10], 4: [f4, f8, f12, a2, a6, a10, a5],
     5: [f4, f8, f12, tc1, tc3, tc5, tc7, tc9, tc11, a5], 6: [e1, e3, e5, e7, e9, e11, a1, a5], 7: [e2, e6, e10, a1, a5], 8: [e2, e6, e10, j4, j8, j12, c0], 9: [e1, e3, e5, e7, e9, e11, j4, j8, j12, c0],
     10: [g12, g4, g8, x4, y4, z7], 11: [z1, z2, z3, x8, y4, x4, y9, z7, x0, x9, y8, y0], 12: [z1, z2, z3, x8, y4, x4, y9, x0, y5, x6, y0, z0], 13: [x1, x0, y1, y0, z5, z6, c6, c12], 14: [x0, y5, x6, y0, z1, z0, uu1, uu2, uu3, uu4],
     15: [x8, x0, z0, y9, y0, g12, u5, u6], 16: [x0, yy11, vg690]},

    3: {/**/'-1': [ef1and2, ef3and4, ef5and6, ef7and8, ef9and10, ef11and12, ca0], 0: [ta0, ta1, ta3, ta5, ta7, ta9, ta11], 1: [w1, w3, w5, w7, w9, w11], 2: [qa1, qa3, qa5, qa7, qa9, qa11, qa2, qa6, qa10, qa0], 3: [qb1, qb3, qb5, qb7, qb9, qb11, qb2, qb6, qb10, qb0], 4: [qc1, qc3, qc5, qc7, qc9, qc11, qc2, qc6, qc10, qc0],
         5: [qd1, qd3, qd5, qd7, qd9, qd11, qd2, qd6, qd10, qd0], 6: [qe1, qe3, qe5, qe7, qe9, qe11, qe2, qe6, qe10, qe0], 7: [qf0, qf2, qf6, qf10], 8: [e1, e3, e5, e7, e9, e11, l4, l8, l12], 9: [e1, e3, e5, e7, e9, e11, j4, j8, j12, z4, x7, y7],
         10: [g12, g4, g8, z4, x7, y7], 11: [z1, z2, z3, z4, x8, x7, y7, y9, x0, x9, y8, y0], 12: [v4x, v8x, v12, x0, x9, y8, y0, z1], 13: [v4, v8, v12, x0, y0, z1], 14: [u4, u8, u12, x1, x0, y1, y0, z1, z0],
         15: [u4, u8, u12, x1, x0, y1, y0, z1, z0]},

    4: {'-1': [e2, e6, a1], 0: [e2, e6, e10, ea2, ea6, ea10], 1: [w1, w3, e6, e10, ea6, ea10], 2: [w1, w3, e6, ea6, w9, w11], 3: [f1, f3, f5, f7, f9, f11, l2, l6, l10], 4: [f1, f3, f5, f7, f9, f11, a3],
     5: [ff11, ff12, ff1, ff3, ff4, ff5, ff7, ff8, ff9, a2, a6, a10, a5], 6: [e2, e5, f8, f11, ag3, ah9], 7: [e2, ef5, ef6, ef7, e10, a1], 8: [e2, ef5, ef6, ef7, e10, ag12, ag12a], 9: [e2, e10, ag12, ag5, ag6, ag7],
     10: [e2, e6, e10, j4, j8, j12, z4, x7, y7], 11: [e2, e6, e10, j4, j8, j12, cc2, cc4, cc6, cc8, cc10, cc12], 12: [x0, y0, z1, i2, i6, i10, cc2, cc4, cc6, cc8, cc10, cc12], 13: [x0, y0, z1, icc2, icc6, icc10, cc4, cc8, cc12], 14: [x0, y0, z1, icca2, icca6, icca10, iccb2, iccb6, iccb10, cc4, cc8, cc12],
     15: [x0, y0, z1, icca2, icca6, icca10, iccb2sq, iccb6sq, iccb10sq, cc4sq, cc8sq, cc12sq, cc0sq], 16: [x0, z1, vg691]},

    5: {/**/'-1': [e2, e6, e10, ea2, ea6, ea10], 0: [e2, ea2, e6, ea6, w9, w11], 1: [f4, fa4, w7, w9, w11, w1], 2: [f4, fa4, f8, fa8, w11, w1], 3: [f4, f8, f1, f11, ah3, ah9], 4: [f4, f8, f12, a3],
        5: [ff11, ff12, ff1, ff3, ff4, ff5, ff7, ff8, ff9, a3], 6: [ef1, ef2, ef3, ef5, ef6, ef7, ef9, ef10, ef11, a1], 7: [ef1and2, ef3, ef5, ef6, ef7, ef9, ef10and11, ag12, ag12a], 8: [ef1and2, ef3, ef430, ef530, ef6, ef7, ef9, ef10and11, ff4, ff8, ag12, ca6], 9: [ef1and2, ef3, ef5, ef6, ef630, ef730, ef9, ef10and11, ff4, ff8, ff12, ca0],
        10: [e2, e6, e10, ff4, ff8, ff12, ca0], 11: [ff4, ff8, ff12, ff4a, ff8a, ff12a, e2b, e6b, e10b], 12: [x0, y0, z1, isec2, isec6, isec10, iarr4, iarr8, iarr12], 13: [x0, y0, z1, isec2, isec6, isec10, iarr330, iarr430, iarr730, iarr830, iarr1130, iarr1230], 14: [x1, x0, y1, y0, z1, z0, iarr130, iarr230, iarr330, iarr430, iarr530, iarr630, iarr730, iarr830, iarr930, iarr1030, iarr1130, iarr1230],
        15: [x0, y1, z1, z0, iarr530, iarr630, iarr730, iarr830, iarr930, iarr1030, iarr1130, iarr1230, w130, w230, w330, w430]},

    6: {'-1': [w1, w4], 0: [cz0], 1: [e2, ea2, w5, w7, e10, ea10], 2: [f4, fa4, w7, w9, f12, fa12], 3: [f4, fa4, f8, fa8, f12, fa12], 4: [f4, f8, f12, a3h1, a3h7],
     5: [ef5, ef6, ef7, f12, ff3and4, ff8and9, a3x6], 6: [ef1, ef2, ef3, ff4, ef5, ef6, ef7, ff8, ef9, ef10, ef11, ff12, ca0], 7: [f12, e6, czh0], 8: [f12, e6, czh6, czh12], 9: [ef1230, ef130, ef2, ef230, ef330, ff4, ef430, ef530, ef6, ef630, ef730, ff8, ef830, ef930, ef10, ef1030, ef1130, ff12, ef2a, ef6a, ef10a, ff4a, ff8a, ff12a],
     10: [ef330, e6, ef830, ef11, ff12, ef1, ag12a, ca12, ef2and230, ef930and10], 11: [icca2, icca4, icca6, icca8, icca10, icca12, cah6, cah12], 12: [icca2, icca4, icca6, icca8, icca10, icca12, winn2, winn4, winn6, winn8, winn10, winn12],
     13: [icca2, icca4, icca6, icca8, icca10, icca12, iccaa4, iccaa8, iccaa12, iarr4, iarr8, iarr12, winn2, winn6, winn10], 14: [icca2, icca4, icca6, icca8, icca10, icca12, iccaa4, iccaa8, iccaa12, iarr330, iarr430, iarr730, iarr830, iarr1130, iarr1230, winn2, winn6, winn10],
     15: [icca2, icca4, icca6, icca8, icca10, icca12, iccaa2, iccaa4, iccaa6, iccaa8, iccaa10, iccaa12, iarr130, iarr230, iarr330, iarr430, iarr530, iarr630, iarr730, iarr830, iarr930, iarr1030, iarr1130, iarr1230], 16: [icca6, icca8, icca10, icca12, winn6, winn8, winn10, winn12]},

    7: {'-1': [w4, w8, w12], 0: [w4, w8, w12], 1: [w4, w8, w12], 2: [f4, fa4, w8, f12, fa12], 3: [f4, fa4, f8, fa8, f12, fa12], 4: [f4, f8, f12, a3h1, a3h7],
        5: [f4, e10, czh04], 6: [e2, f8, czh02], 7: [e2, e10, a1], 8: [f4, e10, czh4, czh10], 9: [e2, f8, czh2, czh8],
        10: [icca2, icca4, issa10, issa11, issa12, issa0], 11: [icca2, icca4, icca8, icca10, icca12, cah4, cah10], 12: [icca2, icca4, icca8, icca10, icca12, winn24, winn6, winn810, winn12],
        13: [icca2, icca4, icca8, icca10, icca12, winn24, winn6, winn810, iccaa12, iarr1130, iarr1230], 14: [icca2, icca4, icca8, icca10, icca12, winn24o, winn24i, winn6, winn810, iccaa12, iarr1130, iarr1230],
        15: [icca2, icca10, icca12, winn24, winn6, winn810o, winn810i, iccaa12, iarr1130, iarr1230]},
};

const hexGridOffsets = {
    '-1': {'-1': '14,-11', 0: '14,-8', 1: '10,-4', 2: '8,-4', 3: '6,-4', 4: '3,-4', 5: '3,-4.8', 6: '3,-4.5', 7: '5,0', 8: '4,0.5', 9: '4.5,2', 10: '6.8,3.5', 11: '7.5,7.5', 12: '8.2,5.8', 13: '8.8,6.9', 14: '13.8,7.5', 15: '17.5,8.5'},

    0: {'-1': '10.1,-11.8', 0: '10.5,-11.2', 1: '6.9,-8.2', 2: '5.9,-8', 3: '5.6,-8.1', 4: '3.9,-7.1', 5: '3.8,-5.8', 6: '2,-6', 7: '3,-1', 8: '5,-0.9', 9: '3.5,0.4', 10: '3.8,0.9', 11: '5.5,3', 12: '5.8,4.8', 13: '7.2,7.4', 14: '9.4,9.2', 15: '14.4,10.2', 16: '16,9'},

    1: {/**/'-1': '9,-11', 0: '7.5,-12.3', 1: '6,-8.4', 2: '4.3,-9', 3: '3,-8.2', 4: '2,-6.9', 5: '1.9,-5.5', 6: '2.5,-3.9', 7: '2.3,-1.8', 8: '1.0,0.1', 9: '1.3,0.2', 10: '2.2,1.7', 11: '5.5,4', 12: '6.7,8', 13: '9.0,9.6', 14: '12.6,12.1', 15: '12.5,12.3'},

    2: {'-1': '5.8,-12', 0: '6.9,-14', 1: '6.6,-12.5', 2: '5.6,-11.1', 3: '3.7,-9.3', 4: '3.1,-9', 5: '1.1,-6.7', 6: '2.2,-5', 7: '1,-4', 8: '0,-1.5', 9: '0,1', 10: '1,2', 11: '2,5', 12: '4.5,7', 13: '7,10.5', 14: '9.5,11.5', 15: '13,13.5', 16: '15,15'},

    3: {/**/'-1': '4.6,-19', 0: '3.4,-15', 1: '1.52,-12.8', 2: '1.0,-11.9', 3: '0.9,-9.5', 4: '0.3,-8.4', 5: '0.9,-5.8', 6: '0.5,-3.5', 7: '-1.5,-3', 8: '-0.5,0', 9: '0.5,2', 10: '1.5,4', 11: '4,5.5', 12: '6,9', 13: '7,12', 14: '11.5,14.5', 15: '15,16.5'},

    4: {'-1': '4,-17', 0: '2.8,-16.5', 1: '1.8,-15.7', 2: '1.2,-13.7', 3: '1.8,-11.0', 4: '1,-8.7', 5: '0,-7.5', 6: '-1,-7', 7: '-2,-4', 8: '-2.5,-2', 9: '-1,0', 10: '0,3', 11: '1,5', 12: '3,8.5', 13: '7,11', 14: '8.5,13.5', 15: '13.5,17', 16: '14,19'},

    5: {/**/'-1': '2,-19', 0: '0,-18.8', 1: '-2.6,-14.8', 2: '-2.8,-13.2', 3: '-3.6,-11.4', 4: '-1.3,-10', 5: '-0.5,-6', 6: '-2,-5.5', 7: '-3,-2.5', 8: '-2.5,-0.5', 9: '-1.5,2', 10: '-0.5,5', 11: '1,8.5', 12: '3.5,11.5', 13: '6,14.5', 14: '9.5,17', 15: '11.5,20'},

    6: {'-1': '2,-21', 0: '0,-20', 1: '-2.6,-18', 2: '-1.6,-16', 3: '-0.2,-13.5', 4: '-0.1,-11', 5: '-1.9,-9.5', 6: '-4,-7', 7: '-4,-4', 8: '-4,-0.5', 9: '-3,2.5', 10: '-2.5,5', 11: '-0.5,8.5', 12: '1,12', 13: '2.5,12.8', 14: '7.5,15.5', 15: '8.5,21', 16: '6,25'},

    7: {'-1': '-1,-23', 0: '-4,-23', 1: '-5,-20.5', 2: '-5,-14.6', 3: '-4.5,-13', 4: '-4,-10.7', 5: '-4,-9', 6: '-4,-7', 7: '-3,-3', 8: '-5,0', 9: '-5,4', 10: '-4,6', 11: '-2,9', 12: '1,12', 13: '2,15', 14: '8,19', 15: '9,23'},
};

const hexGridRotations = {
    '-1': {/**/'-1': 0, '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0.6, '8': 0.6, '9': 0.2, '10': 0.4, '11': 0.6, '12': 0.2, '13': 0.2, '14': 0.4, '15': 0.4},

    '0': {'-1': 0, '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0.8, '7': 1.2, '8': 1.0, '9': 0.4, '10': 0.7, '11': 0.6, '12': 0.6, '13': 0.8, '14': 1.0, '15': 0.4, '16': 0.4},

    '1': {/**/'-1': 0, '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0.8, '7': 0.8, '8': 0.8, '9': 0.5, '10': 0.5, '11': 0.2, '12': 0.8, '13': 0.4, '14': 0.4, '15': 0.4},

    '2': {'-1': 0, '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0.6, '7': 0.2, '8': 0.4, '9': 0.4, '10': 0.6, '11': 0.8, '12': 0.4, '13': 0.4, '14': 0.4, '15': 0.6, '16': 0.6},

    '3': {/**/'-1': 0, '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0.4, '7': 0.6, '8': 0.8, '9': 0.6, '10': 0.6, '11': 0.8, '12': 1, '13': 0.4, '14': -0.6, '15': 0.4},

    '4': {'-1': 0.6, '0': 0.6, '1': 0.6, '2': 0.6, '3': 0.6, '4': 0.6, '5': 0.6, '6': 0.8, '7': 1.0, '8': 1.2, '9': 1.0, '10': 1.0, '11': 1.0, '12': 1.0, '13': 0.6, '14': 0.6, '15': 0.2, '16': 0},

    '5': {/**/'-1': 0.6, '0': 0.6, '1': 0.6, '2': 0.6, '3': 0.6, '4': 0.6, '5': 0.6, '6': 1.0, '7': 1.5, '8': 0.9, '9': 1.0, '10': 1.0, '11': 1.3, '12': 0.6, '13': 0.8, '14': 0.9, '15': 1.6},

    '6': {'-1': 0.6, '0': 0.6, '1': 0.6, '2': 0.6, '3': 0.6, '4': 0.8, '5': 0.8, '6': 1.0, '7': 1.2, '8': 1.2, '9': 1.0, '10': 1.4, '11': 1.0, '12': 1.3, '13': 0.9, '14': 1.0, '15': 1.1, '16': 1.1},

    '7': {/**/'-1': 0.6, '0': 0.6, '1': 0.6, '2': 0.6, '3': 0.6, '4': 0.6, '5': 0.6, '6': 0.6, '7': 0.6, '8': 0.6, '9': 1.0, '10': 1.0, '11': 1.0, '12': 1.0, '13': 1.0, '14': 1.0, '15': 1.0},
};

const hexGridScales = {
    '-1': {/**/'-1': 1, '0': 1, '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 0.98, '8': 0.98, '9': 1.0, '10': 0.98, '11': 0.95, '12': 1, '13': 1.02, '14': 1.03, '15': 1.02},

    '0': {'-1': 1, '0': 1, '1': 1, '2': 1.02, '3': 1.01, '4': 1, '5': 1, '6': 1, '7': 1.02, '8': 1.02, '9': 1, '10': 1, '11': 0.99, '12': 1.02, '13': 1, '14': 1.03, '15': 1.05, '16': 1.02},

    '1': {/**/'-1': 1, '0': 1, '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1, '8': 1, '9': 1, '10': 1, '11': 1, '12': 1.01, '13': 1, '14': 1.01, '15': 1.03},

    '2': {'-1': 0.97, '0': 0.95, '1': 0.96, '2': 0.97, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1, '8': 1, '9': 1, '10': 1, '11': 1, '12': 1, '13': 1, '14': 1, '15': 1, '16': 1},

    '3': {/**/'-1': 1, '0': 1, '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1, '8': 1, '9': 1, '10': 1.01, '11': 1.02, '12': 1, '13': 1.01, '14': 1.01, '15': 1.03},

    '4': {'-1': 1, '0': 1, '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1, '8': 1.01, '9': 1, '10': 1, '11': 1.01, '12': 1.01, '13': 1.01, '14': 1.02, '15': 1.01, '16': 1.02},

    '5': {/**/'-1': 1, '0': 1, '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1, '8': 1, '9': 1.02, '10': 1.01, '11': 1.02, '12': 1, '13': 1.01, '14': 1.02, '15': 1.02},

    '6': {'-1': 1, '0': 1, '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1.01, '7': 1.01, '8': 1, '9': 1.02, '10': 1.02, '11': 1.01, '12': 1.01, '13': 1.01, '14': 1.02, '15': 1.02, '16': 1.02},

    '7': {/**/'-1': 1, '0': 1, '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1, '8': 1, '9': 1, '10': 1, '11': 1, '12': 1, '13': 1, '14': 1, '15': 1},
};

const scalePointX = x => x * 1 / 12;
const scalePointY = y => -y * 1 / 8 * 4 / 3 * Y_AXIS_SCALE;

const processShapeIfNeeded = function(shape) {
    if (shape.processed) {
        return;
    }

    shape.processed = true;
    const pointsUnscaled = _.filter(shape.points.split(' ')).map(x => x.split(',').map(Number));
    shape.pointsUnscaled = pointsUnscaled;
    const points = pointsUnscaled.map(([x, y]) => [scalePointX(x), scalePointY(y)]);
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

const splitIntoPieces = function(edgeSignature) {
    const [p1, p2] = JSON.parse(edgeSignature);

    const pieceSignatures = [];
    for (let numSubdivisions = 1; numSubdivisions <= 4; numSubdivisions++) {
        for (let subdivision = 0; subdivision < numSubdivisions; subdivision++) {
            for (let numerator = 1; subdivision + numerator <= numSubdivisions; numerator++) {
                const lerp1 = subdivision / numSubdivisions;
                const subP1 = [lerp(p1[0], p2[0], lerp1), lerp(p1[1], p2[1], lerp1)];
                const lerp2 = (subdivision + numerator) / numSubdivisions;
                const subP2 = [lerp(p1[0], p2[0], lerp2), lerp(p1[1], p2[1], lerp2)];
                pieceSignatures.push(JSON.stringify([subP1, subP2]));
            }
        }
    }

    return pieceSignatures;
};

/* eslint-disable */
const edgeChannels = [
    {
        channel: CYAN,
        edgeSignatures: [
            '[[0,4],[6,2]]',
            '[[0,-4],[6,-2]]',
            '[[6,2],[6,-2]]',
        ],
    },
    {
        channel: PINK,
        edgeSignatures: [
            // vertical radial lines
            '[[0,0],[6,2]]',
            '[[0,0],[0,-4]]',
            '[[-6,2],[0,0]]',
            '[[0,0],[6,-2]]',
            '[[0,4],[0,0]]',
            '[[-6,-2],[0,0]]',

            '[[0,4],[0,-4]]', // full vertical
            '[[-6,-2],[6,2]]',
            '[[-6,2],[6,-2]]',

            // for qa-series and qb-qe-series
            '[[0,4],[0,0.67]]', '[[0,4],[0,1.33]]',
            '[[-6,-2],[-1,-0.33]]', '[[-6,-2],[-2,-0.67]]',
            '[[1,-0.33],[6,-2]]', '[[2,-0.67],[6,-2]]',

            // horizontal radial lines
            '[[-6,0],[0,0]]',
            '[[-3,3],[0,0]]',
            '[[-3,-3],[0,0]]',
            '[[0,0],[6,0]]',
            '[[0,0],[3,3]]',
            '[[0,0],[3,-3]]',

            '[[-6,0],[6,0]]',
            '[[-4,0],[4,0]]',
            '[[-3,-3],[3,3]]',
            '[[-3,3],[3,-3]]',
        ],
    },
    {
        channel: ORANGE,
        edgeSignatures: [
            // central vertical hexagons
            '[[-3,1],[-3,-1]]',
            '[[-3,-1],[0,-2]]',
            '[[0,-2],[3,-1]]',
            '[[-3,1],[0,2]]',
            '[[0,2],[3,1]]',
            '[[3,1],[3,-1]]',

            // downward large triangles
            '[[-6,2],[0,-4]]',
            '[[-6,2],[6,2]]',
            '[[0,-4],[6,2]]',

            // outer horizontal hexagons in lower right
            '[[-6,0],[-3,3]]',
            '[[-3,3],[3,3]]',
            '[[3,3],[6,0]]',
            '[[-6,0],[-3,-3]]',
            '[[-3,-3],[3,-3]]',
            '[[3,-3],[6,0]]',
        ],
    },
    {
        channel: RED,
        edgeSignatures: [
            '[[-6,-2],[0,4]]',
            '[[-6,-2],[6,-2]]',
            '[[0,4],[6,-2]]',

            '[[-3,-1],[0,2]]',
            '[[-3,-1],[3,-1]]',
            '[[0,2],[3,-1]]',

            '[[-3,3],[0,2]]', '[[0,2],[3,3]]',
            '[[-6,0],[-3,-1]]', '[[-3,-1],[-3,-3]]',
            '[[3,-1],[6,0]]', '[[3,-1],[3,-3]]',

            '[[-3,-3],[0,-2]]', '[[0,-2],[3,-3]]',
            '[[-6,0],[-3,1]]', '[[-3,3],[-3,1]]',
            '[[3,1],[6,0]]', '[[3,3],[3,1]]',
        ],
    },
];
/* eslint-enable */

const edgeChannelsByEdgeSignature = {};
for (const edgeChannel of edgeChannels) {
    for (const edgeSignature of edgeChannel.edgeSignatures) {
        for (const pieceSignature of splitIntoPieces(edgeSignature)) {
            edgeChannelsByEdgeSignature[pieceSignature] = edgeChannel.channel;
        }
    }
}

const processEdgesInShapes = function(shapes, hexCoords) {
    const edges = [];

    const edgeSignaturesAlreadyProcessed = {
        '[[0,4],[6,2]]': true,
        '[[0,-4],[6,-2]]': true,
        '[[6,2],[6,-2]]': true,

        '[[-6,2],[0,4]]': true,
        '[[-6,-2],[0,-4]]': true,
        '[[-6,2],[-6,-2]]': true,

        '[[0,4],[3,3]]': true,
        '[[3,3],[6,2]]': true,
        '[[0,-4],[3,-3]]': true,
        '[[3,-3],[6,-2]]': true,
        '[[6,2],[6,0]]': true,
        '[[6,0],[6,-2]]': true,

        '[[-6,2],[-3,3]]': true,
        '[[-3,3],[0,4]]': true,
        '[[-6,-2],[-3,-3]]': true,
        '[[-3,-3],[0,-4]]': true,
        '[[-6,2],[-6,0]]': true,
        '[[-6,0],[-6,-2]]': true,
    };

    for (const edgeSignature of [
        '[[0,4],[6,2]]',
        '[[0,-4],[6,-2]]',
        '[[6,2],[6,-2]]',
    ]) {
        const [p1, p2] = JSON.parse(edgeSignature);
        edges.push({
            x1: scalePointX(p1[0]),
            y1: scalePointY(p1[1]),
            x2: scalePointX(p2[0]),
            y2: scalePointY(p2[1]),
            center: [scalePointX((p1[0] + p2[0]) / 2), scalePointY((p1[1] + p2[1]) / 2)],
            channel: edgeChannelsByEdgeSignature[edgeSignature],
        });
    }

    for (const shape of shapes) {
        if (_.includes(shape.skipEdgesOnHexCoords, hexCoords)) {
            continue;
        }

        const numPoints = shape.pointsUnscaled.length;
        for (let i = 0; i < numPoints; i++) {
            let p1 = shape.pointsUnscaled[i];
            let p2 = shape.pointsUnscaled[(i + 1) % numPoints];

            // normalize so p1 is always to the left of and above p2
            if (p1[0] > p2[0] || (p1[0] === p2[0] && p1[1] < p2[1])) { // SIC
                [p1, p2] = [p2, p1];
            }

            const edgeSignature = JSON.stringify([p1, p2]);

            if (edgeSignaturesAlreadyProcessed[edgeSignature]) {
                continue;
            }
            edgeSignaturesAlreadyProcessed[edgeSignature] = true;

            edges.push({
                x1: scalePointX(p1[0]),
                y1: scalePointY(p1[1]),
                x2: scalePointX(p2[0]),
                y2: scalePointY(p2[1]),
                center: [scalePointX((p1[0] + p2[0]) / 2), scalePointY((p1[1] + p2[1]) / 2)],
                channel: edgeChannelsByEdgeSignature[edgeSignature] || shape.edgeChannel || ORANGE,
            });
        }
    }

    return edges;
};

const hexGrid = _.mapValues(hexGridShapes, (row, rowIndex) => _.mapValues(row, (shapes, colIndex) => {

    shapes.forEach(processShapeIfNeeded);

    const edges = processEdgesInShapes(shapes, `${rowIndex},${colIndex}`);

    return {
        shapes: shapes,
        edges: edges,
        offsets: hexGridOffsets[rowIndex][colIndex].split(',').map(Number).map(x => (USE_OFFSETS ? x / 100 : 0)),
        rotation: USE_OFFSETS ? hexGridRotations[rowIndex][colIndex] : 0,
        scale: USE_OFFSETS ? hexGridScales[rowIndex][colIndex] : 1,
    };
}));

module.exports = hexGrid;
