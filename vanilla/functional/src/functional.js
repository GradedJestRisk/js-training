
// Helper
execute = function (functionName){
    console.log("From " + execute.name + ':');
    console.log("I'm gonna execute this " + functionName);
    functionName();
}

// ------- Anonymous function stored in variable -------------
const greet = function (){
    console.log('Hello world from ' + greet.name);
}

// You can invoke it from variable
greet();

// Or make another function invoke it
execute(greet);

// ------- Declared function (stored in hidden variable) -------------

function warmGreet (){
    console.log('Kind hello world from ' + warmGreet.name);
}

// You can invoke it with its identifier
warmGreet();

// Or make another function invoke it
execute(warmGreet);

// Or put it into another variable
const someFunction = warmGreet;

// Or make another function invoke it
execute(someFunction);


// To sum up: no difference, except 

//  load time
//     * Function declarations :  before any code is executed (first pass - kind of compilation ?)
//     * Function expressions  :   when the interpreter reaches that line of code
//
// So if you try to call a function expression before it's loaded, you'll get an error! (functionName is not a function)
//
// execute(myNewFunction);

var myNewFunction = function (){
    console.log('Oops hello world from ' + myNewFunction.name);
}



//  identifiers
//     * an identifier in a function definition stays in scope in hidden variable with same name
//     * an identifier in a function expression goes out of scope, only variable identifier is kept
//
// So if you try to call a function expression before it's loaded, you'll get an error! (functionName is not a function)
//
// execute(myNewFunction);



const  a = function b (){
    console.log('Oops hello world from ' + myNewFunction.name);
}

//b();
a();

// ------- Exports -------------
