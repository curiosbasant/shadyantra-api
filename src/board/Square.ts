import { Board } from '.';
import { Piece } from '../pieces';
import { NEIGHBOURS } from '../Utils';


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
export type ZoneName = 'raajkila' | 'naaglok' | 'yuddhbhumi' | 'viranbhumi';
export class Zone {
  static readonly RAAJKILA = new Zone('raajkila');
  static readonly NAAGLOK = new Zone('naaglok');
  static readonly YUDDHBHUMI = new Zone('yuddhbhumi');
  static readonly VIRANBHUMI = new Zone('viranbhumi');
  constructor(readonly name: ZoneName) {

  }
}
export default abstract class Square {
  isNaaglok = false;
  isRajkila = false;
  isViramBhumi = false;
  isYuddhBhumi = false;
  candidatePieces: Set<Piece> = new Set();
  abstract nearbySquare(relativeIndex: number): Square | null;

  constructor(readonly zone: Zone, readonly board: Board, readonly name: SquareName) {

  }

  isOfSameZoneAs(square: Square) {
    return this.zone == square.zone;
  }

  isNearbySquare(square: Square) {

  }

  get isOfficerNearby() {
    return true;
  }
  get isRoyalNearby() {
    return NEIGHBOURS.some(index => {
      const neighbourSquare = this.nearbySquare(index);
      if (!neighbourSquare || !this.isOfSameZoneAs(neighbourSquare)) return false;
      return neighbourSquare.piece?.isRoyal;
    });
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
  get file() {
    return this.name[0];
  }
  get rank() {
    return this.name[1];
  }
}

export class YuddhBhoomi extends Square {
  isYuddhBhumi = true;
  constructor(board: Board, name: SquareName) {
    super(Zone.YUDDHBHUMI, board, name);
  }
  nearbySquare(relativeIndex: number) {
    return this.board.getSquareAt(this.index + relativeIndex)!;
  }
}

export class Rajkila extends Square {
  isRajkila = true;
  constructor(board: Board, name: SquareName) {
    super(Zone.RAAJKILA, board, name);
  }

  nearbySquare(relativeIndex: number) {
    const neighbourSquare = this.board.getSquareAt(this.index + relativeIndex);
    return !neighbourSquare ? null : neighbourSquare;
  }
}

export class ViramBhoomi extends Square {
  isViramBhumi = true;
  constructor(board: Board, name: SquareName) {
    super(Zone.VIRANBHUMI, board, name);
  }

  nearbySquare(relativeIndex: number) {
    const neighbourSquare = this.board.getSquareAt(this.index + relativeIndex)!;
    return neighbourSquare.isViramBhumi ? null : neighbourSquare;
  }
}

export class Naaglok extends Square {
  isNaaglok = true;
  constructor(board: Board, name: SquareName) {
    super(Zone.NAAGLOK, board, name);
  }

  nearbySquare(relativeIndex: number) {
    const neighbourSquare = this.board.getSquareAt(this.index + relativeIndex);
    return (
      !neighbourSquare || neighbourSquare.isNaaglok ||
      neighbourSquare.isViramBhumi && this.name[0] != neighbourSquare.name[0]
    ) ? null : neighbourSquare;
  }
}

// Rajrishi - naarad
// raja => royal member