import { Alliance } from '.';
import { Board, Move } from '../board';


export default class Player {
  hasDeclaredWar = false;
  indraPosition: number;
  constructor(readonly board: Board, readonly alliance: Alliance, readonly legalMoves: Move[]) {
    const indra = legalMoves.find(move => move.movedPiece.type.symbol == 'I')?.movedPiece.position;
    // console.log(legalMoves, indra);
    if (!indra) throw new Error("No Indra found!");
    this.indraPosition = indra;

  }

  setOnCheck() {

  }
  get opponent() {
    return this.board.players[+(this.alliance == Alliance.BLACK)];
  }
}