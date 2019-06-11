const dogFactory = require('./dogFactory');

describe('Prototype-based programming in JS' , function() {

	describe('Object test (prototype)', function() {

		  
		test('object literal', () => {

			const taxi = {

				// Properties
				maker: "Ford co",
				model: "taxi",

				// Methods

				introduce : function (interlocutor){
					return ('Hi '+ interlocutor + ", I'm a " + this.model + " made by " + this.maker );				
				},

				// function greet (interlocutor){
				// 	return ('Hi '+ interlocutor );				
				// }
			}

			const interlocutor = 'you';

			expect(taxi.introduce(interlocutor)).toBe("Hi you, I'm a taxi made by Ford co");
		
		});

	});

	describe('Inheritance test (prototype)', function() {

		beforeEach(() => {
			anyDog = dogFactory.makeDog('Fluffy');
		  });

		  
		test('dog constructor being Dog (constructor property)', () => {

			expect(anyDog.constructor.name).toBe("Dog");
		
		});

		test('dog having prototype property (species)', () => {

			species = 'Canine';
			expect(dogFactory.makeDog(name).species).toBe(species);
		
		});

		test('dog having prototype method (bark)', () => {

			bark = 'woof!';
			expect(dogFactory.makeDog(name).bark()).toBe(bark);
	
		});

		test('dog marked as created by prototype (instanceof)', () => {

			expect(anyDog instanceof Dog).toBe(true);
			expect(anyDog).toBeInstanceOf(Dog);
		
		});

		test('mutating identity (instanceof indicate creation)', () => {

			delete anyDog.name;
			anyDog.species = 'Avis';

			expect(anyDog).toBeInstanceOf(Dog);
		
		});

	});

	describe('Object features', function() {

		beforeEach(() => {
			anyDog = dogFactory.makeDog('Barnaby');
		});

		test('dog having its own property (name)', () => {

			name = 'Spark';
			aDog = dogFactory.makeDog(name);
			expect(aDog.name).toBe(name);

		});

		test('dog having its own property (hasOwnProperty)', () => {

			hasSpots = true;
			aSpottyDog = dogFactory.makeDog('Spark');
			dogFactory.addHasSpotsProperty(aSpottyDog, hasSpots);

			expect(aSpottyDog.hasOwnProperty("name")).toBe(true);
			expect(aSpottyDog).hasOwnProperty("name");

		});

		test('dog having its own property (hasSpots)', () => {

			hasSpots = true;
			aSpottyDog = dogFactory.makeDog('Spark');
			dogFactory.addHasSpotsProperty(aSpottyDog, hasSpots);
			expect(aSpottyDog.hasSpots).toBe(hasSpots);
		
		});

		test('dog having its own method (sit)', () => {

			aSittingDog = dogFactory.makeDog('Spark');
			dogFactory.addSitMethod(aSittingDog);
			expect(aSittingDog.sit()).toBe('sitting');
		
		});
	

		test('any dog not having another one own method (sit)', () => {


			function getMissingMethod (){
				anyDog.sit();
			}

			expect(getMissingMethod).toThrowError(new Error ('anyDog.sit is not a function'));
		
		});

	});

	describe('Multiple inheritance features (chaining prototypes)', function() {

		beforeEach(() => {
			anyShowDog = dogFactory.makeShowDog('Paula','Terrier');
		});

		test('dog having its own property (breed)', () => {

			expect(anyShowDog.breed).toBe('Terrier');

		});

		test('dog having its own prototype property (league)', () => {

			expect(anyShowDog.league).toBe('London');
	
		});

		test('dog constructor being Dog (constructor property)', () => {

			expect(anyShowDog.constructor.name).toBe("ShowDog");
		
		});

		test('dog marked as an instance of Dog  (instanceof)', () => {

			expect(anyShowDog instanceof Dog).toBe(true);
			expect(anyShowDog).toBeInstanceOf(Dog);
		
		});

		test('dog marked as an instance of ShowDog (instanceof)', () => {

			expect(anyShowDog).toBeInstanceOf(ShowDog);
		
		});

		test('dog constructor being ShowDog (constructor property)', () => {

			expect(anyShowDog.constructor.name).toBe("ShowDog");
		
		});

		test('dog constructor not being Dog (constructor property)', () => {

			expect(anyShowDog.constructor.name).not.toBe("Dog");
		
		});

	});

});