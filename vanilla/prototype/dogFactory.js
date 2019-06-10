exports.makeDog = function(name){

    Dog = function(name){

        this.name = name;
    };

    Dog.prototype.species = 'Canine';
    Dog.prototype.bark = function(){ return("woof!"); };

    dog = new Dog(name);

    return (dog);

}

exports.addSitMethod = function(aDog){
    aDog.sit = function (){
        return('sitting');    
    }
}


exports.addHasSpotsProperty = function(aDog, hasSpots){
    aDog.hasSpots = hasSpots;
}

