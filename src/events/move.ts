import { Move } from '../board';
import ShadYantra from '../board/ShadYantra';

export default function (this: ShadYantra, move: Move) {
  console.log(`Moved ${ move.movedPiece.notation } to ${ move.destinationSquare.name } square`);
  this.board.print();
}