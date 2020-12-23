import Board from './Board';
import Piece from '../pieces';

export enum SQUARE_FLAGS {
  x9, a9, b9, c9, d9, e9, f9, g9, h9, y9,
  x8, a8, b8, c8, d8, e8, f8, g8, h8, y8,
  x7, a7, b7, c7, d7, e7, f7, g7, h7, y7,
  x6, a6, b6, c6, d6, e6, f6, g6, h6, y6,
  x5, a5, b5, c5, d5, e5, f5, g5, h5, y5,
  x4, a4, b4, c4, d4, e4, f4, g4, h4, y4,
  x3, a3, b3, c3, d3, e3, f3, g3, h3, y3,
  x2, a2, b2, c2, d2, e2, f2, g2, h2, y2,
  x1, a1, b1, c1, d1, e1, f1, g1, h1, y1,
  x0, a0, b0, c0, d0, e0, f0, g0, h0, y0,
};
export type SquareName = keyof typeof SQUARE_FLAGS;

export default abstract class Bhoomi {
  protected isNaaglok = false;
  protected isRajkila = false;
  protected isViramBhumi = false;
  protected isYuddhBhumi = false;
  candidatePieces: Set<Piece> = new Set();

  constructor(readonly board: Board, readonly name: SquareName) {

  }

  get index() {
    return SQUARE_FLAGS[this.name];
  }
  get piece() {
    return this.board.builder.config[this.index];
  }
  get isOccupied() {
    return !this.isEmpty;
  }
  get isEmpty() {
    return this.piece === null;
  }
}

export class Naaglok extends Bhoomi {
  isNaaglok = true;
  constructor(board: Board, name: SquareName) {
    super(board, name);
  }
}

export class Rajkila extends Bhoomi {
  isRajkila = true;
  constructor(board: Board, name: SquareName) {
    super(board, name);
  }
}

export class ViramBhoomi extends Bhoomi {
  isViramBhumi = true;
  constructor(board: Board, name: SquareName) {
    super(board, name);
  }
}

export class YuddhBhoomi extends Bhoomi {
  isYuddhBhumi = true;
  constructor(board: Board, name: SquareName) {
    super(board, name);
  }
}

// Rajrishi - naarad
// raja => royal member