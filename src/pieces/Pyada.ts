import { Piece } from '.';
import { AttackMove, Board, Move } from '../board';
import { Alliance } from '../player';
import { BOARD_SIZE } from '../Utils';


export default class Pyada extends Piece {
  constructor(position: number, alliance: Alliance) {
    super(Piece.PYADA, position, alliance);
  }

  calculateLegalMoves(board: Board) {
    const moves: Move[] = [];
    const currentSquare = board.getSquareAt(this.position)!;

    const isOfficerNearby = currentSquare.isOfficerNearby();
    // console.log(currentSquare.name, isOfficerNearby, currentSquare.piece?.type.name);

    if (!isOfficerNearby) return moves;

    const forwardSquare = currentSquare.getNearbySquare(this.alliance.direction * BOARD_SIZE)!;
    const processSquare = destinationSquare => {
      const move = this.createMove(destinationSquare, board.activePlayer.isFunderAlive && !currentSquare.isTruceZone);
      moves.push(...move);

      /* if (destinationSquare.isEmpty) {
        moves.push(new Move(this, destinationSquare));
      } else if (board.activePlayer.isFunderAlive && !currentSquare.isTruceZone && this.canAttack(destinationSquare.piece)) {
        moves.push(new AttackMove(this, destinationSquare));
      } */
    };
    const normalMovement = (relativeIndex: -1 | 0 | 1) => {
      const destinationSquare = forwardSquare.getNearbySquare(relativeIndex)!;
      processSquare(destinationSquare);
    };
    const lastRankMovement = (relativeIndex: -1 | 1) => {
      const destinationSquare = currentSquare.getNearbySquare(relativeIndex)!;
      if (destinationSquare.isTruceZone) return normalMovement(relativeIndex);
      processSquare(destinationSquare);
    };
    if (forwardSquare.isCastle) {
      lastRankMovement(-1);
      lastRankMovement(1);
    } else {
      normalMovement(-1);
      normalMovement(0);
      normalMovement(1);
    }
    /* for (const candidateSquareIndex of this.type.legals) {
      const destinationIndex = this.position + this.alliance.direction * candidateSquareIndex;
      const destinationSquare = board.getSquareAt(destinationIndex)!;

      if (destinationSquare.isCastle) break;
      if (destinationSquare.isTruceZone) continue;
      if (destinationSquare.isEmpty) {
        moves.push(new Move(this, destinationSquare));
      } else if (board.activePlayer.isFunderAlive && !currentSquare.isTruceZone && this.canAttack(destinationSquare.piece)) {
        moves.push(new AttackMove(this, destinationSquare));
      }
    } */
    return moves;
  }

  moveTo(move: Move) {
    return new Pyada(move.destinationSquare.index, move.movedPiece.alliance);
  }
}