import { EventEmitter } from 'events';
import path from 'path';
import requireAll from 'require-all';
import Alliance from '../player/Alliance';
import { SquareName, SQUARE_FLAGS } from './Square';
import Board, { Builder } from './Board';
import Piece, { PieceSymbol } from '../pieces';
import { BOARD_SIZE, TOTAL_SQUARES } from '../Utils';

interface ChessOption {
  isWhiteTurn?: boolean;
}

const DEFAULT_FEN = '0ccciaccc0/9/4c3/9/9/9/9/9/9/0CCCIACCC0';

export default class ShadYantra extends EventEmitter {
  board!: Board;
  isWhiteTurn: boolean;

  constructor(fen = DEFAULT_FEN, options: ChessOption = {}) {
    super();
    this.isWhiteTurn = options.isWhiteTurn ?? true;
    this.registerEvents(path.join(__dirname, '../events'));
    this.loadFEN(fen);
  }

  registerEvents(dirname: string) {
    const files = requireAll({ dirname, resolve: file => file.default, filter: /^([^\.].*)\.(j|t)s(on)?$/ });

    for (const [eventName, funToRun] of Object.entries<Function | undefined>(files)) {
      if (!funToRun) continue;
      this.on(eventName, funToRun.bind(this));
    }
  }

  loadFEN(fen: string) {
    if (!this.validateFEN(fen)) throw new Error("Invalid FEN");

    const builder = new Builder();
    let sqrIndex = 0;
    for (const ch of fen) {
      if (ch == '/') continue;
      if (ch.isNumber()) {
        sqrIndex += +ch;
      } else {
        const PieceClass = Piece.getPieceByNotation(ch.toUpperCase() as PieceSymbol);
        const alliance = ch.isUpperCase() ? Alliance.WHITE : Alliance.BLACK;
        builder.setPiece(new PieceClass(sqrIndex, alliance));
        // console.log(sqrIndex, ch);
      }
      sqrIndex++;
    }
    this.board = builder.build();
  }

  move(squareRef: SquareName | number) {
    if (typeof squareRef == 'number' && (squareRef < 0 || squareRef >= BOARD_SIZE)) throw new Error("Invalid Index!");

    const squareName = typeof squareRef == 'number' ? SQUARE_FLAGS[squareRef] as SquareName : squareRef;
    const square = this.board.squares.get(squareName)!;
    // if (square.candidatePieces.size != 1);
  }

  private validateFEN(fen: string) {
    return true;
  }
  generateFEN() {
    let ctr = -1;
    const join = ch => {
      if (ctr == -1) return ch;
      ctr = -1;
      return ctr + ch;
    };
    return this.board.builder.config.reduce((str, piece, i) => {
      if (!piece) {
        ctr++;
      } else {
        str += join(piece.notation);
      }
      if (!((i + 1) % BOARD_SIZE)) {
        str += join('/');
      }
      return str;
    }, '');
  }
  getPieceFrom(square: SquareName) {
    return null;
  }
  removePieceFrom(square: SquareName) {
    return true;
  }
  putPieceOn(square: SquareName, notation: PieceSymbol) {

  }
}
