import { Piece } from '.';
import { AttackMove, Board, Move } from '../board';
import { Alliance } from '../player';
import { BOARD_SIZE, PLUS } from '../Utils';

abstract class OfficerPiece extends Piece {
  calculateLegalMoves(board: Board) {
    const currentSquare = board.getSquareAt(this.position)!;

    if (this.alliance == board.activePlayer.alliance) {
      
    } else if (this.isFreezed) {
      return this.takeControl(board);
    }
    
    if (currentSquare.isTruceZone) {
      return this.bailPath(board);
    }
    return this.vectorMove(board);
  }
  protected vectorMove(board: Board) {
    const moves = this.type.legals.map<Move[]>(direction => this.lineMove(board, direction)).flat();

    return moves;
  }
  private lineMove(board: Board, direction: number) {
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
    for (const square of board.squares.values()) {
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

abstract class KnightLikeOfficer extends OfficerPiece {
  protected knightMove(board: Board, needsResource = false) {
    const currentSquare = board.getSquareAt(this.position)!;
    const moves: Move[] = [];
    for (const plusIndex of PLUS) {
      const resourceSquare = currentSquare.getNearbySquare(plusIndex);
      if (!currentSquare.isOfSameZoneAs(resourceSquare)) continue;
      const isResourceAvailable = !needsResource || this.isOfSameSide(resourceSquare!.piece);
      const relative = this.position + plusIndex * 2;
      const checkSquare = (candidateIndex = 0) => {
        const destinationSquare = board.getSquareAt(candidateIndex + relative)!;
        if (destinationSquare.isCastle) return;
        if (destinationSquare.isEmpty) {
          moves.push(new Move(this, destinationSquare));
        } else if (destinationSquare.isWarZone && isResourceAvailable && this.canAttack(destinationSquare.piece)) {
          moves.push(new AttackMove(this, destinationSquare));
        }
      };
      const adjacentIndex = Math.abs(plusIndex) == 1 ? BOARD_SIZE : 1;
      checkSquare(-adjacentIndex);
      checkSquare(adjacentIndex);
      needsResource && checkSquare();
    }

    return moves;
  }
}

export class Senapati extends KnightLikeOfficer {
  constructor(position: number, alliance: Alliance) {
    super(Piece.SENAPATI, position, alliance);
  }

  calculateLegalMoves(board: Board) {
    const currentSquare = board.getSquareAt(this.position)!;
    if (currentSquare.isTruceZone) return this.bailPath(board);

    const moves = this.vectorMove(board);
    moves.push(...this.knightMove(board));
    return moves;
  }

  private _knightMove(board: Board, candidateIndexes: number[]) {
    const moves: Move[] = [];
    for (const candidateSquareIndex of candidateIndexes) {
      const destinationIndex = this.position + candidateSquareIndex;
      const destinationSquare = board.getSquareAt(destinationIndex);
      if (destinationSquare === undefined) return moves;

      if (destinationSquare.isEmpty) {
        moves.push(new Move(this, destinationSquare));
      } else if (this.canAttack(destinationSquare.piece)) {
        moves.push(new AttackMove(this, destinationSquare));
      }
    }
    return moves;
  }

  moveTo(move: Move) {
    return new Senapati(move.destinationSquare.index, move.movedPiece.alliance);
  }
}
export class Ashvarohi extends KnightLikeOfficer {
  constructor(position: number, alliance: Alliance) {
    super(Piece.ASHVAROHI, position, alliance);
  }

  calculateLegalMoves(board: Board) {
    const currentSquare = board.getSquareAt(this.position)!;
    return currentSquare.isTruceZone ? this.bailPath(board) : this.knightMove(board, true);
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