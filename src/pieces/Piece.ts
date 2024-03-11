import { OfficerPiece, PieceFactory, PieceNotation, PieceSymbol, Pyada, Rajrishi, RoyalPiece } from '.';
import { Board, Move, Square } from '../board';
import { Alliance } from '../player';
import { BOARD_SIZE } from '../Utils';

export type PIECE_CLASS = { new(...args: [number, Alliance]): Piece; };
export class PieceType {
  constructor(readonly symbol: PieceSymbol, readonly name: string, readonly value: number, readonly MAX_PARITY: number) { }
}

export default abstract class Piece {
  static readonly RAJENDRA = new PieceType('I', 'rajendra', 9, 1);
  static readonly RAJENDRAW = new PieceType('J', 'rajendra', 9, 1);
  static readonly ARTHSHASTRI = new PieceType('A', 'arthshastri', 8, 1);
  static readonly RAJRISHI = new PieceType('R', 'rajrishi', 7, 1);
  static readonly SENAPATI = new PieceType('S', 'senapati', 6, 1);
  static readonly MAHARATHI = new PieceType('M', 'maharathi', 5, 2);
  static readonly ASHVAROHI = new PieceType('H', 'ashvarohi', 4, 2);
  static readonly GAJAROHI = new PieceType('G', 'gajarohi', 3, 2);
  static readonly GUPTCHAR = new PieceType('C', 'guptchar', 2, 6);
  static readonly PYADA = new PieceType('P', 'pyada', 1, 8);
  static readonly NULL_PIECE = null as unknown as NullPiece;

  static readonly STRENGTH_ORDER = Object.freeze([
    Piece.GUPTCHAR, Piece.GAJAROHI, Piece.ASHVAROHI, Piece.MAHARATHI, Piece.SENAPATI
  ]);

  abstract calculateLegalMoves(currentSquare: Square, toRetreat: boolean): Move[];
  abstract moveTo(move: Move): Piece;

  readonly notation: PieceNotation;
  // nearbyOfficers = new Set<Piece>();
  // nearbyRoyals = new Set<Piece>();

  constructor(readonly type: PieceType, readonly position: number, readonly alliance: Alliance) {
    this.notation = type.symbol[alliance == Alliance.WHITE ? 'toUpperCase' : 'toLowerCase']() as PieceNotation;
  }

  square(board: Board) {
    return board.getSquareAt(this.position)!;
  }

  private mote(sign: -1 | 1) {
    const index = this.type.value - 2;
    const nextRank = Piece.STRENGTH_ORDER[index + sign];
    if (!nextRank) {
      throw new Error(`Cannot ${ sign < 1 ? 'de' : 'pro' }mote ${ this.type.name }`);
    }
    return PieceFactory.Create(this.notation, this.position);
  }
  /** Promotes the piece  */
  promote() {
    return this.mote(1);
  }
  /** Demotes the piece  */
  demote() {
    return this.mote(-1);
  }
  couldBePromoted() {

  }
  isDominantOn(destinationSquare: Square) {
    return this.isEnemyOf(destinationSquare.piece) && !destinationSquare.piece.isGodman;
  }

  /** Checks if other piece is of same side  */
  isFriendly(piece: Piece) {
    return !piece.isNull && this.alliance === piece.alliance;
  }
  isEnemyOf(piece: Piece) {
    return !piece.isNull && this.alliance !== piece.alliance;
  }

  protected _trishoolMovement(moves: Move[], originSquare: Square, direction: number, isWeak = false) {
    const fun = (relativeIndex: number) => {
      const destinationSquare = originSquare.getNearbySquare(relativeIndex + direction);
      isWeak ?
        destinationSquare?.createWeakMove(moves, originSquare) :
        destinationSquare?.createMove(moves, originSquare);
      return fun;
    };
    const adjacentIndex = Math.abs(direction) == 1 ? BOARD_SIZE : 1;
    fun(-adjacentIndex)(0)(adjacentIndex);
  }

  protected isWeak(resourceSquare: Square): boolean | null {
    return true;
  }
  protected trishoolMovement(moves: Move[], currentSquare: Square, headDir: number, toRetreat = false) {
    const resourceSquare = currentSquare.getNearbySquare(headDir)!; // fake !
    if (this.isBlocked(resourceSquare)) return;
    const destinationSquare = resourceSquare.getNearbySquare(headDir);
    if (!destinationSquare || toRetreat && destinationSquare.isOfOpponent) return;

    const isWeak = this.isWeak(resourceSquare),
      sideDir = Math.abs(headDir) == 1 ? this.alliance.direction.forward : 1;
    this.knightMove(moves, currentSquare, headDir * 2 - sideDir, isWeak ?? false);
    isWeak != null && this.knightMove(moves, currentSquare, headDir * 2, isWeak);
    this.knightMove(moves, currentSquare, headDir * 2 + sideDir, isWeak ?? false);
  }
  protected isBlocked(frontSquare: Square | null) {
    return this.isEnemyOf(frontSquare!.piece);
  }
  protected knightMove(moves: Move[], currentSquare: Square, direction: number, isWeak = false) {
    const destinationSquare = currentSquare.getNearbySquare(direction);
    isWeak ?
      destinationSquare?.createWeakMove(moves, currentSquare) :
      destinationSquare?.createMove(moves, currentSquare);
  }

  isFriendlyRoyal(piece: Piece) {
    return piece.isRoyal && this.isFriendly(piece);
  }
  isFriendlyOfficer(piece: Piece) {
    return piece.isOfficer && this.isFriendly(piece);
  }
  get isRoyal() {
    return this instanceof RoyalPiece;
  }
  get isOfficer() {
    return this instanceof OfficerPiece;
  }
  get isGodman() {
    return this instanceof Rajrishi;
  }
  get isSoldier() {
    return this instanceof Pyada;
  }
  get isRajendra() {
    return false;
  }
  get isRajrishi() {
    return false;
  }

  get isNull() {
    return false;
  }
  get isWhite() {
    return this.alliance == Alliance.WHITE;
  }
  get isBlack() {
    return this.alliance == Alliance.BLACK;
  }
}

const returnFalse: () => false = () => false;

export class NullPiece extends Piece {
  constructor() {
    // @ts-ignore
    super({ symbol: '' }, -1, null);
  }
  calculateLegalMoves(): never {
    throw new Error("Can't calculate moves on empty square!");
  }
  moveTo(): never {
    throw new Error('No piece to move');
  }
  isFriendly() { return returnFalse(); }
  isEnemyOf() { return returnFalse(); }
  get isNull() { return true; }
  get isWhite() { return returnFalse(); }
  get isBlack() { return returnFalse(); }

}
// @ts-ignore
Piece.NULL_PIECE = new NullPiece();