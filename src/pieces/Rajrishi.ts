import { Piece } from '.';
import { AttackMove, Board, CastleZone, MediateZone, Move } from '../board';
import { Alliance } from '../player';
import { NEIGHBOURS } from '../Utils';


export default class Rajrishi extends Piece {
  constructor(position: number, alliance: Alliance) {
    super(Piece.RAJRISHI, position, alliance);
  }

  calculateLegalMoves(board: Board) {
    const moves: Move[] = [];
    const currentSquare = board.getSquareAt(this.position)!;
    if (currentSquare.isTruceZone) return this.hostilePath(board);

    for (const square of board.squares) {
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
      neighbourSquare.board.setSquare(new MediateZone(neighbourSquare.board, neighbourSquare.name, this.alliance));
      if (this.isEnemyOf(neighbourSquare.piece) && (neighbourSquare.piece!.isOfficer || neighbourSquare.piece!.isSoldier)) {
        neighbourSquare.piece!.isFreezed = true;
      }
    }
  }

  get isRajrishi() {
    return true;
  }
}