import { Piece, Pyada, Rajrishi } from '.';
import { AttackMove, Board, Move } from '../board';
import { Alliance } from '../player';
import { BOARD_SIZE, PLUS } from '../Utils';

abstract class OfficerPiece extends Piece {
  calculateLegalMoves(board: Board) {
    const currentSquare = board.getSquareAt(this.position)!;

    /* if (board.activePlayer.isMyPiece(this)) {

    } else if (this.isFreezed) {
      return this.takeControl(board);
    } */

    return currentSquare.isTruceZone ? this.hostilePath(board) : this.vectorMove(board);
  }
  protected vectorMove(board: Board) {
    const moves = this.type.legals.map<Move[]>(direction => this.lineMove(board, direction)).flat();

    return moves;
  }
  protected lineMove(board: Board, direction: number) {
    const moves: Move[] = [];
    let destinationIndex = this.position;
    while (true) {
      destinationIndex += direction;
      const destinationSquare = board.getSquareAt(destinationIndex)!;

      if (destinationSquare.isWarZone) {
        if (destinationSquare.isEmpty) {
          moves.push(new Move(this, destinationSquare));
          continue;
        } else if (this.canAttack(destinationSquare.piece)) {
          moves.push(new AttackMove(this, destinationSquare));
        }
        // push move and break if file is x or y
      } else if (!destinationSquare.isCastle && destinationSquare.isEmpty) {
        moves.push(new Move(this, destinationSquare));
      }
      break;
    }
    return moves;
  }

  takeControl(board: Board) {
    const moves: Move[] = [];
    for (const square of board.squares) {
      // continue if sqare is forbidden, castle or has checks
      if (square.isForbiddenZone || square.isCastle || square.candidatePieces.size) continue;
      moves.push(new Move(this, square));

    }
    return moves;
  }

  canAttack(piece: Piece | null) {
    return super.canAttack(piece) && !piece!.isFreezed;
  }
}

export class Senapati extends OfficerPiece {
  constructor(position: number, alliance: Alliance) {
    super(Piece.SENAPATI, position, alliance);
  }

  calculateLegalMoves(board: Board) {
    const currentSquare = board.getSquareAt(this.position)!;
    if (currentSquare.isTruceZone) return this.hostilePath(board);

    const moves = this.vectorMove(board);
    for (const plusIndex of PLUS) {
      const resourceSquare = currentSquare.getNearbySquare(plusIndex)!;
      if (!currentSquare.isZoneSame(resourceSquare) || this.isEnemyOf(resourceSquare.piece)) continue;

      const checkSquare = (candidateIndex = 0) => {
        const destinationSquare = currentSquare.getNearbySquare(candidateIndex + plusIndex * 2)!;
        if (destinationSquare.isCastle) return;
        const move = this.createMove(destinationSquare, destinationSquare.isWarZone);
        moves.push(...move);
      };

      if (resourceSquare.isOccupied) checkSquare();
      const adjacentIndex = Math.abs(plusIndex) == 1 ? BOARD_SIZE : 1;
      checkSquare(-adjacentIndex);
      checkSquare(adjacentIndex);
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
    const currentSquare = board.getSquareAt(this.position)!;
    if (currentSquare.isTruceZone) return this.hostilePath(board);

    const moves: Move[] = [];
    for (const plusIndex of PLUS) {
      const resourceSquare = currentSquare.getNearbySquare(plusIndex)!;
      const resourcePiece = resourceSquare.piece!; // It can be null
      if (!currentSquare.isZoneSame(resourceSquare) || this.isEnemyOf(resourcePiece)) continue;
      const isResourceAvailable = resourceSquare.isOccupied && !resourcePiece.isGodman &&
        (!resourcePiece.isSoldier || board.activePlayer.isFunderAlive);

      const checkSquare = (candidateIndex = 0) => {
        const destinationSquare = currentSquare.getNearbySquare(candidateIndex + plusIndex * 2)!;
        if (destinationSquare.isCastle) return;
        const move = this.createMove(destinationSquare, destinationSquare.isWarZone && isResourceAvailable);
        moves.push(...move);
      };
      const adjacentIndex = Math.abs(plusIndex) == 1 ? BOARD_SIZE : 1;
      checkSquare(-adjacentIndex);
      checkSquare();
      checkSquare(adjacentIndex);
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