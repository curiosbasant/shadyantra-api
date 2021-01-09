import { Arthshastri, Ashvarohi, Gajarohi, Guptchar, Maharathi, OfficerPiece, PieceNotation, PieceSymbol, Pyada, Rajendra, Rajrishi, RoyalPiece, Senapati } from '.';
import { AttackMove, Board, Move, NormalMove, Square, WeakMove } from '../board';
import { Alliance } from '../player';
import { CROSS, NEIGHBOURS, PLUS, VECTOR } from '../Utils';

const EMPTY_ARRAY = [];
export class PieceType {
  constructor(
    readonly symbol: PieceSymbol,
    readonly name: string,
    readonly value: number,
    readonly legals: readonly number[] = EMPTY_ARRAY,
  ) { }
}

export default abstract class Piece {
  static readonly RAJENDRA = new PieceType('I', 'rajendra', 9);
  static readonly DRAWER = new PieceType('J', 'rajendra', 9);
  static readonly ARTHSHASTRI = new PieceType('A', 'arthshastri', 8);
  static readonly RAJRISHI = new PieceType('R', 'rajrishi', 7);
  static readonly SENAPATI = new PieceType('S', 'senapati', 6, VECTOR);
  static readonly MAHARATHI = new PieceType('M', 'maharathi', 5, PLUS);
  static readonly ASHVAROHI = new PieceType('H', 'ashvarohi', 4);
  static readonly GAJAROHI = new PieceType('G', 'gajarohi', 3, CROSS);
  static readonly GUPTCHAR = new PieceType('C', 'guptchar', 2);
  static readonly PYADA = new PieceType('P', 'pyada', 1);
  static readonly NULL_PIECE = null as unknown as NullPiece;

  static readonly RANKS = Object.freeze([
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

  abstract calculateLegalMoves(board: Board): Move[];
  abstract moveTo(move: Move): Piece;

  readonly notation: PieceNotation;
  nearbyOfficers = new Set<Piece>();
  nearbyRoyals = new Set<Piece>();

  constructor(readonly type: PieceType, readonly position: number, readonly alliance: Alliance) {
    this.notation = type.symbol[alliance == Alliance.WHITE ? 'toUpperCase' : 'toLowerCase']() as PieceNotation;
  }

  createMove(moves: Move[], square: Square, killIf = true) {
    if (square.isEmpty) moves.push(new NormalMove(this, square));
    else if (killIf && this.canCapture(square)) {
      moves.push(new AttackMove(this, square));
    }
  }
  
  square(board: Board) {
    return board.getSquareAt(this.position)!;
  }

  private mote(sign: -1 | 1) {
    const index = this.type.value - 2;
    const nextRank = Piece.RANKS[index + sign];
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

    for (const candidateSquareIndex of NEIGHBOURS) {
      const destinationSquare = currentSquare.getNearbySquare(candidateSquareIndex);
      if (destinationSquare && destinationSquare.isEmpty && (destinationSquare.isWarZone || destinationSquare.isForbiddenZone)) {
        moves.push(new WeakMove(this, destinationSquare));
      }
    }

    return moves;
  }

  /** Checks if can attack other piece  */
  canAttack(piece: Piece) {
    return !piece.isGodman && this.isEnemyOf(piece);
  }
  /** Can't capture if DS is TZ or Freezed or has Godman */
  canMove(destinationSquare: Square) {
    const currentSquare = this.square(destinationSquare.board);
    if (currentSquare.isFreezed && destinationSquare.isFreezed) return false;
    return destinationSquare.isEmpty;
  }
  canCapture(destinationSquare: Square) {
    return this.isEnemyOf(destinationSquare.piece) && !(destinationSquare.isTruceZone ||
      destinationSquare.isFreezed || destinationSquare.piece.isGodman);
  }

  /** Checks if other piece is of same side  */
  isOwnSide(piece: Piece) {
    return !piece.isNull && this.alliance === piece.alliance;
  }
  isEnemyOf(piece: Piece) {
    return !piece.isNull && this.alliance !== piece.alliance;
  }

  /** Checks if other piece is nearby */
  isCloseTo(piece: Piece) {
    return NEIGHBOURS.includes(this.position - piece.position);
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
  calculateLegalMoves(board: Board): NormalMove[] {
    return [];
  }
  moveTo(move: NormalMove): Piece {
    throw new Error('Method not implemented.');
  }
  constructor() {
    // @ts-ignore
    super({ symbol: '-' }, -1, null);
  }

  isOwnSide() { return returnFalse(); }
  isEnemyOf() { return returnFalse(); }
  get isNull() { return true; }
  get isWhite() { return returnFalse(); }
  get isBlack() { return returnFalse(); }

}
// @ts-ignore
Piece.NULL_PIECE = new NullPiece();