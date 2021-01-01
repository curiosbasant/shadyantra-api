import { Board } from '.';
import { Piece, Post } from '../pieces';
import { Alliance } from '../player';
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
export type ZoneName = 'Castle' | 'Forbidden Zone' | 'War Zone' | 'Truce Zone' | 'Mediate Zone';
export class Zone {
  static readonly CASTLE = new Zone('Castle');
  static readonly FORBIDDEN_ZONE = new Zone('Forbidden Zone');
  static readonly WAR_ZONE = new Zone('War Zone');
  static readonly TRUCE_ZONE = new Zone('Truce Zone');
  static readonly MEDIATE_ZONE = new Zone('Mediate Zone');
  constructor(readonly name: ZoneName) {

  }
}
export default abstract class Square {
  candidatePieces = new Set<Piece>();
/** Returns the nearby square of the same zone */

  constructor(readonly board: Board, private readonly zone: Zone, readonly name: SquareName) {
  }
  
  getNearbySquare(relativeIndex: number) {
    return this.board.getSquareAt(this.index + relativeIndex) || null;
  }

  /** Checks if other square is of same zone  */
  isZoneSame(square: Square | null) {
    return this.zone === square?.zone;
  }

/** Checks if other square is a neighbour  */
  isNearbySquare(square: Square) {
    const differenceIndex = this.index - square.index;
    return NEIGHBOURS.includes(differenceIndex);
  }
  
  private isPostNearby(post: Post) {
    return NEIGHBOURS.some(index => {
      const neighbourSquare = this.getNearbySquare(index)!;
      return this.isZoneSame(neighbourSquare) &&
        this.piece!.isOwnSide(neighbourSquare.piece) &&
        neighbourSquare.piece!.type.post == post;
    });
  }
/** Checks if any Officer is nearby in same zone */
  isOfficerNearby() {
    return this.isPostNearby(Post.OFFICER);
  }
/** Checks if any Royal is nearby in same zone */
  isRoyalNearby() {
    return this.isPostNearby(Post.ROYAL);
  }
  isOpponentRoyalNearby() {
    return NEIGHBOURS.some(index => {
      const neighbourSquare = this.getNearbySquare(index)!;
      return this.isZoneSame(neighbourSquare) &&
        this.piece!.isEnemyOf(neighbourSquare.piece) &&
        neighbourSquare.piece!.isRoyal;
    });
  }

/** Checks if any Godman is nearby  */
  isGodmanNearby() {

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

  get isMediateZone() {
    return this.zone == Zone.MEDIATE_ZONE;
  }
  get isWarZone() {
    return this.zone == Zone.WAR_ZONE;
  }
  get isTruceZone() {
    return this.zone == Zone.TRUCE_ZONE;
  }
  get isCastle() {
    return this.zone == Zone.CASTLE;
  }
  get isForbiddenZone() {
    return this.zone == Zone.FORBIDDEN_ZONE;
  }
}

export class MediateZone extends Square {
  constructor(board: Board, name: SquareName, readonly alliance: Alliance) {
    super(board, Zone.MEDIATE_ZONE, name);
  }
}
export class WarZone extends Square {
  constructor(board: Board, name: SquareName) {
    super(board, Zone.WAR_ZONE, name);
  }
}
export class CastleZone extends Square {
  constructor(board: Board, name: SquareName, readonly alliance: Alliance) {
    super(board, Zone.CASTLE, name);
  }
}

export class TruceZone extends Square {
  constructor(board: Board, name: SquareName) {
    super(board, Zone.TRUCE_ZONE, name);
  }
  getNearbySquare(relativeIndex: number) {
    const neighbourSquare = this.board.getSquareAt(this.index + relativeIndex);
    if (!neighbourSquare) return null;
    if (this.file == 'x') {
      if (neighbourSquare.file == 'y') return null;
    } else { // if file = 'y'
      if (neighbourSquare.file == 'x') return null;
    }
    return neighbourSquare;
  }
}
export class ForbiddenZone extends Square {
  constructor(board: Board, name: SquareName) {
    super(board, Zone.FORBIDDEN_ZONE, name);
  }
  getNearbySquare(relativeIndex: number) {
    const neighbourSquare = this.board.getSquareAt(this.index + relativeIndex);
    return (
      !neighbourSquare || neighbourSquare.isForbiddenZone ||
      neighbourSquare.isTruceZone && this.file != neighbourSquare.file
    ) ? null : neighbourSquare;
  }
}

// Rajrishi - naarad
// raja => royal member