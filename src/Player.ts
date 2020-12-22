import Alliance from './Alliance';

export default class Player {
  hasDeclaredWar = false;
  constructor(readonly alliance: Alliance) {
    
  }
}