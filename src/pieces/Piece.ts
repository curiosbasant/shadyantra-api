import { PieceNotation, PieceSymbol, Pyada, Rajendra } from '.';
import Alliance from '../player/Alliance';
import { SquareName, SQUARE_FLAGS } from '../board/Square';
import Board from '../board/Board';
import Move from '../board/Movement';
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
      case 'A': return Pyada;
      case 'R': return Pyada;
      case 'C': return Pyada;
      case 'S': return Pyada;
      case 'H': return Pyada;
      case 'G': return Pyada;
      case 'M': return Pyada;
      case 'P': return Pyada;
    }
  }

  abstract calculateLegalMoves(board: Board): Move[];

  readonly notation: PieceNotation;

  constructor(
    readonly type: Type,
    readonly position: number,
    readonly alliance: Alliance
  ) {
    this.notation = type.symbol[alliance.color == 'WHITE' ? 'toUpperCase' : 'toLowerCase']() as PieceNotation;
  }
}
