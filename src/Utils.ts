export const BOARD_SIZE = 10;
export const TOTAL_SQUARES = BOARD_SIZE * BOARD_SIZE;

export const NEIGHBOURS = Object.freeze([
  -BOARD_SIZE - 1, -BOARD_SIZE, -BOARD_SIZE + 1,
  -1, 1,
  BOARD_SIZE - 1, BOARD_SIZE, BOARD_SIZE + 1
]);

export const PLUS = Object.freeze([BOARD_SIZE, 1, -1, -BOARD_SIZE]);
export const CROSS = Object.freeze([BOARD_SIZE - 1, BOARD_SIZE + 1, -BOARD_SIZE - 1, -BOARD_SIZE + 1]);

const DOUBLE = BOARD_SIZE * 2;
export const KNIGHT = Object.freeze([
  -DOUBLE - 1, -DOUBLE + 1,
  -BOARD_SIZE - 2, -BOARD_SIZE + 2,
  BOARD_SIZE - 2, BOARD_SIZE + 2,
  DOUBLE - 1, DOUBLE + 1
]);