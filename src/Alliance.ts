// type AllianceColor = 'WHITE' | 'BLACK';

export default class Alliance {
  opponent!: Alliance;
  
  constructor(readonly color: AllianceColor, readonly direction:number) {
    
  }
  
  setOpponent(opponent:Alliance) {
    this.opponent = opponent;
  }
}