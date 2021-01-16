import { Arthshastri, Ashvarohi, Gajarohi, Guptchar, Maharathi, OfficerPiece, PieceNotation, PieceSymbol, Pyada, Rajendra, Rajrishi, RoyalPiece, Senapati } from '.';
import { AttackMove, Board, Move, NormalMove, Square, WeakMove } from '../board';
import { Alliance } from '../player';
import { ADJACENT_DIRECTION, BOARD_SIZE, DIAGNAL_DIRECTION, ORTHOGONAL_DIRECTION } from '../Utils';

export class PieceType {
  constructor(readonly symbol: PieceSymbol, readonly name: string, readonly value: number) { }
}

export default abstract class Piece {
  static readonly RAJENDRA = new PieceType('I', 'rajendra', 9);
  static readonly RAJENDRAW = new PieceType('J', 'rajendra', 9);
  static readonly ARTHSHASTRI = new PieceType('A', 'arthshastri', 8);
  static readonly RAJRISHI = new PieceType('R', 'rajrishi', 7);
  static readonly SENAPATI = new PieceType('S', 'senapati', 6);
  static readonly MAHARATHI = new PieceType('M', 'maharathi', 5);
  static readonly ASHVAROHI = new PieceType('H', 'ashvarohi', 4);
  static readonly GAJAROHI = new PieceType('G', 'gajarohi', 3);
  static readonly GUPTCHAR = new PieceType('C', 'guptchar', 2);
  static readonly PYADA = new PieceType('P', 'pyada', 1);
  static readonly NULL_PIECE = null as unknown as NullPiece;

  static readonly STRENGTH_ORDER = Object.freeze([
    Piece.GUPTCHAR, Piece.GAJAROHI, Piece.ASHVAROHI, Piece.MAHARATHI, Piece.SENAPATI
  ]);
  static getPieceBySymbol(symbol: PieceSymbol) {
    switch (symbol) {
      case 'P': return Pyada;
      case 'C': return Guptchar;
      case 'G': return Gajarohi;
      case 'H': return Ashvarohi;
      case 'M': return Maharathi;
      case 'S': return Senapati;
      case 'A': return Arthshastri;
      case 'I': return Rajendra;
      case 'J': return Rajendra;
      case 'R': return Rajrishi;
    }
  }

  abstract calculateLegalMoves(moves: Move[], currentSquare: Square, toRetreat: boolean): void;
  abstract moveTo(move: Move): Piece;

  readonly notation: PieceNotation;
  // nearbyOfficers = new Set<Piece>();
  // nearbyRoyals = new Set<Piece>();

  constructor(readonly type: PieceType, readonly position: number, readonly alliance: Alliance) {
    this.notation = type.symbol[alliance == Alliance.WHITE ? 'toUpperCase' : 'toLowerCase']() as PieceNotation;
  }

  createMove(moves: Move[], square: Square, killIf = true) {
    if (square.isEmpty) moves.push(new NormalMove(this, square));
    else if (killIf && this.isDominantOn(square)) {
      moves.push(new AttackMove(this, square));
    }
  }
  createWeakMove(moves: Move[], relativeSquare: Square, relativeIndex: number) {
    const neighbourSquare = relativeSquare.getNearbySquare(relativeIndex);
    const sucess = neighbourSquare?.isEmpty && moves.push(new WeakMove(this, neighbourSquare));
    return Boolean(sucess);
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
    const PieceClass = Piece.getPieceBySymbol(nextRank.symbol) as unknown as typeof Pyada;
    return new PieceClass(this.position, this.alliance);
  }
  /** Promotes the piece  */
  promote() {
    return this.mote(1);
  }
  /** Demotes the piece  */
  demote() {
    return this.mote(-1);
  }
  /** Returns the path to WarZone  */
  protected hostilePath(board: Board) {
    const moves: WeakMove[] = [];
    const currentSquare = this.square(board);

    for (const candidateSquareIndex of ADJACENT_DIRECTION) {
      const destinationSquare = currentSquare.getNearbySquare(candidateSquareIndex);
      if (destinationSquare && destinationSquare.isEmpty && (destinationSquare.isWarZone || destinationSquare.isForbiddenZone)) {
        moves.push(new WeakMove(this, destinationSquare));
      }
    }

    return moves;
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

  /** Checks if other piece is nearby */
  isCloseTo(piece: Piece) {
    return ADJACENT_DIRECTION.includes(this.position - piece.position);
  }
  protected trishulMovement(moves: Move[], originSquare: Square, direction: number, isWeak = false) {
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
 
  isFriendlyRoyal(piece: Piece) {
    return this.isRoyal && this.isFriendly(piece);
  }
  isFriendlyOfficer(piece: Piece) {
    return this.isOfficer && this.isFriendly(piece);
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
  calculateLegalMoves() {
    new Error("Can't calculate moves on empty square!");
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