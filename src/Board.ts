import Alliance from './Alliance';
import Bhoomi, { Naaglok, Rajkila, SquareName, SQUARE_FLAGS, ViramBhoomi } from './Square';
import Player from './Player';
import { BOARD_SIZE, TOTAL_SQUARES } from './Utils';
import Piece from './pieces';

export default class Board {
  static generateBoard(board: Board) {
    const sqrs = new Map<SquareName, Bhoomi>()
      .set('x0', new Naaglok(board, 'x0'))
      .set('y0', new Naaglok(board, 'y0'))
      .set('x9', new Naaglok(board, 'x9'))
      .set('y9', new Naaglok(board, 'y9'));

    for (const file of 'abcdefgh') {
      // Set Rajkila
      let name = `${ file }0` as SquareName;
      sqrs.set(name, new Rajkila(board, name));
      name = `${ file }9` as SquareName;
      sqrs.set(name, new Rajkila(board, name));

      // Set YuddhBhumi
      for (let rank = 1; rank < BOARD_SIZE - 1; rank++) {
        name = `${ file }${ rank }` as SquareName;
        sqrs.set(name, new Rajkila(board, name));
      }
    }

    // Set ViramBhumi on X and Y file
    for (let rank = 1; rank < BOARD_SIZE - 1; rank++) {
      let name = `x${ rank }` as SquareName;
      sqrs.set(name, new ViramBhoomi(board, name));
      name = `y${ rank }` as SquareName;
      sqrs.set(name, new ViramBhoomi(board, name));
    }

    return sqrs;
  }
  moves = 0;
  alignment: (Piece | null)[] = Array(TOTAL_SQUARES).fill(null);
  private squares: Map<SquareName, Bhoomi>;
  players = [
    new Player(new Alliance('BLACK', -BOARD_SIZE)),
    new Player(new Alliance('WHITE', BOARD_SIZE))
  ];
  isWhiteTurn: boolean;

  constructor(isWhiteTurn = true) {
    this.isWhiteTurn = isWhiteTurn;
    this.squares = Board.generateBoard(this);
    this.players.forEach((player, i, arr) => player.alliance.setOpponent(arr[i ^ 1].alliance));
  }

  private calculateLegals() {
    for (const piece of this.alignment) {
      if (!piece) continue;
      const legals = piece.calculateLegalMoves();
      for (const move of legals) move.destinationSquare.candidatePieces.push(piece);
    }
  }
  setPiece(piece: Piece) {
    this.alignment[piece.position] = piece;
  }

  getSquareAt(index: number) {
    return this.squares.get(SQUARE_FLAGS[index] as SquareName);
  }

  toFEN() {

  }

  toString() {
    return this.alignment.reduce((str, piece, i) => {
      let temp = piece ? piece.notation : '∙';
      if (!((i + 1) % BOARD_SIZE)) temp += '\n';
      return str + '  ' + temp;
    }, '\n');
    /* let str = '\n';
    for (let rank = BHOOMI_SIZE - 1; rank > -1; rank--) {
      for (const file of 'xabcdefghy') {
        // @ts-ignore
        str += this.squares.get(`${ file }${ rank }`)!.name + ' ';
        str += this.alignment[5] ? this.alignment[5].notation : '-';
      }
      str += '\n';
    }
    return str; */


    // return [...this.squares.values()].reduce((str, sqr, i) => str += `${sqr.name}${(i+1) % BHOOMI_SIZE ? ' ' : '\n'}`, '\n')
  }

  print() {
    console.log(this.toString());
  }
  get activePlayer() {
    return this.players[+this.isWhiteTurn];
  }
  get opponentPlayer() {
    return this.players[+!this.isWhiteTurn];
  }
}