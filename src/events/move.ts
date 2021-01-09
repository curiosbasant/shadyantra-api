import { NormalMove } from '../board';
import ShadYantra from '../board/ShadYantra';

export default function (this: ShadYantra, move: NormalMove) {
  console.log(`Moved ${ move.movedPiece.notation } to ${ move.destinationSquare.name } square`);
  this.board.print();
}