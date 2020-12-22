import { EventEmitter } from 'events';
import path from 'path';
import requireAll from 'require-all';
import Alliance from './Alliance';
import { SquareName } from './Square';
import Board from './Board';
import Piece, { PieceSymbol } from './pieces';

const DEFAULT_FEN = '0ccciaccc0/9/4c3/9/9/9/9/9/9/0CCCIACCC0';

export default class ShadYantra extends EventEmitter {
  board = new Board();

  constructor(fen = DEFAULT_FEN, variant = 'standard') {
    super();
    this.registerEvents(path.join(__dirname, 'events'));
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
    if (!this.validateFEN(fen)) return false;

    let sqrIndex = 0;
    for (const ch of fen) {
      if (ch == '/') continue;
      if (ch.isNumber()) {
        sqrIndex += +ch;
      } else {
        const PieceClass = Piece.getPieceByNotation(ch.toUpperCase() as PieceSymbol);
        const { alliance } = this.board.players[+ch.isUpperCase()];
        this.board.setPiece(new PieceClass(this.board, sqrIndex, alliance));
        // console.log(sqrIndex, ch);
      }
      sqrIndex++;
    }
    // return true;
  }

  move() {
  }

  private validateFEN(fen: string) {
    return true;
  }
  generateFEN() {
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
