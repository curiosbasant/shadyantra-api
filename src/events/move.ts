import { Move } from '../board';
import ShadYantra from '../board/ShadYantra';

export default function (this: ShadYantra, move: Move) {
  this.board.print();
  console.log(`moving ${ move.movedPiece.notation } to ${ move.destinationSquare.name } square`);
}