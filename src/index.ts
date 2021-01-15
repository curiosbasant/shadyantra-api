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
import ReadLine from 'readline';

function onCommandInput(input: string) {
  if (!input.length) return;
  const args = input.trim().split(/ +/);
  // console.log(args, input);
  const commandName = args.shift()!.toLowerCase();
  switch (commandName) {
    case 'move':
      console.log(`Moving to ${ args[0] }`);
      // @ts-ignore
      shadYantra.move(args[0]);
      break;
    case 'select':
      const validDestinationSquares = shadYantra.select(args[0]);
      console.log(validDestinationSquares.toString());
      break;

    case 'stop':
      readline.close();
      break;
    default:
      console.log('Not a valid command!');
      break;
  }
}

const readline = ReadLine.createInterface({
  input: process.stdin,
  output: process.stdout
});

const shadYantra = new ShadYantra();
const
  mv = shadYantra.move.bind(shadYantra),
  fm = shadYantra.forceMove.bind(shadYantra),
  sl = shadYantra.select.bind(shadYantra);
// shadYantra.board.print();
console.log(shadYantra.generateFEN());

mv('d2d3');
// shadYantra.move('b0c0');

readline.on('line', input => {
  try {
    onCommandInput(input);
  } catch (error) {
    console.error(error.message);
  }
});

console.log('\n');

/*

Variant Notes
- King could be checked
- Freezed Officers could be sent to FZ
- Introduce new Sadhu pieces
- When no A in game, remove pawns if no O is nearby
- Game is not finished when king goes to TZ while offering draw

*/
/*
abstract class Parent {
  abstract sayHello(): void;
  abstract getGreet(): string;
}
class Child1 extends Parent {
  sayHello() {
    console.log(this.getGreet());
  }
  getGreet() {
    return 'Hello there!';
  }
}
class Child2 extends Parent {
  sayHello() {
    Child1.prototype.sayHello.call(this);
  }

  getGreet() {
    return "I don't want to run this.";
  }
}
 */