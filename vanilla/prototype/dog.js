exports.makeDog = function(name){

    Dog = function(name){

        this.name = name;
    };

    Dog.prototype.species = 'Canine';
    Dog.prototype.bark = function(){ return("woof!"); };

    dog = new Dog(name);

    dog.sit = function (){
        return('sitting');    
    }

    return (dog);

    //spark = new Dog('spark');
    //console.log("spark is", spark);
}