import { PieceSymbol, Rajendra, Pyada, Senapati, PieceNotation } from '.';
import { Board, Move } from '../board';
import { Alliance } from '../player';
import { CROSS, PLUS, KNIGHT, BOARD_SIZE } from '../Utils';


type PostTypeName = 'officer' | 'royal' | 'godman' | 'soldier';
class Post {
  static ROYAL = new Post('royal');
  static OFFICER = new Post('officer');
  static GODMAN = new Post('godman');
  static SOLDIER = new Post('soldier');
  constructor(readonly name: PostTypeName) { }
}
export class PieceType {
  constructor(
    readonly symbol: PieceSymbol,
    readonly name: string,
    readonly legals: readonly number[],
    readonly post: Post,
  ) { }
}

export default abstract class Piece {
  static readonly RAJENDRA = new PieceType('I', 'rajendra', [], Post.ROYAL);
  static readonly ARTHSHASTRI = new PieceType('A', 'arthshastri', [], Post.ROYAL);
  static readonly GUPTCHAR = new PieceType('C', 'guptchar', [], Post.ROYAL);
  static readonly RAJRISHI = new PieceType('R', 'rajrishi', [], Post.ROYAL);
  static readonly SENAPATI = new PieceType('S', 'senapati', CROSS.concat(PLUS), Post.OFFICER);
  static readonly MAHARATHI = new PieceType('M', 'maharathi', PLUS, Post.OFFICER);
  static readonly GAJAROHI = new PieceType('G', 'gajarohi', CROSS, Post.OFFICER);
  static readonly ASHVAROHI = new PieceType('H', 'ashvarohi', PLUS.map(v => v * 2).concat(KNIGHT), Post.OFFICER);
  static readonly PYADA = new PieceType('P', 'pyada', [BOARD_SIZE - 1, BOARD_SIZE, BOARD_SIZE + 1], Post.SOLDIER);

  static getPieceBySymbol(symbol: PieceSymbol) {
    switch (symbol) {
      case 'I': return Rajendra;
      case 'A': return Pyada;
      case 'R': return Pyada;
      case 'C': return Pyada;
      case 'S': return Senapati;
      case 'H': return Pyada;
      case 'G': return Pyada;
      case 'M': return Pyada;
      case 'P': return Pyada;
    }
  }

  abstract calculateLegalMoves(board: Board): Move[];

  readonly notation: PieceNotation;

  constructor(
    readonly type: PieceType,
    readonly position: number,
    readonly alliance: Alliance
  ) {
    this.notation = type.symbol[alliance.color == 'WHITE' ? 'toUpperCase' : 'toLowerCase']() as PieceNotation;
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
}