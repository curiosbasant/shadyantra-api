import Alliance from './Alliance';
import Move from '../board/Movement';
import { SquareName } from '../board/Square';
import Board from '../board/Board';

export default class Player {
  hasDeclaredWar = false;
  indraPosition: number;
  constructor(readonly board: Board, readonly alliance: Alliance, readonly legalMoves: Move[]) {
    const indra = legalMoves.find(move => move.movedPiece.type.symbol == 'I')?.movedPiece.position;
    // console.log(legalMoves, indra);
    if (!indra) throw new Error("No Indra found!");
    this.indraPosition = indra;

  }

  get opponent() {
    return this.board.players[+(this.alliance == Alliance.BLACK)];
  }
}