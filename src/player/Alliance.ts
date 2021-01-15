// type AllianceColor = 'WHITE' | 'BLACK';

import { BOARD_SIZE } from '../Utils';

export default class Alliance {
  static BLACK = new Alliance('BLACK', BOARD_SIZE);
  static WHITE = new Alliance('WHITE', -BOARD_SIZE);
  opponent!: Alliance;

  constructor(readonly color: AllianceColor, readonly direction: number) {

  }

  setOpponent(opponent: Alliance) {
    this.opponent = opponent;
  }
}