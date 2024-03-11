import { time } from 'console';
import { Piece } from '.';
import { Board, Move, Square } from '../board';
import { Alliance } from '../player';
import { ADJACENT_DIRECTION, BOARD_SIZE, DIAGNAL_DIRECTION, ORTHOGONAL_DIRECTION } from '../Utils';


export default abstract class RoyalPiece extends Piece {
  calculateLegalMoves(currentSquare: Square) {
    const moves: Move[] = [];
    for (const candidateSquareIndex of ADJACENT_DIRECTION) {
      const destinationSquare = currentSquare.getNearbySquare(candidateSquareIndex);
      if (!destinationSquare) continue;
      if (currentSquare.isRoyalNearby || currentSquare.isZoneSame(destinationSquare)) {
        if (destinationSquare.createWeakMove(moves, currentSquare) && this.isFriendlyOfficer(destinationSquare.piece)) {
          destinationSquare.createPromotionMove(moves, currentSquare);
        }
      }
    }

    if (currentSquare.isRoyalNearby && !currentSquare.isTruceZone)
      for (const plus of ORTHOGONAL_DIRECTION) {
        this.trishoolMovement(moves, currentSquare, plus);
      }
    return moves;
  }
  isWeak() {
    return !this.isIndra;
  }
  isBlocked(frontSquare: Square | null) {
    if (!frontSquare) return true;
    const currentSquare = this.square(frontSquare.board);
    return frontSquare.isTruceZone || !frontSquare.isZoneSame(currentSquare) || super.isBlocked(frontSquare);
  }

  helpNearbyRoyals(board: Board) {
    const currentSquare = this.square(board);
    for (const relativeIndex of ADJACENT_DIRECTION) {
      const neighbourSquare = currentSquare.getNearbySquare(relativeIndex)!; // fake !
      if (currentSquare.isZoneSame(neighbourSquare) && this.isFriendly(neighbourSquare.piece)) {
        if (neighbourSquare.piece.isRoyal) {
          currentSquare.isRoyalNearby = neighbourSquare.isRoyalNearby = true;
        } else if (neighbourSquare.piece.isOfficer) {
          currentSquare.isOfficerNearby = neighbourSquare.isRoyalNearby = true;
        }
      }
    }
  }
  get isIndra() {
    return this instanceof Indra;
  }
}

export abstract class Indra extends RoyalPiece {
}
export class Rajendra extends Indra {
  constructor(position: number, alliance: Alliance) {
    super(Piece.RAJENDRA, position, alliance);
  }
  _calculateLegalMoves(currentSquare: Square) {
    const moves: Move[] = [];
    for (const candidateSquareIndex of DIAGNAL_DIRECTION) {
      const destinationSquare = currentSquare.getNearbySquare(candidateSquareIndex);
      if (!destinationSquare) continue;
      if (currentSquare.isRoyalNearby || currentSquare.isZoneSame(destinationSquare)) {
        destinationSquare.createMove(moves, currentSquare);
      }
    }

    const knightMove = (royalSquare: Square, direction: number) => {
      const moveTo = (index: number) => {
        const destinationSquare = royalSquare.getNearbySquare(index);
        destinationSquare?.createMove(moves, currentSquare);
      };
      const oDir = Math.abs(direction) == 1 ? BOARD_SIZE : 1;
      moveTo(direction - oDir);
      moveTo(direction);
      moveTo(direction + oDir);
    };
    for (const plusIndex of ORTHOGONAL_DIRECTION) {
      const royalSquare = currentSquare.getNearbySquare(plusIndex);
      if (!royalSquare) continue;

      if (currentSquare.isRoyalNearby || currentSquare.isZoneSame(royalSquare)) {
        if (royalSquare.createMove(moves, currentSquare) && this.isFriendlyRoyal(royalSquare.piece)) {
          knightMove(royalSquare, plusIndex);
        }
      }
    }
    return moves;
  }

  moveTo(move: Move) {
    return new Rajendra(move.destinationSquare.index, move.movedPiece.alliance);
  }
}
export class Rajendraw extends Indra {
  constructor(position: number, alliance: Alliance) {
    super(Piece.RAJENDRAW, position, alliance);
  }

  moveTo(move: Move) {
    return new Rajendraw(move.destinationSquare.index, move.movedPiece.alliance);
  }
}
export class Arthshastri extends RoyalPiece {
  constructor(position: number, alliance: Alliance) {
    super(Piece.ARTHSHASTRI, position, alliance);
  }

  moveTo(move: Move) {
    return new Arthshastri(move.destinationSquare.index, move.movedPiece.alliance);
  }
}
export class Guptchar extends RoyalPiece {
  constructor(position: number, alliance: Alliance) {
    super(Piece.GUPTCHAR, position, alliance);
  }

  moveTo(move: Move) {
    return new Guptchar(move.destinationSquare.index, move.movedPiece.alliance);
  }
}