:- use_module(library(lists)).
:- use_module(library(between)).
:- use_module(library(random)).

/**********GETS & SETS***********/



getCell(Line,Col,Pos,Tab,Cell) :- getPiece(Line,Col,Tab,Piece), getCol(Pos,Piece,Cell).

getPiece(Line,Col,Tab,Piece) :- getLine(Line, Tab, Linelist), 
									getCol(Col, Linelist, Piece),!.
									
getLine(1,[Line|_],Line).
getLine(Line,[_|Rest],Linelist) :- Line > 1,Newline is Line - 1,
									getLine(Newline,Rest,Linelist).
									
setLine(1,[_|Rest],Piece,[Piece|Rest]).
setLine(Line,[H|Rest],Piece,[H|More]) :- Line > 1, Newline is Line - 1,
										setLine(Newline,Rest,Piece,More),!.
									
									
getCol(1, [Piece|_], Piece).
getCol(Col, [_|Linelist], Piece) :- Col > 1,Newcol is Col - 1, getCol(Newcol, Linelist, Piece).

setCol(1,[_|Rest],Piece,[Piece|Rest]).

setCol(Col,[H|Rest],Piece,[H|More]) :- Col > 1,Newcol is Col - 1, setCol(Newcol,Rest,Piece,More).

setPiece(Line,Col,Pos,Piece,Tab1,Tab2) :- getPiece(Line,Col,Tab1,Cell), setCol(Pos,Cell,Piece,NewCell), 
											getLine(Line,Tab1,Linelist), setCol(Col,Linelist,NewCell,NewLine),
											setCol(Line,Tab1,NewLine,Tab2).
setHand(Line,Col,Piece,Hand1,Hand2) :- getLine(Line,Hand1,Cell), setCol(Col,Cell,Piece,Hand3),
										setCol(Line,Hand1,Hand3,Hand2).



/**********TABLE***********/





tab([[[b0,m0,s0],[b0,m0,s0],[b0,m0,s0]],
	 [[b0,m0,s0],[b0,m0,s0],[b0,m0,s0]],
	 [[b0,m0,s0],[b0,m0,s0],[b0,m0,s0]]
	]).

test([[[b1,m0,s0],[b0,m1,s0],[b0,m0,s1]],
	 [[b0,m0,s0],[b0,m0,s0],[b0,m0,s0]],
	 [[b0,m0,s0],[b0,m0,s0],[b0,m0,s0]]
	]).
	
piece1([b1,m0,s0]).
piece2([b1,m0,s3]).
piece3([b1,m2,s0]).
	
printboard([]):- !.
    
printboard([X|List]) :-
    write(X),nl,
    printboard(List).

	
list([' ',' ',' ']).

otrio:- tab(Board), hand(Hand1),/*escolher modo de jogo*/ 
chooseGameMode(Mode),
choosePlayerNr(NrPlayers),
gamecycle(Board,Hand1,1,NrPlayers, Mode).

gamecycle(Board, Hand, CurrentPlayer, NrPlayers, Mode) :-
nl,nl,

checkEndGame(Hand,CurrentPlayer);

(Mode == 'multi' ->
printboard(Board),
nl,
write('Multiplayer'),
nl,
printHand(Hand,CurrentPlayer),

choosePiece(CurrentPlayer, Size),
choosePos(CurrentPlayer, Line, Col),
makePlay(CurrentPlayer, Size, Col, Line, Hand, NewHand,Board,NewBoard),
(

   checkWin(CurrentPlayer, Size, NewBoard, Col, Line);
   (

/* verificar ganhou*/

/* senao change Player */
   changePlayer(CurrentPlayer,NewCurrentPlayer,NrPlayers),
   gamecycle(NewBoard, NewHand, NewCurrentPlayer, NrPlayers, Mode)
  )
));


