const dogFactory = require('./dogFactory');

describe('Prototype tests ', function() {

	describe('Prototype features', function() {

		test('dog having prototype property (species)', () => {

			species = 'Canine';
			expect(dogFactory.makeDog(name).species).toBe(species);
		
		});

		test('dog having prototype method (bark)', () => {

		bark = 'woof!';
		expect(dogFactory.makeDog(name).bark()).toBe(bark);
	
		});

	});

	describe('Object features', function() {

		beforeEach(() => {
			anyDog = dogFactory.makeDog('Spark');
		  });

		test('dog having its own property (name)', () => {

			name = 'Spark';
			aDog = dogFactory.makeDog(name);
			expect(aDog.name).toBe(name);

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


});