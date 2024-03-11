import { Board, Builder, Square } from '.';
import { Piece } from '../pieces';

export default abstract class Move {
  private isExecuted = false;
  constructor(readonly movedPiece: Piece, readonly destinationSquare: Square) {

  }
  protected getAlignmentCopy() {
    return this.destinationSquare.board.builder.copyAlignment();
  }
  execute() {
    this.isExecuted = true;
    const configCopy = this.getAlignmentCopy();
    const builder = new Builder(configCopy)
      .setMoveMaker(this.opponentAlliance)
      .removePiece(this.movedPiece.position)
      .setPiece(this.movedPiece.moveTo(this));
    return builder.build();
  }

  takeback() {
    if (!this.isExecuted) throw new Error("This move has not been executed yet!");
    return this.destinationSquare.board;
  }
  toString() {
    return `${ this.movedPiece.type.symbol }${ this.destinationSquare.name }`;
  }
  get opponentAlliance() {
    return this.destinationSquare.board.opponentPlayer.alliance;
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
export class ControlMove extends Move {
}
export class SuicideMove extends Move {
  execute() {
    const configCopy = this.getAlignmentCopy();
    const builder = new Builder(configCopy)
      .removePiece(this.movedPiece.position);
    // .setPiece(this.movedPiece.moveTo(this));
    return builder.build();
  }
}

export abstract class MotionMove extends Move {
}
export class PromotionMove extends MotionMove {
  readonly pieceBefore: Piece;
  constructor(movedPiece: Piece, destinationSquare: Square) {
    super(movedPiece, destinationSquare);
    this.pieceBefore = destinationSquare.piece;
  }
  execute() {
    const configCopy = this.getAlignmentCopy();
    const builder = new Builder(configCopy)
      .setMoveMaker(this.opponentAlliance)
      .setPiece(this.pieceBefore.promote());
    return builder.build();
  }
}
export class DemotionMove extends MotionMove {
}
