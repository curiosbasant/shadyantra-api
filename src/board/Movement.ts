import { Square } from '.';
import Piece from '../pieces';

export default class Move {
  constructor(readonly movedPiece: Piece, readonly destinationSquare: Square) {

  }
}

export class AttackMove extends Move {
  attackedPiece: Piece;
  constructor(movedPiece: Piece, destinationSquare: Square) {
    super(movedPiece, destinationSquare);
    this.attackedPiece = destinationSquare.piece!;
  }
}