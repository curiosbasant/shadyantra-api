import ReadLine from 'readline';
import Shatranjan from '../src';

function onCommandInput(input: string) {
  if (!input.length) return;
  const args = input.trim().split(/ +/);
  // console.log(args, input);
  const commandName = args.shift()!.toLowerCase();
  switch (commandName) {
    case 'move':
      // @ts-ignore
      game.move(args[0]);
      break;
    case 'forcemove':
      // @ts-ignore
      game.forceMove(args[0]);
      break;
    case 'select':
      const validDestinationSquares = game.select(args[0]);
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
}).on('line', input => {
  try {
    onCommandInput(input);
  } catch (error) {
    console.error(error.message);
  }
});

const game = Shatranjan.Create();
const
  mv = game.move.bind(game),
  fm = game.forceMove.bind(game),
  sl = game.select.bind(game);
// shadYantra.board.print();
console.log(game.generateFEN());

mv('d2d3');
// shadYantra.move('b0c0');

console.log('\n');