(Mode == 'single' ->
printboard(Board),
nl,
write('Singleplayer'),
nl,
printHand(Hand,CurrentPlayer),

(CurrentPlayer == 1 ->
choosePiece(CurrentPlayer, Size),
choosePos(CurrentPlayer, Line, Col),
makePlay(CurrentPlayer, Size, Col, Line, Hand, NewHand,Board,NewBoard);
CurrentPlayer > 1 ->
playAI(CurrentPlayer, Board, NewBoard, Hand, NewHand, Size, Col, Line)),
(

   checkWin(CurrentPlayer, Size, NewBoard, Col, Line);
   (

/* verificar ganhou*/

/* senao change Player */
   changePlayer(CurrentPlayer,NewCurrentPlayer,NrPlayers),
   gamecycle(NewBoard, NewHand, NewCurrentPlayer, NrPlayers, Mode)
  )
)).

checkEndGame([H|T],1):-
H == [0,0,0],
write('The game is a DRAW! There are no more pieces to play'),nl.


chooseGameMode(Mode):-
nl,
write('What game mode? (single or multi)'),
nl,
read(Mode).


choosePlayerNr(NrPlayers):-
nl,
write('How many Players? (2 to 4)'),
nl,
read(NrPlayers),
between(2,4,NrPlayers),!;
write('Must be between 2 and 4'),
choosePlayerNr(NrPlayers).


printHand(Hand,CurrentPlayer):-
nl,
write('Player '),
write(CurrentPlayer),
write(', you have in your hand:'),
nl,
getPiece(CurrentPlayer, 1, Hand, Value1),
write(Value1),
write('x Big'),
nl,
getPiece(CurrentPlayer, 2, Hand, Value2),
write(Value2),
write('x Medium'),
nl,
getPiece(CurrentPlayer, 3, Hand, Value3),
write(Value3),
write('x Small'),
nl,nl.

changePlayer(CurrentPlayer,1, CurrentPlayer).
changePlayer(CurrentPlayer, NewCurrentPlayer, NrPlayers):-
NewCurrentPlayer is CurrentPlayer + 1.


choosePiece(CurrentPlayer, Size):-
nl,
write('Player '),
write(CurrentPlayer),
write(', choose the size of the piece:(big,medium or small)'),
nl,
	read(Size),
	(Size=='big';
	Size=='medium';
	Size=='small');
	write('Invalid Choice!!'),
	choosePiece(CurrentPlayer,Size).

choosePos(CurrentPlayer, Line, Col):-
nl,
write('Player '),
write(CurrentPlayer),
write(', choose the position of the piece:(x-y)'),
nl,
read(Line-Col).




/**********ITEMS**********/

hand([[3,3,3],[3,3,3],[3,3,3],[3,3,3]]).
/*winCond(Player, List)*/
winCondLocal(1, [b1,m1,s1]).
winCondLocal(2, [b2,m2,s2]).
winCondLocal(3, [b3,m3,s3]).
winCondLocal(4, [b4,m4,s4]).

winCond(1, 'big', b1).
winCond(2, 'big', b2).
winCond(3, 'big', b3).
winCond(4, 'big', b4).
winCond(1, 'medium', m1).
winCond(2, 'medium', m2).
winCond(3, 'medium', m3).
winCond(4, 'medium', m4).
winCond(1, 'small', s1).
winCond(2, 'small', s2).
winCond(3, 'small', s3).
winCond(4, 'small', s4).

piece(1, 'big').
piece(2, 'medium').
piece(3, 'small').

winner(Player):-  nl, write('Player '), write(Player), write(' Won!!'), nl.

/**********GAME FUNCTIONS***********/

member(X,[X|Xs]).
member(X,[Y|Ys]):- member(X,Ys).

jointname(A1,A2,Atomo) :- name(A1,[Char1]), name(A2,[Char2]), name(Atomo,[Char1,Char2]).

makePlay(Player, Size, Line, Col, Hand1, Hand2, Tab1, Tab2) :- Size == 'big', checkHand(Player, 1,Hand1,Hand2), playBig(Player, Line, Col, Tab1, Tab2);
												 Size == 'medium', checkHand(Player, 2,Hand1,Hand2), playMedium(Player, Line, Col, Tab1, Tab2);
												 Size == 'small', checkHand(Player, 3,Hand1,Hand2), playSmall(Player, Line, Col, Tab1, Tab2).

