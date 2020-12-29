import { Alliance } from '.';
import { Board, Move } from '../board';
import { Piece, Rajrishi } from '../pieces';


export default class Player {
  hasDeclaredWar = false;
  legalMoves: Move[] = [];
  pieces: Piece[];
  constructor(readonly board: Board, readonly alliance: Alliance) {
    this.pieces = this.filterPieces();
    const rajrishi = this.pieces.find(piece => piece instanceof Rajrishi) as Rajrishi;
    if (!rajrishi) throw new Error("No rajrishi on board!");
    rajrishi.freezeSurroundingOpponentOfficers(board);
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

  }
  get opponent() {
    return this.board.players[+(this.alliance == Alliance.BLACK)];
  }
}