import { EventEmitter } from 'events';
import path from 'path';
import { performance } from 'perf_hooks';
import requireAll from 'require-all';
import { Board, Builder, History, Move, SquareName, SQUARE_FLAGS, WeakMove } from '.';
import { Piece, PieceFactory, PieceNotation, PieceSymbol } from '../pieces';
import { Alliance } from '../player';
import { BOARD_SIZE, DEFAULT_FEN, EVENT, TOTAL_SQUARES } from '../Utils';


interface ChessOption {
  isWhiteTurn?: boolean;
}

type MoveString = `${ SquareName }${ SquareName }`;
type MoveObject = {
  from: SquareName | number,
  to: SquareName | number;
};

export default class ShadYantra extends EventEmitter {
  board!: Board;
  history = new History();
  isWhiteTurn: boolean;

  constructor(
    fen = DEFAULT_FEN, {
      isWhiteTurn = true,
    }: ChessOption = {}
  ) {
    super();
    this.isWhiteTurn = isWhiteTurn;
    this.registerEvents(path.join(__dirname, '../events'));
    this.loadFEN(fen);
  }
  private parseMove(squareRef: MoveString | MoveObject) {
    let f: SquareName, t: SquareName;
    if (typeof squareRef == 'string') {
      f = squareRef.slice(0, 2) as SquareName;
      t = squareRef.slice(2) as SquareName;
    } else {
      const resolve = (v: SquareName | number): SquareName => typeof v == 'number' ? SQUARE_FLAGS[v] as SquareName : v;
      f = resolve(squareRef.from);
      t = resolve(squareRef.to);
    }

    const square = {
      current: this.board.getSquareWithName(f)!,
      destination: this.board.getSquareWithName(t)!,
    };
    if (!square.current || !square.destination || square.current == square.destination)
      throw new Error("Invalid Square Provided!");
    if (square.current.isEmpty)
      throw new Error("No piece to move from there.");
    return square;
  }
  forceMove(squareRef: MoveString | MoveObject) {
    const { current, destination } = this.parseMove(squareRef);
    const move = new WeakMove(current.piece, destination);
    this.executeMove(move);
  }
  move(squareRef: MoveString | MoveObject) {
    const { current, destination } = this.parseMove(squareRef);

    const selectedPieceMoves = this.board.activePlayer.moves.get(current.piece);
    if (!selectedPieceMoves) throw new Error("It's not your turn!");

    const validMoves = selectedPieceMoves.filter(move => move.destinationSquare == destination);
    if (validMoves.length == 0) {
      console.error('Invalid move');
      return;
    } else if (validMoves.length > 1) {
      console.error('More than such move exists');
      return;
    }
    this.executeMove(validMoves[0]);
  }

  private executeMove(move: Move) {
    this.board = move.execute();
    this.emit(EVENT.MOVE, move);
  }

  private validateFEN(fen: string) {
    return true;
  }
  generateFEN() {
    let ctr = -1;
    const join = (ch: string) => ctr == -1 ? ch : [ctr + ch, ctr = -1][0];
    return this.board.builder.config.reduce((str, piece, i) => {
      if (!piece) {
        ctr++;
      } else {
        str += join(piece.notation);
      }
      if (!((i + 1) % BOARD_SIZE)) {
        str += join('/');
      }
      return str;
    }, '');
  }
  select(squareName: string) {
    const square = this.board.getSquareWithName(squareName as SquareName);
    if (!square) throw new Error(`Square with name ${ squareName } doesnot exist`);
    if (square.isEmpty) throw new Error("That square is not occupied by any piece.");
    const validMoves = this.board.activePlayer.moves.get(square.piece);
    if (!validMoves) throw new Error("It's not your turn!");

    const validSquareNames = validMoves.map(move => move.destinationSquare.name);
    return !validSquareNames.length ?
      `The piece ${ square.piece.notation } on square ${ square.name } can't be moved in this position.` :
      validSquareNames.length == 1 ?
        `1 Legal Move for ${ square.piece.notation } on square ${ square.name } is: ${ validSquareNames[0] }` :
        `${ validSquareNames.length } Legal Moves for ${ square.piece.notation } on square ${ square.name } are: ${ validSquareNames.join(', ') }`;
  }
  removePieceFrom(square: SquareName) {
    return true;
  }
  putPieceOn(square: SquareName, notation: PieceSymbol) {

  }

  getStatus() {
    const squares = this.board.squares.map(({ name, piece }) => ({
      name,
      piece: piece.isNull ? null : {
        notation: piece.notation,
        name: piece.type.name,
        side: piece.alliance.color
      }
    }));
    return { board: { squares } };
  }

  registerEvents(dirname: string) {
    const files = requireAll({ dirname, resolve: file => file.default, filter: /^([^\.].*)\.(j|t)s(on)?$/ });

    for (const [eventName, funToRun] of Object.entries<Function | undefined>(files)) {
      if (!funToRun) continue;
      this.on(eventName, funToRun.bind(this));
    }
  }

  loadFEN(fen: string) {
    if (!this.validateFEN(fen)) throw new Error("Invalid FEN");

    const builder = new Builder();
    let sqrIndex = 0;
    for (const ch of fen) {
      if (ch == '/') continue;
      if (ch.isNumber()) {
        sqrIndex += +ch;
      } else {
        builder.setPiece(PieceFactory.Create(ch as PieceNotation, sqrIndex));
      }
      sqrIndex++;
    }
    this.board = builder.build();
  }
}