checkHand(Player, Size, Hand1, Hand2) :-  getPiece(Player, Size, Hand1, Value), \+(Value = 0), NewValue is Value - 1, setHand(Player, Size, NewValue, Hand1, Hand2).

/*checkHand(Player, Size, Hand1, Hand2) :-  getCol(Player, Hand1, PlayerHand), getCol(Size, PlayerHand, Value), \+(Value = 0), newValue is Value - 1, setCol()*/	
										  
playBig(Player, Line, Col, Tab1, Tab2) :- getCell(Line,Col,1,Tab1,Cell), Cell == 'b0', jointname('b',Player,Piece), setPiece(Line,Col,1,Piece, Tab1, Tab2).
playMedium(Player, Line, Col, Tab1, Tab2) :- getCell(Line,Col,2,Tab1,Cell), Cell == 'm0', jointname('m',Player,Piece), setPiece(Line,Col,2,Piece, Tab1, Tab2).
playSmall(Player, Line, Col, Tab1, Tab2) :- getCell(Line,Col,3,Tab1,Cell), Cell == 's0', jointname('s',Player,Piece), setPiece(Line,Col,3,Piece, Tab1, Tab2).

/************WIN CONS************/

checkWin(Player, Size, Tab, Line, Col):- (checkLocalWin(Player, Tab, Line, Col), winner(Player);
										 checkLineWin(Player, Size, Tab, 1), winner(Player);
										 checkColWin(Player, Size, Tab, 1), winner(Player);
										 checkLineSeqWin(Player, Tab, 1), winner(Player);
										 checkColSeqWin(Player, Tab, 1), winner(Player);
										 checkDiagWin(Player, Size, Tab), winner(Player)
										 ),!.


checkLocalWin(Player, Tab, Line, Col):- (getPiece(Line, Col, Tab, Cell), winCondLocal(Player, A), Cell == A).
										

checkLineWin(Player, Size, Tab, Line):- Line < 3,
										getPiece(Line, 1, Tab, Cell1),
										getPiece(Line, 2, Tab, Cell2),
										getPiece(Line, 3, Tab, Cell3), 
										winCond(Player, Size, A),  
										(member(A,Cell1), member(A,Cell2), member(A,Cell3);
										NewLine is Line + 1, checkLineWin(Player, Size, Tab, NewLine)).

checkLineWin(Player, Size, Tab, 3):- getPiece(Line, 1, Tab, Cell1), 
									 getPiece(Line, 2, Tab, Cell2),
									 getPiece(Line, 3, Tab, Cell3),
									 winCond(Player, Size, A), (member(A,Cell1), member(A,Cell2), member(A,Cell3)).
									 
checkColWin(Player, Size, Tab, Col):- Col < 3, 
									  getPiece(1, Col, Tab, Cell1), 
									  getPiece(2, Col, Tab, Cell2),
									  getPiece(3, Col, Tab, Cell3), 
									  winCond(Player, Size, A),
									  (member(A,Cell1), member(A,Cell2), member(A,Cell3);
									  NewCol is Col + 1, checkColWin(Player, Size, Tab, NewCol)).
									  
checkColWin(Player, Size, Tab, 3):- getPiece(1, Col, Tab, Cell1), 
									getPiece(2, Col, Tab, Cell2), 
									getPiece(3, Col, Tab, Cell3), 
									winCond(Player, Size, A), (member(A,Cell1), member(A,Cell2), member(A,Cell3)).
									
