String.prototype.isLowerCase = function () {
  return this === this.toLowerCase();
};
String.prototype.isUpperCase = function () {
  return !this.isLowerCase();
};
String.prototype.isNumber = function () {
  return !isNaN(+this);
};
String.prototype.toCamelCase = function () {
  return this.replace(/(?:^\w|[A-Z]|-|\b\w)/g,
    (ltr, idx) => idx == 0 ? ltr.toLowerCase() : ltr.toUpperCase()
  ).replace(/\s+|-/g, '');
};

import ShadYantra from './board/ShadYantra';
interface Options {
  switchTurn: boolean;
  variant: string;
}

const Shatranjan = {
  Create({ switchTurn = true, variant = 'shadyantra' } = {} as Options) {
    return new ShadYantra();
  }
};

export default Shatranjan;
/*

Variant Notes
- King could be checked
- Freezed Officers could be sent to FZ
- Introduce new Sadhu pieces
- When no A in game, remove pawns if no O is nearby
- Game is not finished when king goes to TZ while offering draw

*/