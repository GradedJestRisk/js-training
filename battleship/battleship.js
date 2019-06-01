console.log("hello, world, battleship there");

var view = {

    displayMessage: function (msg){
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },

    displayHit : function (location){

        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },

    displayMiss : function (location){

        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }

}

/*

view.displayMessage("Anyone here ?");

view.displayMiss("00");
view.displayHit("34");
view.displayMiss("55");
view.displayHit("12");
view.displayMiss("25");
view.displayHit("26");
*/

var model = {
     // State
     boardSize: 7,
     numShips: 3,
     shispSunk: 0,
     shipLength: 3,
     ships: [
         { locations: ["06", "16", "26"], hits: ["", "", "" ] },
         { locations: ["24", "34", "44"], hits: ["", "", "" ] },
         { locations: ["10", "11", "12"], hits: ["", "", "" ] },
     ],
     // Behaviour
     fire: function(guess){

        // Look for ship in guess
         for ( var i=0; i < this.numShips; i++) {

             var ship = this.ships[i];
             var index = ship.locations.indexOf(guess);

             if (index >= 0) {

                 ship.hits[index] = "hit";

                 // Update view
                 view.displayHit(guess);
                 view.displayMessage("HIT!");

                 if (this.isSunk(ship)){
                    view.displayMessage("You sunk my battleship !");
                    this.shipSunk++;
                 }

                 return true;

             }

         }

        // If you get there, guess is missed (return true has not been triggered)

        // Update view
        view.displayMiss(guess);
        view.displayMessage("You missed");
        return false;
     },

     isSunk: function (ship){
        for(var i=0; i <this.shipLength; i++){
            if(ship.hits[i] !== "hit"){
                return false;
            }
        }       
        return true;
     }

 }

 // Tests
var guesses;

console.log("Guessing right..");

guesses = ["06", "16", "26", "34", "24", "44", "12", "11", "10"];

for(var i=0; i <guesses.length; i++){
    console.log("Guessing", guesses[i], ",result is", model.fire(guesses[i]));
}    

console.log("Guessing wrong..");
var guesses = ["53"];

for(var i=0; i <guesses.length; i++){
    console.log("Guessing", guesses[i], ",result is", model.fire(guesses[i]));
}   