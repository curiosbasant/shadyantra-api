import { Alliance } from '.';
import { Board, Move } from '../board';
import { Arthshastri, Piece, Rajendra, Rajrishi } from '../pieces';


export default class Player {
  hasDeclaredWar = false;
  legalMoves: Move[] = [];
  pieces: Piece[];
  arthSashtri: Piece | null = null;
  private isInCheck = false;
  constructor(readonly board: Board, readonly alliance: Alliance) {
    this.pieces = this.filterPieces();
    for (const piece of this.pieces) {
      if (piece instanceof Rajendra) {

      } else if (piece instanceof Rajrishi) {
        piece.freezeSurroundingOpponentOfficers(board);
      } else if (piece instanceof Arthshastri) {
        this.arthSashtri = piece;
      } else {

      }
    }
    // const rajrishi = this.pieces.find(piece => piece instanceof Rajrishi) as Rajrishi;
    // if (!rajrishi) throw new Error("No rajrishi on board!");
    // rajrishi.freezeSurroundingOpponentOfficers(board);
  }
  // rajendra: Piece;
  // rajrishi: Piece;
  /* constructor(readonly board: Board, readonly legalMoves: Move[], readonly opponentLegalMoves: Move[]) {
    this.alliance = legalMoves[0].movedPiece.alliance;
    const rajendra = pieces.find(piece => piece.isRajendra);
    const rajrishi = pieces.find(piece => piece.isRajrishi);
    // console.log(legalMoves, indra);
    if (!rajendra || !rajrishi) throw new Error("No Rajendra or Rajrishi found. Invalid Board");
    this.rajendra = rajendra;
    this.rajrishi = rajrishi;
  } */

  private filterPieces() {
    return this.board.builder.config.filter(piece => piece?.alliance === this.alliance) as Piece[];
  }

  calculateLegalMoves() {
    for (const piece of this.pieces) {
      const legals = piece.calculateLegalMoves(this.board);

      this.legalMoves.push(...legals);
    }
  }

  setOnCheck() {
    this.isInCheck = true;
  }

  isMyPiece(piece: Piece | null) {
    return this.alliance === piece?.alliance;
  }
  
  get isFunderAlive() {
    return this.arthSashtri !== null;
  }
  get opponent() {
    return this.board.players[+(this.alliance == Alliance.BLACK)];
  }
}