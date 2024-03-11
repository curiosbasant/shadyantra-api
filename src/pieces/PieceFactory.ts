import { Arthshastri, Ashvarohi, Gajarohi, Guptchar, Maharathi, Piece, Pyada, Rajendra, Rajrishi, Senapati } from '.';
import { Square } from '../board';
import { Alliance } from '../player';

const Type = {
  P: Pyada,
  C: Guptchar,
  G: Gajarohi,
  H: Ashvarohi,
  M: Maharathi,
  S: Senapati,
  A: Arthshastri,
  I: Rajendra,
  J: Rajendra,
  R: Rajrishi,
};
export type PieceSymbol = keyof typeof Type;
export type PieceNotation = Lowercase<PieceSymbol> | PieceSymbol;
const PieceFactory = {
  Type,
  Create(notation: PieceNotation, position: number): Piece {
    const alliance = notation.isUpperCase() ? Alliance.WHITE : Alliance.BLACK;

    return new this.Type[notation.toUpperCase()](position, alliance);
  }
};
export default PieceFactory;

abstract class Movement {
  private static *Horizontally(currentSquare: Square | null, sign: -1 | 1) {
    // const adjacentSquare = currentSquare.getNearbySquare(sign);
    for (let adjacentSquare = currentSquare;
      adjacentSquare && (adjacentSquare = adjacentSquare.getNearbySquare(sign));) {
      if (adjacentSquare.isOccupied) return adjacentSquare;
      yield adjacentSquare;
    }
    return null;
  }
  private static *Vertically() {

  }
  static *Orthogonally(currentSquare: Square, toRetreat: boolean) {
    yield* Movement.Horizontally(currentSquare, -1);
    yield* Movement.Vertically();
  }
  static *Diagonally() {

  }
}