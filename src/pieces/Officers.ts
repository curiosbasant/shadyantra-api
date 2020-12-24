import { Piece, PieceType } from '.';
import { Board, Move, AttackMove } from '../board';
import { Alliance } from '../player';
import { KNIGHT, NEIGHBOURS } from '../Utils';

export default class OfficerPiece extends Piece {
  isFreezed = false;
  constructor(type: PieceType, position: number, alliance: Alliance) {
    super(type, position, alliance);
  }
  calculateLegalMoves(board: Board) {
    const currentSquare = board.getSquareAt(this.position)!;

    if (currentSquare.isViramBhumi) {
      return this.bailPath(board);
    }
    return this.vectorMove(board);
  }
  protected bailPath(board: Board) {
    const moves: Move[] = [];

    for (const candidateSquareIndex of NEIGHBOURS) {
      const destinationIndex = this.position + candidateSquareIndex;
      const destinationSquare = board.getSquareAt(destinationIndex)!;
      if (destinationSquare.isYuddhBhumi && destinationSquare.isEmpty) {
        moves.push(new Move(this, destinationSquare));
      }
    }

    return moves;
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

      if (destinationSquare.isYuddhBhumi) {
        if (destinationSquare.isEmpty) {
          moves.push(new Move(this, destinationSquare));
          continue;
        } else {
          if (this.alliance == destinationSquare.piece!.alliance) {
            moves.push(new AttackMove(this, destinationSquare));
          }
          break;
        }
      }

      // push move and break if file is x or y
      if ((destinationSquare.isViramBhumi || destinationSquare.isNaaglok) && destinationSquare.isEmpty) {
        moves.push(new Move(this, destinationSquare));
      }
      break;
    }
    return moves;
  }

  protected staticMove(board: Board, candidateIndexes: number[]) {
    const moves: Move[] = [];
    for (const candidateSquareIndex of candidateIndexes) {
      const destinationIndex = this.position + candidateSquareIndex;
      const destinationSquare = board.getSquareAt(destinationIndex);
      if (destinationSquare === undefined) return moves;

      if (destinationSquare.isEmpty) {
        moves.push(new Move(this, destinationSquare));
      } else if (this.alliance == destinationSquare.piece!.alliance) {
        moves.push(new AttackMove(this, destinationSquare));
      }
    }
    return moves;
  }
}

export class Senapati extends OfficerPiece {
  constructor(position: number, alliance: Alliance) {
    super(Piece.SENAPATI, position, alliance);
  }

  calculateLegalMoves(board: Board) {
    const currentSquare = board.getSquareAt(this.position)!;
    if (currentSquare.isViramBhumi) {
      return this.bailPath(board);
    }

    const moves = this.vectorMove(board);
    moves.push(...this.staticMove(board, [...KNIGHT]));
    return moves;
  }
}

export class Ashvarohi extends OfficerPiece {
  constructor(position: number, alliance: Alliance) {
    super(Piece.ASHVAROHI, position, alliance);
  }
}
export class Maharathi extends OfficerPiece {
  constructor(position: number, alliance: Alliance) {
    super(Piece.MAHARATHI, position, alliance);
  }
}
export class Gajarohi extends OfficerPiece {
  constructor(position: number, alliance: Alliance) {
    super(Piece.GAJAROHI, position, alliance);
  }
}