export { default as Piece, PieceType, Post } from './Piece';
export { Ashvarohi, Gajarohi, Maharathi, Senapati } from './Officers';
export { Arthshastri, Guptchar, Rajendra } from './Royals';
export { default as Rajrishi } from './Rajrishi';
export { default as Pyada } from './Pyada';
// export { default as Rajendra } from './royals/Rajendra';

export type PieceSymbol = 'I' | 'A' | 'R' | 'C' | 'S' | 'H' | 'G' | 'M' | 'P';
export type PieceNotation = Lowercase<PieceSymbol> | PieceSymbol;
