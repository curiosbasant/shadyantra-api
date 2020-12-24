import { BoardState } from '.';


export default class History {
  private currentStateIndex = 0;
  private boardStates: BoardState[] = [];
  constructor() {

  }
  save(boardState: BoardState) {
    this.boardStates[this.currentStateIndex] = boardState;
    this.currentStateIndex++;
  }
  takeback() {
    this.currentStateIndex--;
    return this.boardStates[this.currentStateIndex];
  }
}