checkLineSeqWin(Player, Tab, Line):- Line < 3,
									 getPiece(Line, 1, Tab, Cell1),
									 getPiece(Line, 2, Tab, Cell2),
									 getPiece(Line, 3, Tab, Cell3), 
									 winCond(Player, big, A),  
									 winCond(Player, medium, B), 
									 winCond(Player, small, C), 
									(member(A,Cell1), member(B,Cell2), member(C,Cell3);
									member(C,Cell1), member(B,Cell2), member(A,Cell3);
									NewLine is Line + 1, checkLineSeqWin(Player, Tab, NewLine)).

checkLineSeqWin(Player, Tab, 3):- getPiece(Line, 1, Tab, Cell1),
								  getPiece(Line, 2, Tab, Cell2),
								  getPiece(Line, 3, Tab, Cell3), 
								  winCond(Player, big, A),  
								  winCond(Player, medium, B), 
								  winCond(Player, small, C), 
								  (member(A,Cell1), member(B,Cell2), member(C,Cell3);
								  member(C,Cell1), member(B,Cell2), member(A,Cell3)).
									
checkColSeqWin(Player, Tab, Col):- Col < 3,
									 getPiece(1, Col, Tab, Cell1),
									 getPiece(2, Col, Tab, Cell2),
									 getPiece(3, Col, Tab, Cell3), 
									 winCond(Player, big, A),  
									 winCond(Player, medium, B), 
									 winCond(Player, small, C), 
									(member(A,Cell1), member(B,Cell2), member(C,Cell3);
									member(C,Cell1), member(B,Cell2), member(A,Cell3);
									NewCol is Col + 1, checkColSeqWin(Player, Tab, NewCol)).
									
checkColSeqWin(Player, Tab, 3):- getPiece(1, Col, Tab, Cell1),
								   getPiece(2, Col, Tab, Cell2),
								   getPiece(3, Col, Tab, Cell3), 
							       winCond(Player, big, A),  
								   winCond(Player, medium, B), 
							       winCond(Player, small, C), 
								   (member(A,Cell1), member(B,Cell2), member(C,Cell3);
								   member(C,Cell1), member(B,Cell2), member(A,Cell3)).
								   
checkDiagWin(Player, Size, Tab):- getPiece(1, 1, Tab, Cell1),
							      getPiece(2, 2, Tab, Cell2),
						          getPiece(3, 3, Tab, Cell3), 
								  getPiece(3, 1, Tab, Cell4), 
								  getPiece(1, 3, Tab, Cell5), 
								  winCond(Player, Size, A),
								  winCond(Player, big, X),
								  winCond(Player, medium, Y),
								  winCond(Player, small, Z),
								  (member(A,Cell1), member(A,Cell2), member(A,Cell3);
								  member(A,Cell4), member(A,Cell2), member(A,Cell5);
								  member(X,Cell1), member(Y,Cell2), member(Z,Cell3);
								  member(Z,Cell1), member(Y,Cell2), member(X,Cell3);
								  member(X,Cell4), member(Y,Cell2), member(Z,Cell5);
								  member(Z,Cell4), member(Y,Cell2), member(X,Cell5)).
								  
								  

									

/*********** AI ************/

randomizer(Size, Line, Col):- random(1,4,Value), random(1,4,Line), random(1,4,Col), piece(Value, Size).

playMoveAI(Player, Size, Line, Col, Hand1, Hand2, Tab1, Tab2):- Size == 'big', checkHand(Player, 1,Hand1,Hand2), playBig(Player, Line, Col, Tab1, Tab2);
																Size == 'medium', checkHand(Player, 2,Hand1,Hand2), playMedium(Player, Line, Col, Tab1, Tab2);
																Size == 'small', checkHand(Player, 3,Hand1,Hand2), playSmall(Player, Line, Col, Tab1, Tab2).

playAI(Player, Tab1, Tab2, Hand1, Hand2, Size, Line, Col):- randomizer(Size, Line, Col),
															playMoveAI(Player, Size, Line, Col, Hand1, Hand2, Tab1, Tab2).
															
playAI(Player, Tab1, Tab2, Hand1, Hand2, Size, Line, Col):- playAI(Player, Tab1, Tab2, Hand1, Hand2, Size, Line, Col).