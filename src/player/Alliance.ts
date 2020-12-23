// type AllianceColor = 'WHITE' | 'BLACK';

import { BOARD_SIZE } from '../Utils';

export default class Alliance {
  static BLACK = new Alliance('BLACK', 1);
  static WHITE = new Alliance('WHITE', -1);
  opponent!: Alliance;

  constructor(readonly color: AllianceColor, readonly direction: number) {

  }

  setOpponent(opponent: Alliance) {
    this.opponent = opponent;
  }
}