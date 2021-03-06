const makeDog = function (name) {

    // Constructor
    Dog = function (name) {

        this.name = name;
    };

    // Prototype (properties and methods)
    Dog.prototype.species = 'Canine';
    Dog.prototype.bark = function () {
        return ("woof!");
    };

    // Create an object
    const dog = new Dog(name);
    return dog;
}


const addSitMethod = function (aDog) {

    // Add a method on an object
    aDog.sit = function () {
        return 'sitting';
    }
}


const addHasSpotsProperty = function (aDog, hasSpots) {

    // Add a property on an object
    aDog.hasSpots = hasSpots;
}


const makeShowDog = function (name, breed) {

    // Constructor
    ShowDog = function (name, breed) {
        this.name = name;
        this.breed = breed;
    };

    // No arguments to constructor
    ShowDog.prototype = new Dog;
    ShowDog.prototype.constructor = ShowDog;

    // Prototype (properties and methods)
    ShowDog.prototype.league = "London";
    ShowDog.prototype.stack = function () {
        return 'stacking';
    }

    aShowDog = new ShowDog(name, breed);

    return aShowDog;

}

module.exports = {makeDog, makeShowDog, addSitMethod, addHasSpotsProperty};