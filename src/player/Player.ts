import { Alliance } from '.';
import { Board, Move, NormalMove, WeakMove } from '../board';
import { Arthshastri, Indra, OfficerPiece, Piece, Rajendra, Rajrishi, RoyalPiece } from '../pieces';

export default class Player {
  hasDeclaredWar = false;
  isOfferingDraw = false;
  readonly alliance: Alliance;
  legalMoves: Move[] = [];
  arthshastri: Arthshastri | null = null;
  rajrishi: Rajrishi;
  indra!: Indra;
  private isInCheck = false;

  constructor(readonly board: Board, readonly pieces: Piece[]) {
    this.alliance = pieces[0].alliance;
    this.rajrishi = this.findRajrishi();
  }

  private initPieces() {

  }

  private filterPieces() {
    return this.board.builder.config.filter(piece => this.isMyPiece(piece)) as Piece[];
  }
  private findRajrishi() {
    const rajrishi = this.pieces.find(piece => piece.isGodman);
    if (!rajrishi) throw new Error("No Rajrishi on Board!");
    return rajrishi as Rajrishi;
  }

  calculateLegalMoves() {
    for (const piece of this.pieces) {
      if (piece.isOfficer) {
        (piece as OfficerPiece).controlNearbySoldiers(this.board);
      } else if (piece.isRoyal) {
        if (piece instanceof Arthshastri) {
          this.arthshastri = piece;
        } else if (piece instanceof Indra) {
          this.indra = piece;
        }
        (piece as RoyalPiece).helpNearbyRoyals(this.board);
      }
    }

    if (!this.indra) throw new Error("No Indra on Board!");

    const toRetreat = this.indra.square(this.board).isTruceZone;
    for (const piece of this.pieces) {
      const currentSquare = this.board.getSquareAt(piece.position)!;
      const legals = piece.calculateLegalMoves(this.legalMoves, currentSquare, toRetreat);
      // this.legalMoves.push(...legals);
    }
    const safeSquares = this.board.squares.filter(square => !square.isInAttack);
    for (const officer of this.rajrishi.adjacentOpponentOfficers) {
      const officerMoves = safeSquares.map(square => new WeakMove(officer, square));
      this.legalMoves.push(...officerMoves);
    }
  }

  setOnCheck() {
    this.isInCheck = true;
  }

  isMyPiece(piece: Piece) {
    return !piece.isNull && this.alliance === piece.alliance;
  }

  get isRetreating() {
    return this.isOfferingDraw;
  }

  get isFunderAlive() {
    return this.arthshastri !== null;
  }
  get opponent() {
    return this.board.players[+(this.alliance == Alliance.BLACK)];
  }
}