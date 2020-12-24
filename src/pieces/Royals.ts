import { Board, Move, AttackMove } from '../board';
import { Alliance } from '../player';
import { NEIGHBOURS } from '../Utils';
import { Piece, PieceType } from '.';


export default abstract class RoyalPiece extends Piece {
  constructor(type: PieceType, position: number, alliance: Alliance) {
    super(type, position, alliance);
  }

  calculateLegalMoves(board: Board) {
    const moves: Move[] = [];
    const currentSquare = board.getSquareAt(this.position)!;
    const isRoyalNearby = currentSquare.isRoyalNearby;

    for (const candidateSquareIndex of NEIGHBOURS) {
      const destinationSquare = currentSquare.nearbySquare(candidateSquareIndex);
      if (!destinationSquare) continue;
      if (destinationSquare.isOfSameZoneAs(currentSquare)) {
        if (destinationSquare.isEmpty) {
          moves.push(new Move(this, destinationSquare));
        } else if (this.alliance == destinationSquare.piece!.alliance) {
          moves.push(new AttackMove(this, destinationSquare));
        }
      } else if (isRoyalNearby && destinationSquare.isEmpty) {
        moves.push(new Move(this, destinationSquare));
      }
    }
    return moves;
  }
}

export class Rajendra extends RoyalPiece {
  constructor(position: number, alliance: Alliance) {
    super(Piece.RAJENDRA, position, alliance);
  }
  calculateLegalMoves(board: Board) {
    let moves = super.calculateLegalMoves(board);
    const currentSquare = board.getSquareAt(this.position)!;
    // If king is in check
    if (currentSquare.candidatePieces.size) board.activePlayer.setOnCheck();

    // restricting king to move in check
    moves = moves.filter(move => !move.destinationSquare.candidatePieces);
    return moves;
  }
}

export class Arthshastri extends RoyalPiece {
  constructor(position: number, alliance: Alliance) {
    super(Piece.ARTHSHASTRI, position, alliance);
  }

}
export class Guptchar extends RoyalPiece {
  constructor(position: number, alliance: Alliance) {
    super(Piece.GUPTCHAR, position, alliance);
  }

}