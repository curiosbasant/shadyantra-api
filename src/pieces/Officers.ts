import { Piece, Pyada, Rajrishi } from '.';
import { AttackMove, Board, Move, NormalMove, Square, WeakMove } from '../board';
import { Alliance } from '../player';
import { BOARD_SIZE, NEIGHBOURS, PLUS } from '../Utils';

export default abstract class OfficerPiece extends Piece {
  calculateLegalMoves(board: Board) {
    const currentSquare = this.square(board);

    /* if (board.activePlayer.isMyPiece(this)) {

    } else if (this.isFreezed) {
      return this.takeControl(board);
    } */

    return currentSquare.isTruceZone ? this.hostilePath(board) :
      currentSquare.isFreezed ? this.freezedMove(currentSquare) :
        this.vectorMove(currentSquare);
  }

  protected vectorMove(currentSquare: Square) {
    const moves: Move[] = [];
    for (const direction of this.type.legals) {
      let destinationSquare: Square | null = currentSquare;
      while ((destinationSquare = destinationSquare.getNearbySquare(direction)) && !destinationSquare.isCastle) {
        if (destinationSquare.isEmpty) {
          moves.push(new NormalMove(this, destinationSquare));
        } else if (destinationSquare.piece.isGodman && this.isOwnSide(destinationSquare.piece)) {
        } else {
          if (this.canCapture(destinationSquare)) {
            moves.push(new AttackMove(this, destinationSquare));
          }
          break;
        }
      }
    }
    return moves;
  }
  protected freezedMove(currentSquare: Square) {
    const moves: WeakMove[] = [];
    for (const direction of this.type.legals) {
      let destinationSquare: Square | null = currentSquare;
      while ((destinationSquare = destinationSquare.getNearbySquare(direction)) && !destinationSquare.isCastle) {
        if (destinationSquare.isFreezed) continue;

        if (destinationSquare.isEmpty) {
          moves.push(new WeakMove(this, destinationSquare));
        } else if (destinationSquare.piece.isGodman && this.isOwnSide(destinationSquare.piece)) {
          // nothing
        } else break;
      }
    }
    return moves;
  }
  protected normalChecker(moves: Move[], destinationSquare: Square, isResourceAvailable = true) {
    if (destinationSquare.isCastle) return;

    if (isResourceAvailable) {
      this.createMove(moves, destinationSquare);
      /* if (destinationSquare.isEmpty) {
        moves.push(new NormalMove(this, destinationSquare));
      } else if (this.canCapture(destinationSquare)) {
        moves.push(new AttackMove(this, destinationSquare));
      } */
    } else if (destinationSquare.isEmpty) {
      moves.push(new WeakMove(this, destinationSquare));
    }
  }
  protected freezedChecker(moves: Move[], destinationSquare: Square) {
    if (destinationSquare.isFreezed || destinationSquare.isCastle) return;
    if (destinationSquare.isEmpty) {
      moves.push(new WeakMove(this, destinationSquare));
    }
  }
  controlNearbySoldiers(board: Board) {
    const currentSquare = this.square(board);
    if (currentSquare.isFreezed) return;
    for (const relativeIndex of NEIGHBOURS) {
      const neighbourSquare = currentSquare.getNearbySquare(relativeIndex)!; // fake !
      if (currentSquare.isZoneSame(neighbourSquare) &&
        neighbourSquare.piece.isSoldier && this.isOwnSide(neighbourSquare.piece)) {
        neighbourSquare.isOfficerNearby = true;
      }
      // neighbourSquare.isOfficerNearby = currentSquare.isZoneSame(neighbourSquare) &&
      //   neighbourSquare.piece.isSoldier && this.isOwnSide(neighbourSquare.piece);
    }
  }
  canCapture(destinationSquare: Square) {
    return destinationSquare.isWarZone && super.canCapture(destinationSquare);
  }

  takeControl(board: Board) {
    const moves: NormalMove[] = [];
    for (const square of board.squares) {
      // continue if sqare is forbidden, castle or has checks
      if (square.isForbiddenZone || square.isCastle || square.candidatePieces.size) continue;
      moves.push(new NormalMove(this, square));

    }
    return moves;
  }
}

export class Senapati extends OfficerPiece {
  constructor(position: number, alliance: Alliance) {
    super(Piece.SENAPATI, position, alliance);
  }

  calculateLegalMoves(board: Board) {
    const currentSquare = this.square(board);
    if (currentSquare.isTruceZone) return this.hostilePath(board);

    const moves = (currentSquare.isFreezed ? this.freezedMove : this.vectorMove).bind(this)(currentSquare);
    const checker = (currentSquare.isFreezed ? this.freezedChecker : this.normalChecker).bind(this);
    for (const plusIndex of PLUS) {
      const resourceSquare = currentSquare.getNearbySquare(plusIndex)!;
      if (!resourceSquare.isWarZone || this.isEnemyOf(resourceSquare.piece)) continue;

      const checkSquare = (sign = 0) => {
        checker(moves, currentSquare.getNearbySquare(sign + plusIndex * 2)!);
        return checkSquare;
      };

      resourceSquare.isOccupied && checkSquare();
      const adjacentIndex = Math.abs(plusIndex) == 1 ? BOARD_SIZE : 1;
      checkSquare(-adjacentIndex)(adjacentIndex);
    }
    return moves;
  }

  moveTo(move: Move) {
    return new Senapati(move.destinationSquare.index, move.movedPiece.alliance);
  }
}
export class Ashvarohi extends OfficerPiece {
  constructor(position: number, alliance: Alliance) {
    super(Piece.ASHVAROHI, position, alliance);
  }

  calculateLegalMoves(board: Board) {
    const currentSquare = this.square(board);
    if (currentSquare.isTruceZone) return this.hostilePath(board);

    const moves: Move[] = [];
    const checker = (currentSquare.isFreezed ? this.freezedChecker : this.normalChecker).bind(this);
    for (const plusIndex of PLUS) {
      const resourceSquare = currentSquare.getNearbySquare(plusIndex)!;
      if (!resourceSquare.isWarZone || this.isEnemyOf(resourceSquare.piece)) continue;

      const isResourceAvailable = resourceSquare.isOccupied && !resourceSquare.piece.isGodman &&
        (!resourceSquare.piece.isSoldier || board.activePlayer.isFunderAlive);

      const checkSquare = (sign = 0) => {
        const neighbourSquare = currentSquare.getNearbySquare(sign + plusIndex * 2)!;
        checker(moves, neighbourSquare, isResourceAvailable);
        return checkSquare;
      };

      const adjacentIndex = Math.abs(plusIndex) == 1 ? BOARD_SIZE : 1;
      checkSquare(-adjacentIndex)(0)(adjacentIndex);
    }
    return moves;
  }

  moveTo(move: Move) {
    return new Ashvarohi(move.destinationSquare.index, move.movedPiece.alliance);
  }
}
export class Maharathi extends OfficerPiece {
  constructor(position: number, alliance: Alliance) {
    super(Piece.MAHARATHI, position, alliance);
  }

  moveTo(move: Move) {
    return new Maharathi(move.destinationSquare.index, move.movedPiece.alliance);
  }
}
export class Gajarohi extends OfficerPiece {
  constructor(position: number, alliance: Alliance) {
    super(Piece.GAJAROHI, position, alliance);
  }

  moveTo(move: Move) {
    return new Gajarohi(move.destinationSquare.index, move.movedPiece.alliance);
  }
}