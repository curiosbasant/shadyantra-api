import { Board, NormalMove, AttackMove, WeakMove, Move } from '../board';
import { Alliance } from '../player';
import { BOARD_SIZE, CROSS, NEIGHBOURS, PLUS } from '../Utils';
import { Piece, PieceType } from '.';


export default abstract class RoyalPiece extends Piece {
  calculateLegalMoves(board: Board) {
    const currentSquare = this.square(board);
    // console.log(currentSquare.name, isRoyalNearby, currentSquare.piece?.type.name);
    const moves: WeakMove[] = [];
    if (currentSquare.isTruceZone) return currentSquare.isRoyalNearby ? this.hostilePath(board) : moves;

    for (const candidateSquareIndex of NEIGHBOURS) {
      const destinationSquare = currentSquare.getNearbySquare(candidateSquareIndex);
      // if (!destinationSquare) continue;
      if (destinationSquare?.isEmpty && (currentSquare.isRoyalNearby || currentSquare.isZoneSame(destinationSquare))) {
        moves.push(new WeakMove(this, destinationSquare));
      }
    }
    return moves;
  }

  helpNearbyRoyals(board: Board) {
    const currentSquare = this.square(board);
    for (const relativeIndex of NEIGHBOURS) {
      const neighbourSquare = currentSquare.getNearbySquare(relativeIndex)!;
      if (currentSquare.isZoneSame(neighbourSquare) && this.isOwnSide(neighbourSquare.piece)) {
        if (neighbourSquare.piece.isRoyal) {
          currentSquare.isRoyalNearby = neighbourSquare.isRoyalNearby = true;
        } else if (neighbourSquare.piece.isOfficer) {
          currentSquare.isOfficerNearby = neighbourSquare.isRoyalNearby = true;
        }
      }
    }
  }
}

export class Rajendra extends RoyalPiece {
  constructor(position: number, alliance: Alliance) {
    super(Piece.RAJENDRA, position, alliance);
  }
  calculateLegalMoves(board: Board) {
    const currentSquare = this.square(board);
    const moves: Move[] = [];
    if (currentSquare.isTruceZone) return currentSquare.isRoyalNearby ? this.hostilePath(board) : moves;

    for (const candidateSquareIndex of CROSS) {
      const destinationSquare = currentSquare.getNearbySquare(candidateSquareIndex);
      if (!destinationSquare) continue;

      if (currentSquare.isRoyalNearby || currentSquare.isZoneSame(destinationSquare)) {
        this.createMove(moves, destinationSquare);
      }
    }

    for (const plusIndex of PLUS) {
      const destinationSquare = currentSquare.getNearbySquare(plusIndex);
      if (!destinationSquare) continue;

      const checkSquare = (candidateIndex = 0) => {
        const destinationSquare = currentSquare.getNearbySquare(candidateIndex + plusIndex * 2);
        if (destinationSquare && !currentSquare.isZoneSame(destinationSquare)) {
          this.createMove(moves, destinationSquare);
          // moves.push(new NormalMove(this, destinationSquare));
        }
        return checkSquare;
      };
      if (currentSquare.isRoyalNearby || currentSquare.isZoneSame(destinationSquare)) {
        if (destinationSquare.isEmpty) {
          moves.push(new NormalMove(this, destinationSquare));
        } else if (this.canCapture(destinationSquare)) {
          moves.push(new AttackMove(this, destinationSquare));
        } else if (destinationSquare.piece.isRoyal) {
          const adjacentIndex = Math.abs(plusIndex) == 1 ? BOARD_SIZE : 1;
          checkSquare(-adjacentIndex)(0)(adjacentIndex);
        }
      }
    }
    return moves;
  }

  moveTo(move: NormalMove) {
    return new Rajendra(move.destinationSquare.index, move.movedPiece.alliance);
  }
  get isRajendra() {
    return true;
  }
}

export class Arthshastri extends RoyalPiece {
  constructor(position: number, alliance: Alliance) {
    super(Piece.ARTHSHASTRI, position, alliance);
  }

  moveTo(move: NormalMove) {
    return new Arthshastri(move.destinationSquare.index, move.movedPiece.alliance);
  }
}
export class Guptchar extends RoyalPiece {
  constructor(position: number, alliance: Alliance) {
    super(Piece.GUPTCHAR, position, alliance);
  }

  moveTo(move: NormalMove) {
    return new Guptchar(move.destinationSquare.index, move.movedPiece.alliance);
  }
}