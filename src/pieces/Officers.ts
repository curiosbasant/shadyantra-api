import { Piece, Pyada, Rajrishi } from '.';
import { AttackMove, Board, Move, NormalMove, Square, WeakMove } from '../board';
import { Alliance, Player } from '../player';
import { BOARD_SIZE, ADJACENT_DIRECTION, ORTHOGONAL_DIRECTION } from '../Utils';

export default abstract class OfficerPiece extends Piece {
  protected abstract maybeRetreatedPath(moves: Move[], currentSquare: Square, toRetreat: boolean): void;
  protected abstract unRetreatedPath(moves: Move[], currentSquare: Square): void;
  calculateLegalMoves(moves: Move[], currentSquare: Square, toRetreat = false) {
    if (!toRetreat || currentSquare.isOfMine) {
      this.maybeRetreatedPath(moves, currentSquare, toRetreat);
    }
    this.unRetreatedPath(moves, currentSquare);
  }
  controlNearbySoldiers(board: Board) {
    const currentSquare = this.square(board);
    if (currentSquare.isMediateZone) return;

    for (const relativeIndex of ADJACENT_DIRECTION) {
      const neighbourSquare = currentSquare.getNearbySquare(relativeIndex)!; // fake !
      if (currentSquare.isZoneSame(neighbourSquare) &&
        neighbourSquare.piece.isSoldier && this.isFriendly(neighbourSquare.piece)) {
        neighbourSquare.isOfficerNearby = true;
      }
    }
  }
  isDominantOn(destinationSquare: Square) {
    return destinationSquare.isWarZone && super.isDominantOn(destinationSquare);
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

  /** Returns true, if to break the loop */
  createMove(moves: Move[], square: Square) {
    if (square.isEmpty) {
      moves.push(new NormalMove(this, square));
    } else if (square.piece.isGodman && this.isFriendly(square.piece)) {
      // Found active player's Rajrishi
    } else {
      if (this.isDominantOn(square)) {
        moves.push(new AttackMove(this, square));
      }
      return true;
    }
  }

  protected straightMovement(moves: Move[], currentSquare: Square, direction: number, toRetreat = false): Square {
    let toBreakLoop = false;
    const loop = (refSquare: Square) => {
      const nextSquare = refSquare.getNearbySquare(direction);
      if (!nextSquare || toRetreat && nextSquare.isOfOpponent) return refSquare;

      toBreakLoop = nextSquare.createMove(moves, currentSquare);
      // if (currentSquare.isFreezed) {
      //   !nextSquare.isFreezed && (toBreakLoop = nextSquare.createWeakMove(moves, currentSquare));
      // } else {
      // }
      return toBreakLoop ? nextSquare : loop(nextSquare);
    };
    return loop(currentSquare);
  }
}

export class Maharathi extends OfficerPiece {
  constructor(position: number, alliance: Alliance) {
    super(Piece.MAHARATHI, position, alliance);
  }

  maybeRetreatedPath(moves: Move[], currentSquare: Square, toRetreat: boolean) {
    const dir = this.alliance.direction;
    this.straightMovement(moves, currentSquare, 1, toRetreat);
    this.straightMovement(moves, currentSquare, -1, toRetreat);
    this.straightMovement(moves, currentSquare, dir, toRetreat);
  }
  unRetreatedPath(moves: Move[], currentSquare: Square) {
    const dir = this.alliance.direction;
    this.straightMovement(moves, currentSquare, -dir);
  }
  moveTo(move: Move) {
    return new Maharathi(move.destinationSquare.index, move.movedPiece.alliance);
  }
}

export class Gajarohi extends OfficerPiece {
  constructor(position: number, alliance: Alliance) {
    super(Piece.GAJAROHI, position, alliance);
  }

