import Alliance from '../player/Alliance';
import Board from '../board/Board';
import Move, { AttackMove } from '../board/Movement';
import Piece from './Piece';

export default class Rajendra extends Piece {
  constructor(position: number, alliance: Alliance) {
    super(Piece.RAJENDRA, position, alliance);
  }

  calculateLegalMoves(board: Board) {
    const moves: Move[] = [];

    for (const candidateSquareIndex of this.type.legals) {
      const destinationIndex = candidateSquareIndex + this.position;
      const destinationSquare = board.getSquareAt(destinationIndex);
      if (destinationSquare === undefined) continue;
      if (destinationSquare.isEmpty) {
        moves.push(new Move(this, destinationSquare));
      } else if (this.alliance == destinationSquare.piece!.alliance) {
        moves.push(new AttackMove(this, destinationSquare));
      }
      destinationSquare.piece?.alliance
    }
    return moves;
  }
}