import { Piece, PieceType, PIECE_CLASS } from '.';
import { Board, Move, Square } from '../board';
import { Alliance } from '../player';
import { ADJACENT_DIRECTION, ORTHOGONAL_DIRECTION } from '../Utils';

export default abstract class OfficerPiece extends Piece {
  protected abstract maybeRetreatedPath(moves: Move[], currentSquare: Square, toRetreat: boolean): void;
  protected abstract unRetreatedPath(moves: Move[], currentSquare: Square): void;
  calculateLegalMoves(currentSquare: Square, toRetreat = false) {
    const moves: Move[] = [];
    if (!toRetreat || currentSquare.isOfMine) {
      this.maybeRetreatedPath(moves, currentSquare, toRetreat);
    }
    this.unRetreatedPath(moves, currentSquare);
    return moves;
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

  protected straightMovement(moves: Move[], currentSquare: Square, direction: number, toRetreat = false): Square {
    const loop = (refSquare: Square) => {
      const nextSquare = refSquare.getNearbySquare(direction);
      if (!nextSquare || toRetreat && nextSquare.isOfOpponent) return refSquare;

      return nextSquare.createMove(moves, currentSquare) ? nextSquare : loop(nextSquare);
    };
    return loop(currentSquare);
  }
  pinOpponentPieces(currentSquare: Square) {
    for (const plus of ORTHOGONAL_DIRECTION) {
      const path: Square[] = [], toFind: PieceType[] = [Piece.MAHARATHI, Piece.SENAPATI];
      for (let pieceToPin: Piece | null = null, adjacentSquare: Square | null = currentSquare;
        adjacentSquare && (adjacentSquare = adjacentSquare.getNearbySquare(plus));) {
        if (adjacentSquare.isEmpty) continue;
        if (this.isFriendly(adjacentSquare.piece)) break;
        if (pieceToPin) {

        } else {
          pieceToPin = adjacentSquare.piece;
        }
      }
    }
  }
}

export class Maharathi extends OfficerPiece {
  constructor(position: number, alliance: Alliance) {
    super(Piece.MAHARATHI, position, alliance);
  }

  maybeRetreatedPath(moves: Move[], currentSquare: Square, toRetreat: boolean) {
    const { left, forward, right } = this.alliance.direction;
    this.straightMovement(moves, currentSquare, left, toRetreat);
    this.straightMovement(moves, currentSquare, right, toRetreat);
    this.straightMovement(moves, currentSquare, forward, toRetreat);
  }
  unRetreatedPath(moves: Move[], currentSquare: Square) {
    const { backward } = this.alliance.direction;
    this.straightMovement(moves, currentSquare, backward);
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
    const { left, forward, right } = this.alliance.direction;
    this.straightMovement(moves, currentSquare, forward + left, toRetreat);
    this.straightMovement(moves, currentSquare, forward + right, toRetreat);
  }
  unRetreatedPath(moves: Move[], currentSquare: Square) {
    const { left, backward, right } = this.alliance.direction;
    this.straightMovement(moves, currentSquare, backward + left);
    this.straightMovement(moves, currentSquare, backward + right);
  }
  moveTo(move: Move) {
    return new Gajarohi(move.destinationSquare.index, move.movedPiece.alliance);
  }
}

abstract class KnightLike extends OfficerPiece {
  _trishoolMovement(moves: Move[], currentSquare: Square, rDir: number, toRetreat = false) {
    const resourceSquare = currentSquare.getNearbySquare(rDir)!; // fake !
    if (this.isBlocked(resourceSquare)) return;
    const destinationSquare = resourceSquare.getNearbySquare(rDir);
    if (!destinationSquare || toRetreat && destinationSquare.isOfOpponent) return;

    const isWeak = this.isWeak(resourceSquare),
      oDir = Math.abs(rDir) == 1 ? this.alliance.direction.forward : 1;
    this.knightMove(moves, currentSquare, rDir * 2 - oDir, isWeak || false);
    isWeak != null && this.knightMove(moves, currentSquare, rDir * 2, isWeak);
    this.knightMove(moves, currentSquare, rDir * 2 + oDir, isWeak || false);
  }
  protected isBlocked(frontSquare: Square | null) {
    return !frontSquare?.isWarZone || super.isBlocked(frontSquare);
  }
}

export class Senapati extends KnightLike {
  constructor(position: number, alliance: Alliance) {
    super(Piece.SENAPATI, position, alliance);
  }

  maybeRetreatedPath(moves: Move[], currentSquare: Square, toRetreat: boolean) {
    const { left, forward, right } = this.alliance.direction;
    this.trishoolMovement(moves, currentSquare, left, toRetreat);
    this.trishoolMovement(moves, currentSquare, forward, toRetreat);
    this.trishoolMovement(moves, currentSquare, right, toRetreat);
    this.straightMovement(moves, currentSquare, left, toRetreat);
    this.straightMovement(moves, currentSquare, forward + left, toRetreat);
    this.straightMovement(moves, currentSquare, forward, toRetreat);
    this.straightMovement(moves, currentSquare, forward + right, toRetreat);
    this.straightMovement(moves, currentSquare, right, toRetreat);
  }
  unRetreatedPath(moves: Move[], currentSquare: Square) {
    const { left, backward, right } = this.alliance.direction;
    this.straightMovement(moves, currentSquare, backward + left);
    this.straightMovement(moves, currentSquare, backward);
    this.straightMovement(moves, currentSquare, backward + right);
    this.trishoolMovement(moves, currentSquare, backward);
  }
  protected isWeak(resourceSquare: Square) {
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

  calculateLegalMoves(currentSquare: Square) {
    let moves: Move[] = [];
    if (currentSquare.isTruceZone) {
      for (const plus of ORTHOGONAL_DIRECTION) {
        const resourceSquare = currentSquare.getNearbySquare(plus);
        resourceSquare?.createWeakMove(moves, currentSquare);
      }
    } else
      moves = super.calculateLegalMoves(currentSquare);
    return moves;
  }

  maybeRetreatedPath(moves: Move[], currentSquare: Square, toRetreat: boolean) {
    const { left, forward, right } = this.alliance.direction;
    this.trishoolMovement(moves, currentSquare, left, toRetreat);
    this.trishoolMovement(moves, currentSquare, forward, toRetreat);
    this.trishoolMovement(moves, currentSquare, right, toRetreat);
  }
  unRetreatedPath(moves: Move[], currentSquare: Square) {
    const { backward } = this.alliance.direction;
    this.trishoolMovement(moves, currentSquare, backward);
  }
  protected isWeak(resourceSquare: Square) {
    return resourceSquare.isEmpty || resourceSquare.piece.isGodman ||
      resourceSquare.piece.isSoldier && resourceSquare.board.activePlayer.isFunderAlive;
  }

  moveTo(move: Move) {
    return new Ashvarohi(move.destinationSquare.index, move.movedPiece.alliance);
  }
}