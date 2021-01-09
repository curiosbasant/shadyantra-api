import { BoardState, CastleZone, ForbiddenZone, NormalMove, Square, SquareName, SQUARE_FLAGS, TruceZone, WarZone } from '.';
import { NullPiece, Piece, Rajrishi } from '../pieces';
import { Alliance, Player } from '../player';
import { BOARD_LAYOUT, BOARD_SIZE, NEIGHBOURS, TOTAL_SQUARES } from '../Utils';


export default class Board {
  readonly #squares = new Map<SquareName, Square>();
  readonly players: [Player, Player];

  constructor(readonly builder: Builder, readonly isWhiteTurn = true) {
    this.generateBoard();
    const [whitePieces, blackPieces] = this.dividePieces();
    this.players = [
      new Player(this, blackPieces),
      new Player(this, whitePieces),
    ];
    this.opponentPlayer.rajrishi.freezeSurroundingSquares(this);
    // this.activePlayer.rajrishi.freezeSurroundingSquares(this);
    this.activePlayer.rajrishi.controlSurroundingOfficers(this);

    // this.opponentPlayer.calculateLegalMoves();
    this.activePlayer.calculateLegalMoves();
  }

  /** Creates the board with all the squares */
  private generateBoard() {
    for (const file of 'abcdefgh') {
      // Set Castle
      let name = `${ file }0` as SquareName;
      this.setSquare(new CastleZone(this, name, Alliance.WHITE));
      name = `${ file }9` as SquareName;
      this.setSquare(new CastleZone(this, name, Alliance.BLACK));

      // Set WarZone
      for (let rank = 1; rank < BOARD_SIZE - 1; rank++) {
        name = `${ file }${ rank }` as SquareName;
        this.setSquare(new WarZone(this, name));
      }
    }

    // Set TruceZone on X and Y file
    for (let rank = 1; rank < BOARD_SIZE - 1; rank++) {
      let name = `x${ rank }` as SquareName;
      this.setSquare(new TruceZone(this, name));
      name = `y${ rank }` as SquareName;
      this.setSquare(new TruceZone(this, name));
    }

    this // Set ForbiddenZone
      .setSquare(new ForbiddenZone(this, 'x0'))
      .setSquare(new ForbiddenZone(this, 'y0'))
      .setSquare(new ForbiddenZone(this, 'x9'))
      .setSquare(new ForbiddenZone(this, 'y9'));
  }
  
  private dividePieces() {
    const whitePieces: Piece[] = [], blackPieces: Piece[] = [];
    for (const piece of this.builder.config) {
      if (piece.isNull) continue;
      (piece.alliance == Alliance.WHITE ? whitePieces : blackPieces).push(piece);
    }
    return [whitePieces, blackPieces];
  }

  /** Returns the square from current board at provided index */
  getSquareAt(index: number) {
    return this.#squares.get(SQUARE_FLAGS[index] as SquareName);
  }

  createState() {
    return new BoardState(this);
  }
  restore(boardState: BoardState) {

  }
  getSquareWithName(name: SquareName) {
    return this.#squares.get(name);
  }

  toFEN() {

  }

/** Converts the board to a printable string. */
  toString() {
    const layout = BOARD_LAYOUT.slice();
    for (const piece of this.builder.config) {
      if (piece.isNull) continue;
      const row = (piece.position / BOARD_SIZE | 0) + 1;
      layout[piece.position + row] = piece.notation;
    }
    return layout.join('  ') + '\n';
  }

/** Prints the board to the console. */
  print() {
    console.log(this.toString());
  }

  setSquare(square: Square) {
    this.#squares.set(square.name, square);
    return this;
  }

/** Returns the board squares in an array */
  get squares() {
    return [...this.#squares.values()];
  }
  get activePlayer() {
    return this.players[+this.isWhiteTurn];
  }
  get opponentPlayer() {
    return this.players[+!this.isWhiteTurn];
  }
}

export class Builder {
  config: Piece[];
  constructor(alignment = Array<Piece>(TOTAL_SQUARES).fill(Piece.NULL_PIECE)) {
    this.config = alignment;
  }

  setPiece(piece: Piece) {
    this.config[piece.position] = piece;
    return this;
  }
  removePiece(index: number) {
    this.config[index] = Piece.NULL_PIECE;
    return this;
  }

  copyAlignment() {
    return this.config.slice();
  }

  build() {
    return new Board(this);
  }
}