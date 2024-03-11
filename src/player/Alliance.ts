// type AllianceColor = 'WHITE' | 'BLACK';

import { BOARD_SIZE } from '../Utils';
type Sign = -1 | 1;
export class Direction {
  readonly backward: number;
  readonly left: Sign;
  readonly right: Sign;
  constructor(readonly forward: number) {
    const sign = Math.sign(forward) as Sign;
    this.left = sign;
    this.right = -sign as Sign;
    this.backward = -forward;
  }
  valueOf() {
    return this.forward;
  }
}

export default class Alliance {
  static BLACK = new Alliance('BLACK', new Direction(BOARD_SIZE));
  static WHITE = new Alliance('WHITE', new Direction(-BOARD_SIZE));
  opponent!: Alliance;

  constructor(readonly color: AllianceColor, readonly direction: Direction) {
  }

  setOpponent(opponent: Alliance) {
    this.opponent = opponent;
  }
}