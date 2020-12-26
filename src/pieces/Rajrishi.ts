import { Piece } from '.';
import { AttackMove, Board, CastleZone, Move } from '../board';
import { Alliance } from '../player';


export default class Rajrishi extends Piece {
  constructor(position: number, alliance: Alliance) {
    super(Piece.RAJRISHI, position, alliance);
  }

  calculateLegalMoves(board: Board) {
    const moves: Move[] = [];
    const currentSquare = board.getSquareAt(this.position)!;
    if (currentSquare.isTruceZone) return this.bailPath(board);

    for (const square of board.squares.values()) {
      if (square.isOccupied || square.isCastle && this.alliance != (square as CastleZone).alliance) continue;
      moves.push(new Move(this, square));
    }
    return moves;
  }
}