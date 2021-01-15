import { Board, Builder, Square } from '.';
import { Piece } from '../pieces';

export default abstract class Move {
  constructor(readonly movedPiece: Piece, readonly destinationSquare: Square) {

  }

  execute() {
    const configCopy = this.destinationSquare.board.builder.copyAlignment();
    const builder = new Builder(configCopy)
      .removePiece(this.movedPiece.position)
      .setPiece(this.movedPiece.moveTo(this));
    return builder.build();
  }

  toString() {
    return `${ this.movedPiece.type.symbol }${ this.destinationSquare.name }`;
  }
}
export class NormalMove extends Move {
  constructor(movedPiece: Piece, destinationSquare: Square) {
    super(movedPiece, destinationSquare);
    destinationSquare.addAttacker(movedPiece);
  }
}
export class WeakMove extends Move {

}
export class AttackMove extends Move {
  get attackedPiece() {
    return this.destinationSquare.piece;
  }
  toString() {
    return `${ this.movedPiece.type.symbol }x${ this.destinationSquare.name }`;
  }
}

export class SuicideMove extends Move {
  execute() {
    const configCopy = this.destinationSquare.board.builder.copyAlignment();
    const builder = new Builder(configCopy)
      .removePiece(this.movedPiece.position);
    // .setPiece(this.movedPiece.moveTo(this));
    return builder.build();
  }
}

export class PromotionMove extends Move {

}

export class DemotionMove extends Move {

}
