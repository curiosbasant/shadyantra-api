import { PieceNotation, PieceSymbol, Rajendra } from '.';
import Alliance from '../Alliance';
import { SquareName, SQUARE_FLAGS } from '../Square';
import Board from '../Board';
import Move from '../Movement';
import { BOARD_SIZE, NEIGHBOURS } from '../Utils';

class Type {
  constructor(
    readonly symbol: PieceSymbol,
    readonly name: string,
    readonly legals: number[]
  ) { }
}

export default abstract class Piece {
  static readonly RAJENDRA = new Type('I', 'rajendra', NEIGHBOURS);
  static readonly ARTHSHASTRI = new Type('A', 'arthshastri', []);
  static readonly RAJRISHI = new Type('R', 'rajrishi', []);
  static readonly GUPTCHAR = new Type('C', 'guptchar', []);
  static readonly SENAPATI = new Type('S', 'senapati', []);
  static readonly ASHVAROHI = new Type('H', 'ashvarohi', []);
  static readonly GAJAROHI = new Type('G', 'gajarohi', []);
  static readonly MAHARATHI = new Type('M', 'maharathi', []);
  static readonly PYADA = new Type('P', 'pyada', [BOARD_SIZE - 1, BOARD_SIZE, BOARD_SIZE + 1]);

  static getPieceByNotation(notation: PieceSymbol) {
    switch (notation) {
      case 'I': return Rajendra;
      case 'A': return Rajendra;
      case 'R': return Rajendra;
      case 'C': return Rajendra;
      case 'S': return Rajendra;
      case 'H': return Rajendra;
      case 'G': return Rajendra;
      case 'M': return Rajendra;
      case 'P': return Rajendra;
    }
  }

  abstract calculateLegalMoves(): Move[];

  readonly notation: PieceNotation;

  constructor(
    readonly board: Board,
    readonly type: Type,
    readonly position: number,
    readonly alliance: Alliance
  ) {
    this.notation = type.symbol[alliance.color == 'WHITE' ? 'toUpperCase' : 'toLowerCase']() as PieceNotation;
  }

  get square() {
    return this.board.getSquareAt(this.position)!;
  }
}
