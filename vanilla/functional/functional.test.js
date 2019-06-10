
describe('Functional tests ', function() {

	describe('IIFE', function() {

		describe('arrow function style ', function() {

			test('shortest form, no parameter, expression', () => {

				const expectedWord = 'foo';

				const actualWord = (() => 'foo')();
							
				expect(actualWord).toStrictEqual(expectedWord);

			});

			test('use statements, a parameter, expression', () => {

				const name = 'foo';
				const expectedLength = 3;

				const actualLength = ( nameParameter => nameParameter.length )(name);

				expect(
					actualLength)
					.toStrictEqual(expectedLength);
			});

			test('use statements, several parameter, statement', () => {

				const thisString = "Hello", thatString = ", world !";
				const expectedString = "Hello, world !"

				const actualString = 
							((aString, anotherString) => { return(aString + anotherString); } )
							(thisString, thatString);

				expect(
					actualString)
					.toStrictEqual(actualString);
			});

			test('composed with a regular function ', () => {

				const materials = [ 'Hydrogen', 'Helium', 'Lithium'];
				const expectedLength = [ 8, 6, 7];

				actualLength =  materials.map(material => material.length);
				
				expect(actualLength).toStrictEqual(expectedLength);

			});

		});

		describe('regular function style ', function() {

			test('without parameters, use statements, delayed invocation (not IIFE) ', () => {

				const booleanValues = [true, false];

				const generateBoolean = () => {
					const flag = Math.random() > 0.5
					return flag ? 'true' : 'false'
				}
						
				expect(generateBoolean().toBeBoolean);

			});

			test('with parameter, use statements', () => {

				const name = 'foo';

				const expectedGreeting = 'hello foo';

				const actualGreeting = ( function (nameParameter) { return ('hello ' + nameParameter); } (name));						

				expect(
					( function (nameParameter)  { return ('hello ' + nameParameter); } (name)) 
					)
					.toStrictEqual(expectedGreeting);		

			});



		});

	
	});

	describe('Map features', function() {

		test('map applies an operator on each element', () => {

			const anArray     =  [1, 2, 3];
			const squaredArray = [1, 4, 9];

			const mappedArray =  anArray.map(function(elem){ return elem * elem });
			
			expect( mappedArray).toStrictEqual(squaredArray);

		});

	
	});

	describe('Reduce features', function() {


		test('reduce applies an operator on all elements ', () => {

			const anArray    = [1,  2,  3];
			const arrayTotal =  1 + 2 + 3;

			expect( 
				anArray.reduce(function(total, elem){ return elem + total }, 0)
			).toBe(arrayTotal);

		});

	});

	describe('Filter features', function() {

		test('filter keep all elements matching a condition ', () => {

			const anArray             = [1, 2, 3, 4];
			const arrayWithEvenNumber = [   2,    4];

			const filteredArray =  anArray.filter(function(elem){return elem % 2 == 0; });
				
			expect(filteredArray).toStrictEqual(arrayWithEvenNumber);

		});

	});

	describe('Closure features', function() {

		test('Closure store environnement ', () => {

			function createMultiplier(x){
				return function (y){ return x*y; }
			}

			const multiplier = 2;
			const multiplied = 3;

			const multiplierByTwo = createMultiplier (multiplier);

			const expectedResult = multiplier * multiplied;
			const actualResult = multiplierByTwo(multiplied);
				
			expect(actualResult).toStrictEqual(expectedResult);

		});

		test('Closure (fat arrow form) ', () => {

			const createMultiplier = x => y => x * y ;
	
			const multiplier = 2;
			const multiplied = 3;
	
			const multiplierByTwo = createMultiplier (multiplier);
	
			const expectedResult = multiplier * multiplied;
			const actualResult = multiplierByTwo(multiplied);
				
			expect(actualResult).toStrictEqual(expectedResult);
	
		});

		test('Closure (object alternative) ', () => {

const multiplierObject = {

	multiplier : 0,

	multiply : function (multiplied){
		return(this.multiplier * multiplied);
	}
}

const multiplier = 2
multiplierObject.multiplier = multiplier;

const multiplied = 3;

const expectedResult = multiplier * multiplied;

const actualResult = multiplierObject.multiply(multiplied);
	
expect(actualResult).toStrictEqual(expectedResult);
	
		});


	});

});
