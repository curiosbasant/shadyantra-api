import { Piece } from '.';
import { Move, Square } from '../board';
import { Alliance } from '../player';


export default class Pyada extends Piece {
  constructor(position: number, alliance: Alliance) {
    super(Piece.PYADA, position, alliance);
  }

  calculateLegalMoves(currentSquare: Square, toRetreat = false) {
    const moves: Move[] = [];
    if (!currentSquare.isOfficerNearby) return moves;
    const isWeak = !currentSquare.board.activePlayer.isFunderAlive;
    const { forward, backward } = this.alliance.direction;
    // const referenceIndex = toRetreat && currentSquare.isOfOpponent ? -dir : dir;
    const forwardSquare = currentSquare.forwardSquare!;

    if (!toRetreat) {
      if (forwardSquare.isCastle) {
        const fun = (index: number) => {
          let sideSquare = currentSquare.getNearbySquare(index)!;
          if (sideSquare.isTruceZone) sideSquare = forwardSquare.getNearbySquare(index)!;
          isWeak ?
            sideSquare.createWeakMove(moves, currentSquare) :
            sideSquare.createMove(moves, currentSquare);
        };
        fun(-1);
        fun(1);
      } else
        this.trishoolMovement(moves, currentSquare, forward, isWeak);
    } else if (currentSquare.isOfOpponent) {
      this.trishoolMovement(moves, currentSquare, backward, isWeak);
    } else if (forwardSquare.isOfMine) {
      this.trishoolMovement(moves, currentSquare, forward, isWeak);
    }
    return moves;
  }
  trishoolMovement(moves: Move[], currentSquare: Square, headDir: number, isWeak: boolean) {
    const { left, right } = this.alliance.direction;
    this.knightMove(moves, currentSquare, headDir + left, isWeak);
    this.knightMove(moves, currentSquare, headDir, isWeak);
    this.knightMove(moves, currentSquare, headDir + right, isWeak);
  }
  moveTo(move: Move) {
    return new Pyada(move.destinationSquare.index, move.movedPiece.alliance);
  }
}