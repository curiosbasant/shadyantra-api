import { Piece } from '.';
import { Board, Move, AttackMove } from '../board';
import { Alliance } from '../player';
import { NEIGHBOURS } from '../Utils';


export default class Pyada extends Piece {
  constructor(position: number, alliance: Alliance) {
    super(Piece.PYADA, position, alliance);
  }

  calculateLegalMoves(board: Board) {
    const moves: Move[] = [];
    
    const isOfficerNearby = cdd => {
      const piece = board.builder.config[this.position + cdd];
      return !piece ? false : piece.isOfficer;
    };
    if (!NEIGHBOURS.some(isOfficerNearby)) return moves;

    for (const candidateSquareIndex of this.type.legals) {
      const destinationIndex = this.position + this.alliance.direction * candidateSquareIndex;
      const destinationSquare = board.getSquareAt(destinationIndex);
      if (destinationSquare === undefined) continue;
      if (destinationSquare.isEmpty) {
        moves.push(new Move(this, destinationSquare));
      } else if (this.alliance == destinationSquare.piece!.alliance) {
        moves.push(new AttackMove(this, destinationSquare));
      }
    }
    return moves;
  }
}