# How to play this game on CMD?
First of all, you are required to download the project and open it in `cmd` with the correct path to the project folder.
Then after making sure that you have **node** and **npm** installed on your machine, you need to enter this command `npm install`. This will install all the packages required to run the game.
Then to start the game you have to give the command `npm start`.
If everything goes fine, a board will be printed out in the console with the default position of the board, to which you can play on by giving the following commands.

## Commands
1. `move b3d1` : This will try to move the piece on square **b3** (if exists) to square **d1**. And then prints the new board on console.
2. `select d6` : This will print all the possible squares, to which the piece on **d6** can be moved legally.
3. `forcemove c2b1` : This will create a move, and forcefully puts the piece on **c2** to **b1** (illegal moves);