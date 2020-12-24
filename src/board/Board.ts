import { Square, Move, BoardState } from '.';
import { Piece } from '../pieces';
import { Alliance, Player } from '../player';
import { BOARD_SIZE, TOTAL_SQUARES } from '../Utils';
import { SquareName, YuddhBhoomi, Naaglok, Rajkila, ViramBhoomi, SQUARE_FLAGS } from '.';


export default class Board {
  static generateBoard(board: Board) {
    const sqrs = new Map<SquareName, Square>()
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
        sqrs.set(name, new YuddhBhoomi(board, name));
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

  private calculateLegalMoves(boardAlignment: (Piece | null)[]) {
    const whiteLegals: Move[] = [], blackLegals: Move[] = [];
    for (const piece of boardAlignment) {
      if (!piece) continue;
      const legals = piece.calculateLegalMoves(this);
      for (const move of legals) move.destinationSquare.candidatePieces.add(piece);
      if (piece.alliance == Alliance.WHITE) {
        whiteLegals.push(...legals);
      } else {
        blackLegals.push(...legals);
      }
    }
    return [blackLegals, whiteLegals];
  }

  squares: Map<SquareName, Square>;
  players: [Player, Player];
  isWhiteTurn: boolean;

  constructor(readonly builder: Builder, isWhiteTurn = true) {
    this.isWhiteTurn = isWhiteTurn;
    this.squares = Board.generateBoard(this);
    const [blackLegals, whiteLegals] = this.calculateLegalMoves(builder.config);
    this.players = [
      new Player(this, Alliance.BLACK, blackLegals),
      new Player(this, Alliance.WHITE, whiteLegals)
    ];
  }
  
  createState() {
    return new BoardState(this);
  }
  restore(boardState: BoardState) {

  }

  getSquareAt(index: number) {
    return this.squares.get(SQUARE_FLAGS[index] as SquareName);
  }

  toFEN() {

  }

  toString() {
    return this.builder.config.reduce((str, piece, i) => {
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

export class Builder {
  config: (Piece | null)[] = Array(TOTAL_SQUARES).fill(null);

  setPiece(piece: Piece) {
    this.config[piece.position] = piece;
    return this;
  }

  build() {
    return new Board(this);
  }
}