import Alliance from '../Alliance';
import { SquareName } from '../Square';
import Board from '../Board';
import Move, { AttackMove } from '../Movement';
import Piece from './Piece';

export default class Rajendra extends Piece {
  constructor(board: Board, position: number, alliance: Alliance) {
    super(board, Piece.RAJENDRA, position, alliance);
  }

  calculateLegalMoves() {
    const moves: Move[] = [];

    for (const candidateSquareIndex of this.type.legals) {
      const destinationIndex = candidateSquareIndex + this.position;
      const destinationSquare = this.board.getSquareAt(destinationIndex);
      if (destinationSquare === undefined) continue;
      if (!destinationSquare.piece) {
        moves.push(new Move(this, destinationSquare));
      } else if (this.board.opponentPlayer.alliance == destinationSquare.piece.alliance) {
        moves.push(new AttackMove(this, destinationSquare));
      }
    }
    return moves;
  }
}