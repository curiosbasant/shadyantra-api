import Piece from './Piece';
export default Piece;
export { default as Pyada } from './Pyada';
export { default as Rajendra } from './Rajendra';

type val = Piece[keyof Piece];

export type PieceSymbol = 'I' | 'A' | 'R' | 'C' | 'S' | 'H' | 'G' | 'M' | 'P';
export type PieceNotation = Lowercase<PieceSymbol> | PieceSymbol;
