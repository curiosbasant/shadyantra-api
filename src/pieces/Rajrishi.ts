import { Piece } from '.';
import { AttackMove, Board, CastleZone, Move } from '../board';
import { Alliance } from '../player';
import { NEIGHBOURS } from '../Utils';


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

  moveTo(move: Move) {
    return new Rajrishi(move.destinationSquare.index, move.movedPiece.alliance);
  }

  freezeSurroundingOpponentOfficers(board: Board) {
    const currentSquare = board.getSquareAt(this.position)!;
    const isOpponentRoyalNearby = currentSquare.isOpponentRoyalNearby();
    if (isOpponentRoyalNearby) {
      this.isFreezed = true;
      return;
    }
    for (const relativeIndex of NEIGHBOURS) {
      const neighbourSquare = currentSquare.getNearbySquare(relativeIndex);
      if (!neighbourSquare) continue;
      if (neighbourSquare.isOccupied && neighbourSquare.piece!.isOfficer && !this.isOfSameSide(neighbourSquare.piece)) {
        neighbourSquare.piece!.isFreezed = true;
      }
    }
  }

  get isRajrishi() {
    return true;
  }
}