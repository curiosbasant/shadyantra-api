import { Piece } from '.';
import { AttackMove, Board, Move, NormalMove, Square, WeakMove } from '../board';
import { Alliance } from '../player';
import { BOARD_SIZE } from '../Utils';


export default class Pyada extends Piece {
  constructor(position: number, alliance: Alliance) {
    super(Piece.PYADA, position, alliance);
  }

  calculateLegalMoves(board: Board) {
    const moves: Move[] = [];
    const currentSquare = this.square(board);
    if (!currentSquare.isOfficerNearby) return moves;
    // console.log(currentSquare.name, isOfficerNearby, currentSquare.piece?.type.name);

    const forwardSquare = currentSquare.getNearbySquare(this.alliance.direction * BOARD_SIZE)!;
    const processSquare = (destinationSquare: Square) => {
      // const move = this.createMove(destinationSquare, board.activePlayer.isFunderAlive && !currentSquare.isTruceZone);
      // moves.push(...move);

      if (board.activePlayer.isFunderAlive) {
        this.createMove(moves, destinationSquare);
        // if (destinationSquare.isEmpty) {
        //   moves.push(new NormalMove(this, destinationSquare));
        // } esslse if (this.canCapture(destinationSquare)) {
        //   moves.push(new AttackMove(this, destinationSquare));
        // }
      } else if (destinationSquare.isEmpty) {
        moves.push(new WeakMove(this, destinationSquare));
      }
    };
    const forwardMovement = (relativeIndex: -1 | 0 | 1) => {
      const destinationSquare = forwardSquare.getNearbySquare(relativeIndex)!;
      processSquare(destinationSquare);
      return forwardMovement;
    };
    const sidewayMovement = (relativeIndex: -1 | 1) => {
      const sideSquare = currentSquare.getNearbySquare(relativeIndex)!;
      sideSquare.isTruceZone ? forwardMovement(relativeIndex) : processSquare(sideSquare);
      return sidewayMovement;
    };
    if (forwardSquare.isCastle) {
      sidewayMovement(-1)(1);
    } else {
      processSquare(forwardSquare);
      forwardMovement(-1)(1);
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