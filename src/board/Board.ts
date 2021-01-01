import { BoardState, CastleZone, ForbiddenZone, Move, Square, SquareName, SQUARE_FLAGS, TruceZone, WarZone } from '.';
import { Piece, Rajrishi } from '../pieces';
import { Alliance, Player } from '../player';
import { BOARD_LAYOUT, BOARD_SIZE, NEIGHBOURS, TOTAL_SQUARES } from '../Utils';


export default class Board {
  readonly #squares = new Map<SquareName, Square>();
  players: [Player, Player];
  isWhiteTurn: boolean;

  constructor(readonly builder: Builder, isWhiteTurn = true) {
    this.isWhiteTurn = isWhiteTurn;
    this.generateBoard();
    this.players = [
      new Player(this, Alliance.BLACK),
      new Player(this, Alliance.WHITE),
    ];
    this.opponentPlayer.calculateLegalMoves();
    this.activePlayer.calculateLegalMoves();
  }

  generateBoard() {
    const sqrs = new Map<SquareName, Square>();

    for (const file of 'abcdefgh') {
      // Set Castle
      let name = `${ file }0` as SquareName;
      sqrs.set(name, new CastleZone(this, name, Alliance.BLACK));
      name = `${ file }9` as SquareName;
      sqrs.set(name, new CastleZone(this, name, Alliance.WHITE));

      // Set WarZone
      for (let rank = 1; rank < BOARD_SIZE - 1; rank++) {
        name = `${ file }${ rank }` as SquareName;
        sqrs.set(name, new WarZone(this, name));
      }
    }

    // Set TruceZone on X and Y file
    for (let rank = 1; rank < BOARD_SIZE - 1; rank++) {
      let name = `x${ rank }` as SquareName;
      sqrs.set(name, new TruceZone(this, name));
      name = `y${ rank }` as SquareName;
      sqrs.set(name, new TruceZone(this, name));
    }

    return sqrs
      // Set ForbiddenZone
      .set('x0', new ForbiddenZone(this, 'x0'))
      .set('y0', new ForbiddenZone(this, 'y0'))
      .set('x9', new ForbiddenZone(this, 'x9'))
      .set('y9', new ForbiddenZone(this, 'y9'));
  }



  createState() {
    return new BoardState(this);
  }
  restore(boardState: BoardState) {

  }

/** Returns the square from current board at provided index */
  getSquareAt(index: number) {
    return this.#squares.get(SQUARE_FLAGS[index] as SquareName);
  }
  getSquareWithName(name: SquareName) {
    return this.#squares.get(name);
  }

  toFEN() {

  }

  toString() {
    const layout = BOARD_LAYOUT.slice();
    this.builder.config.map((piece, i) => {
      if (!piece) return;
      const row = (piece.position / BOARD_SIZE | 0) + 1;
      layout[piece.position + row] = piece.notation;
    });
    return layout.join('  ') + '\n';
  }

  print() {
    console.log(this.toString());
  }

  setSquare(square: Square) {
    this.#squares.set(square.name, square);
  }

  get squares() {
    return this.#squares.values();
  }
  get activePlayer() {
    return this.players[+this.isWhiteTurn];
  }
  get opponentPlayer() {
    return this.players[+!this.isWhiteTurn];
  }
}

export class Builder {
  config: (Piece | null)[];

  constructor(alignment = Array<Piece | null>(TOTAL_SQUARES).fill(null)) {
    this.config = alignment;
  }

  setPiece(piece: Piece) {
    this.config[piece.position] = piece;
    return this;
  }
  removePiece(index: number) {
    this.config[index] = null;
    return this;
  }

  copyAlignment() {
    return this.config.slice();
  }

  build() {
    return new Board(this);
  }
}