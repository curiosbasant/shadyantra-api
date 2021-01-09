import { OfficerPiece, Piece } from '.';
import { AttackMove, Board, CastleZone, Move, NormalMove, Square, WeakMove } from '../board';
import { Alliance } from '../player';
import { NEIGHBOURS } from '../Utils';


export default class Rajrishi extends Piece {
  controllableOpponentOfficers = new Set<Piece>();
  constructor(position: number, alliance: Alliance) {
    super(Piece.RAJRISHI, position, alliance);
  }

  calculateLegalMoves(board: Board) {
    const moves: WeakMove[] = [];
    const currentSquare = this.square(board);
    if (currentSquare.isTruceZone) return this.hostilePath(board);

    for (const square of board.squares) {
      if (square.isEmpty && !this.isOpponentCastle(square))
        moves.push(new WeakMove(this, square));
    }
    return moves;
  }

  isOpponentCastle(square: Square) {
    return (square instanceof CastleZone) && this.alliance != square.alliance;
  }

  /** Freezes all surrounding squares to the Rajrishi if no opponent royal is on them. */
  freezeSurroundingSquares(board: Board) {
    this.loopSurrounding(board, (square: Square) => square.freeze());
  }
  controlSurroundingOfficers(board: Board) {
    this.loopSurrounding(board, (square: Square) => {
      const piece = square.piece;
      if (this.isEnemyOf(piece) && piece.isOfficer)
        this.controllableOpponentOfficers.add(piece);
      square.protector = this;
    });
  }

  private loopSurrounding(board: Board, fun: (square: Square) => void) {
    const currentSquare = this.square(board);
    if (currentSquare.isOpponentRoyalNearby()) return;

    for (const relativeIndex of NEIGHBOURS) {
      const neighbourSquare = currentSquare.getNearbySquare(relativeIndex)!; // fake !
      if (currentSquare.isZoneSame(neighbourSquare)) {
        fun(neighbourSquare);
      }
    }
  }

  get isRajrishi() {
    return true;
  }
  moveTo(move: Move) {
    return new Rajrishi(move.destinationSquare.index, move.movedPiece.alliance);
  }
}