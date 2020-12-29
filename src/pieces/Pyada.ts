import { Piece } from '.';
import { AttackMove, Board, Move } from '../board';
import { Alliance } from '../player';


export default class Pyada extends Piece {
  constructor(position: number, alliance: Alliance) {
    super(Piece.PYADA, position, alliance);
  }

  calculateLegalMoves(board: Board) {
    const moves: Move[] = [];
    const currentSquare = board.getSquareAt(this.position)!;

    if (!currentSquare.isOfficerNearby()) return moves;

    for (const candidateSquareIndex of this.type.legals) {
      const destinationIndex = this.position + this.alliance.direction * candidateSquareIndex;
      const destinationSquare = board.getSquareAt(destinationIndex)!;

      if (destinationSquare.isCastle) break;
      if (destinationSquare.isTruceZone) continue;
      if (destinationSquare.isEmpty) {
        moves.push(new Move(this, destinationSquare));
      } else if (!currentSquare.isTruceZone && !this.isOfSameSide(destinationSquare.piece)) {
        moves.push(new AttackMove(this, destinationSquare));
      }
    }
    return moves;
  }

  moveTo(move: Move) {
    return new Pyada(move.destinationSquare.index, move.movedPiece.alliance);
  }
}