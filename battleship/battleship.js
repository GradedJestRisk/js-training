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
     shipsSunk: 0,
     shipLength: 3,

    //  ships: [
    //      { locations: ["06", "16", "26"], hits: ["", "", "" ] },
    //      { locations: ["24", "34", "44"], hits: ["", "", "" ] },
    //      { locations: ["10", "11", "12"], hits: ["", "", "" ] },
    //  ],

     ships: [
         { locations: ["00", "00", "00"], hits: ["", "", "" ] },
         { locations: ["00", "00", "00"], hits: ["", "", "" ] },
         { locations: ["00", "00", "00"], hits: ["", "", "" ] },
     ],

     // Behaviour
     // True if hit, false if missed
     fire: function(guess){

        // Look for ship in guess
         for ( var i=0; i < this.numShips; i++) {

             var ship = this.ships[i];
             var index = ship.locations.indexOf(guess);

             // To ensure a hit can only happen once
             //if (index >= 0 && ship.hits[index] != "hit ) {

             if (index >= 0 ) {

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
     },
    
     // fill the board with news ships (method name should be generateShipsLocation)
     generateShipLocations: function(){

        // one new ship (several contiguous locations) 
        var locations;

        for (let i = 0; i < this.numShips; i++) {

            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            
            // now, we've got a "valid" new ship
            this.ships[i].locations = locations;

        }
     },

     generateShip : function() {

        var direction = Math.floor(Math.random() * 2);
        var row, col;


        // Starting location    
        if (direction===1) {
            // Horizontal ship

            // any row
            row = Math.floor(Math.random() * this.boardSize);

            // board 7 , ship length 3, max is 4
            col = Math.floor(Math.random() * ((this.boardSize - this.shipLength) + 1));

        } else {
            // Vertical ship

            // board 7 , ship length 3, max is 4
            row = Math.floor(Math.random() * ((this.boardSize - this.shipLength) + 1));

            // any column
            col = Math.floor(Math.random() * this.boardSize);

        }

        // Complete locations
        var newShipLocations = [];

        for (let i = 0; i < this.shipLength; i++) {

            if (direction===1) {
                // Add location to a horizontal ship   
                newShipLocations.push(row + "" + (col + i)) ;   

            } else {
                // Add location to a vertical ship
                newShipLocations.push((row + i) + "" + col ) ;   
            }
            
        }

        return newShipLocations;
         
     },

     // returns true if any of the new ship locations overlaps with any of the existing ships locations
     // = positions contradicts 
     collision: function (locations) {

        // numShips is fixed number, not current existing ships
        for (let i = 0; i < this.numShips; i++) {

            var ship = this.ships[i];

            for (let j = 0; j < locations.length; j++) {

                // the current new ship position exists in the current existing ship location (positions)
                // indexOf helps us in avoiding including a third loop
                if (ship.locations.indexOf(locations[j]) >= 0){
                    return true;
                }
                
            }

        }

        // we never found any location to match, so no collision
        return false;
         
     }


 }


var controller = {

    // State
    guesses:0,
    
    // Behaviour    
    parseGuess: function(guess){

        var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
        
        // should handle undefined input (can this happen in DOM ?)
        if(guess === null || guess.length != 2 ){
            alert("Oops, please enter a letter and a number on the board");
        }
        else {
            var firstChar = guess.charAt(0);
            var row = alphabet.indexOf(firstChar);

            var column = guess.charAt(1);

            if (isNaN(row) || isNaN(column) ) {
                alert("Oops, that isn't on the board");
            // row can't be negative: edge case is only  -1 if not in array (usual one: included in 0; boardSize  - 1 )
            } else if (row < 0    || row    >= model.boardSize || 
                    // implicit conversion of column from string to number
                    column < 0 || column >= model.boardSize){
                alert("Oops, that isn't on the board");
            } else {
                // Single 
                // left priority for string conversion
                return row + column;
            }
        }
        
        // Here, the input was invalid
        return null;
        
    },

    processGuess: function(guess){
        //
        var location = this.parseGuess(guess);

        if (location){

            this.guesses++;

            var hit = model.fire(location);

            if (hit && model.shipsSunk === model.numShips ){
                view.displayMessage("You sank all my battleships, in " + this.guesses + "guesses");
            }


        }

    }

};

function init (){
    
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;

    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();
}


function handleFireButton(){

    // Get user input
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;

    // Calling controller
    controller.processGuess(guess);

    // Reset input
    guessInput.value = "";
}

// if user key return, click on Fire ! button
function handleKeyPress(e){
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13){
        fireButton.click();
        return false;
    }
}

window.onload = init;


//  ---------------------------------- Tests -----------------------


/*

// ------ model.fire
 var guesses;

 // -- Base case

console.log("Guessing right..");

guesses = ["06", "16", "26", "34", "24", "44", "12", "11", "10"];

for(var i=0; i <guesses.length; i++){

    var result = model.fire(guesses[i]);

    console.log("Guessing", guesses[i], ",result is", result);

    if (result === true)
        console.log("Test passed");
    else    
        console.log("Test failed");

}    

 // -- Edge case
console.log("Guessing wrong..");
var guesses = ["53"];

for(var i=0; i < guesses.length; i++){

    var result = model.fire(guesses[i]);
    console.log("Guessing", guesses[i], ",result is", result);

    if (result === false)
        console.log("Test passed");
    else    
        console.log("Test failed");
}   

// ------  controller.parseGuess

// -- Base case

var guess;

console.log("Parsing right..");

guess = "A0";
var result = controller.parseGuess(guess);
console.log("Guess", guess, ",result is", result);

if (result == "00")
    console.log("Test passed");
else    
    console.log("Test failed");


 // -- Edge case
console.log("Parsing wrong..");

guess = "A7";
var result = controller.parseGuess(guess);
console.log("Guess", guess, ",result is", result);

if (result == null)
    console.log("Test passed");
else    
    console.log("Test failed");

// Doesn't work
//guess = undefined;
//console.log("Guess", guess, ",result is", controller.parseGuess(guess));

guess = null;
var result = controller.parseGuess(guess);
console.log("Guess", guess, ",result is", result);

if (result == null)
    console.log("Test passed");
else    
    console.log("Test failed");



// ------  controller.processGuess

// -- Base case

guesses = ["A0", "A6", "B6", "C6", "C4", "D4", "E4", "BO", "B1", "B2"];

for(var i=0; i < guesses.length; i++){

    controller.processGuess(guesses[i]);

}  

*/