  maybeRetreatedPath(moves: Move[], currentSquare: Square, toRetreat: boolean) {
    const dir = this.alliance.direction;
    this.straightMovement(moves, currentSquare, dir - 1, toRetreat);
    this.straightMovement(moves, currentSquare, dir + 1, toRetreat);
  }
  unRetreatedPath(moves: Move[], currentSquare: Square) {
    const dir = this.alliance.direction;
    this.straightMovement(moves, currentSquare, -dir - 1);
    this.straightMovement(moves, currentSquare, -dir + 1);
  }
  moveTo(move: Move) {
    return new Gajarohi(move.destinationSquare.index, move.movedPiece.alliance);
  }
}

abstract class KnightLike extends OfficerPiece {
  protected abstract isWeak(resourceSquare: Square): boolean | null;
  trishulMovement(moves: Move[], currentSquare: Square, rDir: number, toRetreat = false) {
    const resourceSquare = currentSquare.getNearbySquare(rDir),
      destinationSquare = currentSquare.getNearbySquare(rDir * 2);
    if (!resourceSquare || !destinationSquare || this.isEnemyOf(resourceSquare.piece) ||
      toRetreat && (resourceSquare.isOfOpponent || destinationSquare.isOfOpponent)) return;

    const isWeak = this.isWeak(resourceSquare),
      oDir = Math.abs(rDir) == 1 ? this.alliance.direction : 1;
    isWeak != null && this.knightMove(moves, currentSquare, rDir * 2, isWeak);
    this.knightMove(moves, currentSquare, rDir * 2 - oDir, isWeak || false);
    this.knightMove(moves, currentSquare, rDir * 2 + oDir, isWeak || false);
  }
  knightMove(moves: Move[], currentSquare: Square, direction: number, isWeak = false) {
    const destinationSquare = currentSquare.getNearbySquare(direction);
    isWeak ?
      destinationSquare?.createWeakMove(moves, currentSquare) :
      destinationSquare?.createMove(moves, currentSquare);
  }
}

export class Senapati extends KnightLike {
  constructor(position: number, alliance: Alliance) {
    super(Piece.SENAPATI, position, alliance);
  }

  maybeRetreatedPath(moves: Move[], currentSquare: Square, toRetreat: boolean) {
    const dir = this.alliance.direction;
    this.straightMovement(moves, currentSquare, dir - 1, toRetreat);
    this.straightMovement(moves, currentSquare, dir + 1, toRetreat);
    this.straightMovement(moves, currentSquare, 1, toRetreat);
    this.straightMovement(moves, currentSquare, -1, toRetreat);
    this.straightMovement(moves, currentSquare, dir, toRetreat);
    this.trishulMovement(moves, currentSquare, 1, toRetreat);
    this.trishulMovement(moves, currentSquare, -1, toRetreat);
    this.trishulMovement(moves, currentSquare, dir, toRetreat);
  }
  unRetreatedPath(moves: Move[], currentSquare: Square) {
    const dir = this.alliance.direction;
    this.straightMovement(moves, currentSquare, -dir - 1);
    this.trishulMovement(moves, currentSquare, -dir);
    this.straightMovement(moves, currentSquare, -dir + 1);
  }
  isWeak(resourceSquare: Square) {
    return resourceSquare.isEmpty && null;
  }
  moveTo(move: Move) {
    return new Senapati(move.destinationSquare.index, move.movedPiece.alliance);
  }
}

export class Ashvarohi extends KnightLike {
  constructor(position: number, alliance: Alliance) {
    super(Piece.ASHVAROHI, position, alliance);
  }

  calculateLegalMoves(moves: Move[], currentSquare: Square) {
    if (currentSquare.isTruceZone) {
      for (const plus of ORTHOGONAL_DIRECTION) {
        const resourceSquare = currentSquare.getNearbySquare(plus);
        resourceSquare?.createWeakMove(moves, currentSquare);
      }
    } else
      super.calculateLegalMoves(moves, currentSquare);
  }

  maybeRetreatedPath(moves: Move[], currentSquare: Square, toRetreat: boolean) {
    const dir = this.alliance.direction;
    this.trishulMovement(moves, currentSquare, 1, toRetreat);
    this.trishulMovement(moves, currentSquare, -1, toRetreat);
    this.trishulMovement(moves, currentSquare, dir, toRetreat);
  }
  unRetreatedPath(moves: Move[], currentSquare: Square) {
    const dir = this.alliance.direction;
    this.trishulMovement(moves, currentSquare, -dir);
  }
  isWeak(resourceSquare: Square) {
    return resourceSquare.isEmpty || resourceSquare.piece.isGodman ||
      resourceSquare.piece.isSoldier && resourceSquare.board.activePlayer.isFunderAlive;
  }

  moveTo(move: Move) {
    return new Ashvarohi(move.destinationSquare.index, move.movedPiece.alliance);
  }
}