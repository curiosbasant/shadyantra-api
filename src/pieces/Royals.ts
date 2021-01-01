import { Board, Move, AttackMove } from '../board';
import { Alliance } from '../player';
import { BOARD_SIZE, CROSS, NEIGHBOURS, PLUS } from '../Utils';
import { Piece, PieceType } from '.';


export default abstract class RoyalPiece extends Piece {
  calculateLegalMoves(board: Board) {
    const currentSquare = board.getSquareAt(this.position)!;
    const isRoyalNearby = currentSquare.isRoyalNearby();
    // console.log(currentSquare.name, isRoyalNearby, currentSquare.piece?.type.name);
    const moves: Move[] = [];
    if (currentSquare.isTruceZone) return isRoyalNearby ? this.hostilePath(board) : moves;

    for (const candidateSquareIndex of NEIGHBOURS) {
      const destinationSquare = currentSquare.getNearbySquare(candidateSquareIndex);
      // if (!destinationSquare) continue;
      if (destinationSquare?.isEmpty && (isRoyalNearby || destinationSquare.isZoneSame(currentSquare))) {
        moves.push(new Move(this, destinationSquare));
      }
    }
    return moves;
  }
}

export class Rajendra extends RoyalPiece {
  constructor(position: number, alliance: Alliance) {
    super(Piece.RAJENDRA, position, alliance);
  }
  calculateLegalMoves(board: Board) {
    const currentSquare = board.getSquareAt(this.position)!;
    const isRoyalNearby = currentSquare.isRoyalNearby();
    const moves: Move[] = [];
    if (currentSquare.isTruceZone) return isRoyalNearby ? this.hostilePath(board) : moves;

    for (const candidateSquareIndex of CROSS) {
      const destinationSquare = currentSquare.getNearbySquare(candidateSquareIndex);
      if (!destinationSquare) continue;

      if (isRoyalNearby || currentSquare.isZoneSame(destinationSquare)) {
        moves.push(...this.createMove(destinationSquare));
      }
    }

    for (const plusIndex of PLUS) {
      const destinationSquare = currentSquare.getNearbySquare(plusIndex);
      if (!destinationSquare) continue;

      const checkSquare = (candidateIndex = 0) => {
        const destinationSquare = currentSquare.getNearbySquare(candidateIndex + plusIndex * 2);
        if (destinationSquare && destinationSquare.isEmpty && !currentSquare.isZoneSame(destinationSquare)) {
          moves.push(new Move(this, destinationSquare));
        }
      };
      if (isRoyalNearby || currentSquare.isZoneSame(destinationSquare)) {
        if (destinationSquare.isEmpty) {
          moves.push(new Move(this, destinationSquare));
        } else if (this.canAttack(destinationSquare.piece)) {
          moves.push(new AttackMove(this, destinationSquare));
        } else if (destinationSquare.piece!.isRoyal) {
          const adjacentIndex = Math.abs(plusIndex) == 1 ? BOARD_SIZE : 1;
          checkSquare(-adjacentIndex);
          checkSquare();
          checkSquare(adjacentIndex);
        }
      }
    }
    return moves;
  }
  _calculateLegalMoves(board: Board) {
    const currentSquare = board.getSquareAt(this.position)!;
    const isRoyalNearby = currentSquare.isRoyalNearby();
    const moves: Move[] = [];
    if (currentSquare.isTruceZone) return isRoyalNearby ? this.hostilePath(board) : moves;

    for (const candidateSquareIndex of NEIGHBOURS) {
      const destinationSquare = currentSquare.getNearbySquare(candidateSquareIndex);
      if (!destinationSquare) continue;

      if (isRoyalNearby || destinationSquare.isZoneSame(currentSquare)) {
        if (destinationSquare.isEmpty) {
          moves.push(new Move(this, destinationSquare));
        } else if (!this.isOwnSide(destinationSquare.piece)) {
          moves.push(new AttackMove(this, destinationSquare));
        }
      }
    }
    return moves;
  }

  moveTo(move: Move) {
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