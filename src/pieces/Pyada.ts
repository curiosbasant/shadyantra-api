import Alliance from '../player/Alliance';
import Board from '../board/Board';
import Move, { AttackMove } from '../board/Movement';
import Piece from './Piece';
import { BOARD_SIZE } from '../Utils';

export default class Pyada extends Piece {
  constructor(position: number, alliance: Alliance) {
    super(Piece.PYADA, position, alliance);
  }

  calculateLegalMoves(board: Board) {
    const moves: Move[] = [];

    for (const candidateSquareIndex of this.type.legals) {
      const destinationIndex = this.position + this.alliance.direction * candidateSquareIndex;
      const destinationSquare = board.getSquareAt(destinationIndex);
      if (destinationSquare === undefined) continue;
      if (destinationSquare.isEmpty) {
        moves.push(new Move(this, destinationSquare));
      } else if (this.alliance == destinationSquare.piece!.alliance) {
        moves.push(new AttackMove(this, destinationSquare));
      }
    }
    return moves;
  }
}