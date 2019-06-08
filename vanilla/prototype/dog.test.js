const dog = require('./dog');

describe('Dog Tests', function() {

	test('dog having its own property (name)', () => {

		name = 'Spark';
		aDog = dog.makeDog(name);
		expect(aDog.name).toBe(name);

	});

	test('dog having its own method (sit)', () => {

		position = 'sitting';
		expect(dog.makeDog(name).sit()).toBe(position);
	
	});

	test('dog having prototype property (species)', () => {

		species = 'Canine';
		expect(dog.makeDog(name).species).toBe(species);
	
	});

	test('dog having prototype method (bark)', () => {

		bark = 'woof!';
		expect(dog.makeDog(name).bark()).toBe(bark);
	
	});



});