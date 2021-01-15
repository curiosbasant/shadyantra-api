import { AttackMove, Board, Move, NormalMove, SuicideMove, WeakMove } from '.';
import { Piece } from '../pieces';
import { Alliance } from '../player';
import { ADJACENT_DIRECTION } from '../Utils';


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

export default abstract class Square {
  candidatePieces = new Set<Piece>();
  #attackers = new Set<Piece>();
  #dominators = new Set<Piece>();
  restrictedPieces = new Set<Piece>();
  isRoyalNearby = false;
  isOfficerNearby = false;

  constructor(readonly board: Board, readonly name: SquareName, readonly alliance: Alliance) { }

  /** Returns the nearby square from this square*/
  getNearbySquare(relativeIndex: number) {
    return this.board.getSquareAt(this.index + relativeIndex) || null;
  }

  /** Checks if other square is of same zone  */
  isZoneSame(square: Square | null) {
    return this.constructor === square?.constructor;
  }

  /** Checks if other square is a neighbour  */
  isNearbySquare(square: Square) {
    const differenceIndex = this.index - square.index;
    return ADJACENT_DIRECTION.includes(differenceIndex);
  }

  /** Checks if any Opponent's Royal Member is on any Surrounding Squares */
  isOpponentRoyalNearby() {
    return ADJACENT_DIRECTION.some(index => {
      const neighbourSquare = this.getNearbySquare(index)!; // fake !
      return this.isZoneSame(neighbourSquare) &&    // returns false if NS is null
        neighbourSquare.piece.isRoyal &&
        this.piece.isEnemyOf(neighbourSquare.piece);
    });
  }
  freeze() {
    this.board.setSquare(new MediateZone(this.board, this.name, this.alliance));
  }

  addDominantPiece(piece: Piece) {
    this.#dominators.add(piece);
  }
  restrictPieceToMove(piece: Piece) {
    this.restrictedPieces.add(piece);
  }
  
  addAttacker(piece: Piece) {
    this.#attackers.add(piece);
  }
  isAttackedBy(piece: Piece) {
    this.#attackers.has(piece);
  }

  get isInAttack() {
    return Boolean(this.#attackers.size);
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
    return this.piece.isNull;
  }
  get isOfMine() {
    return this.alliance == this.board.activePlayer.alliance;
  }
  get isOfOpponent() {
    return !this.isOfMine;
  }
  get file() {
    return this.name[0];
  }
  get rank() {
    return +this.name[1];
  }

  get isWarZone() {
    return this instanceof WarZone;
  }
  get isTruceZone() {
    return this instanceof TruceZone;
  }
  get isMediateZone() {
    return this instanceof MediateZone;
  }
  get isCastle() {
    return this instanceof CastleZone;
  }
  get isMyCastle() {
    return this.isCastle && this.isOfMine;
  }
  get isForbiddenZone() {
    return this instanceof ForbiddenZone;
  }

  /** Returns boolean if to break the loop */
  abstract createMove(moves: Move[], originSquare: Square): boolean;
  createWeakMove(moves: Move[], originSquare: Square) {
    this.isEmpty && moves.push(new WeakMove(originSquare.piece, this));
    return this.isOccupied;
  }
  protected createDominatingMove(moves: Move[], originSquare: Square) {
    if (this.isEmpty) {
      moves.push(new NormalMove(originSquare.piece, this));
    } else if (originSquare.piece.isDominantOn(this)) {
      moves.push(new AttackMove(originSquare.piece, this));
    }
    return this.isOccupied;
  }
}

export class WarZone extends Square {
  createMove(moves: Move[], originSquare: Square) {
    return originSquare.isTruceZone ?
      this.createWeakMove(moves, originSquare) || true :
      this.createDominatingMove(moves, originSquare);
  }
}

export class TruceZone extends Square {
  createMove(moves: Move[], originSquare: Square) {
    return this.createWeakMove(moves, originSquare);
  }
  createWeakMove(moves: Move[], originSquare: Square): true {
    return originSquare.isTruceZone || super.createWeakMove(moves, originSquare) || true;
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

export class CastleZone extends Square {
  createMove(moves: Move[], originSquare: Square): true {
    return originSquare.piece.isRoyal && this.createDominatingMove(moves, originSquare) || true;
  }
  createWeakMove(moves: Move[], originSquare: Square): true {
    if (originSquare.piece.isRoyal || originSquare.piece.isGodman && this.isMyCastle)
      super.createWeakMove(moves, originSquare);
    return true;
  }
}

export class MediateZone extends Square {
  createMove(moves: Move[], originSquare: Square) {
    // If coming from MZ -> false; TZ -> true; OZ -> makes weak move
    return !originSquare.isMediateZone && (this.createWeakMove(moves, originSquare) || originSquare.isTruceZone);
    // return originSquare.isMediateZone ? false : this.createWeakMove(moves, originSquare) || originSquare.isTruceZone;
  }
}

export class ForbiddenZone extends Square {
  createMove(moves: Move[], originSquare: Square): true {
    const Mover = originSquare.piece.isGodman ? NormalMove : SuicideMove;
    moves.push(new Mover(originSquare.piece, this));
    return true;
  }
  createWeakMove(moves: Move[], originSquare: Square) {
    return this.createMove(moves, originSquare);
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