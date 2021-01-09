import { Alliance } from '.';
import { Board, NormalMove, WeakMove } from '../board';
import { Arthshastri, OfficerPiece, Piece, Rajendra, Rajrishi, RoyalPiece } from '../pieces';

export default class Player {
  hasDeclaredWar = false;
  readonly alliance: Alliance;
  legalMoves: NormalMove[] = [];
  arthshastri: Arthshastri | null = null;
  rajrishi: Rajrishi;
  private isInCheck = false;

  constructor(readonly board: Board, readonly pieces: Piece[]) {
    this.alliance = pieces[0].alliance;
    this.rajrishi = this.findRajrishi();
  }

  private filterPieces() {
    return this.board.builder.config.filter(piece => this.isMyPiece(piece)) as Piece[];
  }
  private findRajrishi() {
    const rajrishi = this.pieces.find(piece => piece.isGodman);
    if (!rajrishi) throw new Error("No Rajrishi Found!");
    return rajrishi as Rajrishi;
  }

  calculateLegalMoves() {
    for (const piece of this.pieces) {
      if (piece instanceof OfficerPiece) {
        piece.controlNearbySoldiers(this.board);
      } else if (piece instanceof RoyalPiece) {
        piece.helpNearbyRoyals(this.board);
        if (piece instanceof Arthshastri) {
          this.arthshastri = piece;
        }
      }
    }
    for (const piece of this.pieces) {
      const legals = piece.calculateLegalMoves(this.board);
      this.legalMoves.push(...legals);
    }
    const safeSquares = this.board.squares.filter(square => !square.isProtected);
    for (const officer of this.rajrishi.controllableOpponentOfficers) {
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

  get isFunderAlive() {
    return this.arthshastri !== null;
  }
  get opponent() {
    return this.board.players[+(this.alliance == Alliance.BLACK)];
  }
}