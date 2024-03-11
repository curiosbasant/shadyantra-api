import { Alliance } from '.';
import { Board, ControlMove, Move, NormalMove, WeakMove } from '../board';
import { Arthshastri, Indra, OfficerPiece, Piece, Rajendra, Rajrishi, RoyalPiece } from '../pieces';

export default class Player {
  hasDeclaredWar = false;
  isOfferingDraw = false;
  readonly alliance: Alliance;
  legalMoves: Move[] = [];
  moves = new Map<Piece, Move[]>();
  arthshastri: Arthshastri | null = null;
  rajrishi: Rajrishi;
  indra!: Indra;
  private isInCheck = false;

  constructor(readonly board: Board, readonly pieces: Piece[]) {
    this.alliance = pieces[0].alliance;
    this.rajrishi = this.findRajrishi();
  }

  private findRajrishi() {
    const rajrishi = this.pieces.find(piece => piece.isGodman);
    if (!rajrishi) throw new Error("No Rajrishi on Board!");
    return rajrishi as Rajrishi;
  }
  calculateLegalMoves() {
    this.initPieces();
    if (!this.indra) throw new Error("No Indra on Board!");

    const toRetreat = this.indra.square(this.board).isTruceZone;
    for (const piece of this.pieces) {
      const currentSquare = piece.square(this.board);
      if (currentSquare.isForbiddenZone && !piece.isGodman) continue;
      const legals = piece.calculateLegalMoves(currentSquare, toRetreat);
      // this.legalMoves.push(...legals);
      this.moves.set(piece, legals);
    }
    // Control Opponent Officers surrounding Rajrishi
    for (const officer of this.rajrishi.adjacentOpponentOfficers) {
      const officerSquare = officer.square(this.board);
      const legals = officer.calculateLegalMoves(officerSquare, toRetreat), temp: Move[] = [];
      for (const { destinationSquare } of legals) {
        if (destinationSquare.isInAttack) continue;
        temp.push(new ControlMove(officer, destinationSquare));
      }
      this.moves.set(officer, temp);
    }
  }
  private initPieces() {
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
  }
  private filterPieces() {
    return this.board.builder.config.filter(piece => this.isMyPiece(piece)) as Piece[];
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