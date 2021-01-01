export const BOARD_SIZE = 10;
export const TOTAL_SQUARES = BOARD_SIZE ** 2;

export const NEIGHBOURS = Object.freeze([
  -BOARD_SIZE - 1, -BOARD_SIZE, -BOARD_SIZE + 1,
  -1, 1,
  BOARD_SIZE - 1, BOARD_SIZE, BOARD_SIZE + 1
]);

function negatives(array: number[]) {
  array.forEach((n, _, arr) => arr.push(-n));
}
export const DEFAULT_FEN = '0c1ir1c0/cmhgasghmc/cppppppppc/9/9/9/9/CPPPPPPPPC/CMHGASGHMC/0C1IR1C0';
export const PLUS = Object.freeze([BOARD_SIZE, 1, -1, -BOARD_SIZE]);
export const CROSS = Object.freeze([BOARD_SIZE - 1, BOARD_SIZE + 1, -BOARD_SIZE - 1, -BOARD_SIZE + 1]);

const DOUBLE = BOARD_SIZE * 2;
export const KNIGHT = Object.freeze([
  -DOUBLE - 1, -DOUBLE + 1,
  -BOARD_SIZE - 2, -BOARD_SIZE + 2,
  BOARD_SIZE - 2, BOARD_SIZE + 2,
  DOUBLE - 1, DOUBLE + 1
]);

export enum EVENT { MOVE = 'move', END = 'end', START = 'start', READY = 'ready', DEBUG = 'debug' };

export const BOARD_LAYOUT = Array<string>((BOARD_SIZE + 1) ** 2).fill('·')
  .map((val, i) => i % (BOARD_SIZE + 1) ? val : `│\n${ 9 - (i / BOARD_SIZE | 0) } │`);
BOARD_LAYOUT[1] = BOARD_LAYOUT[10] = BOARD_LAYOUT[100] = BOARD_LAYOUT[109] = '#';
const temp = '   ' + '-'.repeat(32);
BOARD_LAYOUT[110] = `│\n${ temp }\n   `;
BOARD_LAYOUT[0] = temp + BOARD_LAYOUT[0].slice(1);
for (let i = 111, str = 'xabcdefghy'; i < 121; i++) {
  BOARD_LAYOUT[i] = str[i - 111];
}
