# Grapevine
Online multi-user telephone pictionary game.

Try it here: https://the-grapevine.herokuapp.com/

*this game requires more than one user to play

Documentation: https://people.rit.edu/jgp5980/430/

Starting with a sentence, users alternate between drawing pictures and writing sentences to describe what the user before them wrote or drew. Like rumors through the grapevine the message gets twisted and it's usually hilarious.
High Level Concept

This is an online multi-user version of the pictionary/telephone mashup game.

Users can start by joining an existing game or creating their own. Each game created has a starting sentence from the creator, and a maximum number of iterations. When the game reaches the maximum the entire evolution of that game can be viewed. That means users can see what the original sentence was and all of the pictures and sentences that came after that. If a user joins an existing game, they will either draw or write a sentence depending on what the user before them did. Users can only contribute to each game once, and can not contribute games they created.

This is a muti-user system because every game will be participated in by as many users as there are maximum iterations. Each user will have their own account, and will interact with what the other users have done to progress games. The client platform will be web pages. The server stores all of the games and user information. Users send data to the server when they add iterations to games or when they create a new game. All of the games are synced between users.
