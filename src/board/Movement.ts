import { Board, Builder, Square } from '.';
import { Piece } from '../pieces';

export default class Move {
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

export class AttackMove extends Move {


  get attackedPiece() {
    return this.destinationSquare.piece!;
  }
  toString() {
    return `${ this.movedPiece.type.symbol }x${ this.destinationSquare.name }`;
  }
}

export class ControlMove extends Move {

}