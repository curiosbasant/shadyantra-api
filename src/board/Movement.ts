import { Board, Builder, Square } from '.';
import { Piece } from '../pieces';

export default abstract class Move {
  private isExecuted = false;
  constructor(readonly movedPiece: Piece, readonly destinationSquare: Square) {

  }
  private getAlignmentCopy() {
    return this.destinationSquare.board.builder.copyAlignment();
  }
  execute() {
    this.isExecuted = true;
    const configCopy = this.getAlignmentCopy();
    const builder = new Builder(configCopy)
      .removePiece(this.movedPiece.position)
      .setPiece(this.movedPiece.moveTo(this));
    return builder.build(this.destinationSquare.board.opponentPlayer.alliance);
  }

  takeback() {
    if (!this.isExecuted) throw new Error("This move has not been executed yet!");
    return this.destinationSquare.board;
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
