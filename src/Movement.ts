import Bhoomi from './Square';
import Piece from './pieces';

export default class Move {
  constructor(readonly movedPiece: Piece, readonly destinationSquare: Bhoomi) {

  }
}

export class AttackMove extends Move {
  attackedPiece: Piece;
  constructor(movedPiece: Piece, destinationSquare: Bhoomi) {
    super(movedPiece, destinationSquare);
    this.attackedPiece = destinationSquare.piece!;
  }
}