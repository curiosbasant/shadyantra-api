import { Arthshastri, Ashvarohi, Gajarohi, Guptchar, Maharathi, PieceNotation, PieceSymbol, Pyada, Rajendra, Rajrishi, Senapati } from '.';
import { Board, Move } from '../board';
import { Alliance } from '../player';
import { BOARD_SIZE, CROSS, NEIGHBOURS, PLUS } from '../Utils';


type PostTypeName = 'officer' | 'royal' | 'godman' | 'soldier';
export class Post {
  static ROYAL = new Post('royal');
  static GODMAN = new Post('godman');
  static OFFICER = new Post('officer');
  static SOLDIER = new Post('soldier');
  constructor(readonly name: PostTypeName) { }
}
export class PieceType {
  constructor(
    readonly symbol: PieceSymbol,
    readonly name: string,
    readonly value: number,
    readonly legals: readonly number[],
    readonly post: Post,
  ) { }
}

export default abstract class Piece {
  static readonly RAJENDRA = new PieceType('I', 'rajendra', 9, [], Post.ROYAL);
  static readonly ARTHSHASTRI = new PieceType('A', 'arthshastri', 8, [], Post.ROYAL);
  static readonly RAJRISHI = new PieceType('R', 'rajrishi', 7, [], Post.GODMAN);
  static readonly SENAPATI = new PieceType('S', 'senapati', 6, CROSS.concat(PLUS), Post.OFFICER);
  static readonly MAHARATHI = new PieceType('M', 'maharathi', 5, PLUS, Post.OFFICER);
  static readonly ASHVAROHI = new PieceType('H', 'ashvarohi', 4, [], Post.OFFICER);
  static readonly GAJAROHI = new PieceType('G', 'gajarohi', 3, CROSS, Post.OFFICER);
  static readonly GUPTCHAR = new PieceType('C', 'guptchar', 2, [], Post.ROYAL);
  static readonly PYADA = new PieceType('P', 'pyada', 1, [BOARD_SIZE - 1, BOARD_SIZE, BOARD_SIZE + 1], Post.SOLDIER);

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
      case 'R': return Rajrishi;
    }
  }

  abstract calculateLegalMoves(board: Board): Move[];
  abstract moveTo(move: Move): Piece;

  readonly notation: PieceNotation;
  isFreezed = false;

  constructor(readonly type: PieceType, readonly position: number, readonly alliance: Alliance) {
    this.notation = type.symbol[alliance == Alliance.WHITE ? 'toUpperCase' : 'toLowerCase']() as PieceNotation;
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
  protected bailPath(board: Board) {
    const moves: Move[] = [];

    for (const candidateSquareIndex of NEIGHBOURS) {
      const destinationIndex = this.position + candidateSquareIndex;
      const destinationSquare = board.getSquareAt(destinationIndex)!;
      if (destinationSquare.isWarZone && destinationSquare.isEmpty) {
        moves.push(new Move(this, destinationSquare));
      }
    }

    return moves;
  }

  /** Checks if can attack other piece  */
  canAttack(piece: Piece | null) {
    return !(!piece || piece.isGodman || this.isOfSameSide(piece));
  }

  /** Checks if other piece is of same side  */
  isOfSameSide(piece: Piece | null) {
    return piece?.alliance === this.alliance;
  }

  /** Checks if other piece is nearby */
  isCloseTo(piece: Piece | null) {
    return Boolean(piece) && NEIGHBOURS.includes(this.position - piece!.position);
  }

  get isRoyal() {
    return this.type.post == Post.ROYAL;
  }
  get isOfficer() {
    return this.type.post == Post.OFFICER;
  }
  get isGodman() {
    return this.type.post == Post.GODMAN;
  }
  get isSoldier() {
    return this.type.post == Post.SOLDIER;
  }
  get isRajendra() {
    return false;
  }
  get isRajrishi() {
    return false;
  }

  get isWhite() {
    return this.alliance == Alliance.WHITE;
  }
  get isBlack() {
    return this.alliance == Alliance.BLACK;
  }
}