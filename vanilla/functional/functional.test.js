
describe('Functional tests ', function() {

	describe('IIFE', function() {

		test('shortest form, without {} (return value) ', () => {

			const expectedWord = 'foo';

			const actualWord = ()=>'foo';
						
			expect(actualWord()).toStrictEqual(expectedWord);

		});

		test('use statements ', () => {

			const booleanValues = [true, false];

			const generateBoolean = () => {
				const flag = Math.random() > 0.5
				return flag ? 'true' : 'false'
			  }
					
			expect(generateBoolean().toBeBoolean);

		});

		test.skip('pass parameters', () => {

			const numberToTest = 1;

			//const isNumberZero = function isZero(number) => { number==0 }(numberToTest);
						
			expect(isNumberZero()).toStrictEqual(false);

		});

		test('called by a regular function', () => {

			const materials = [ 'Hydrogen', 'Helium', 'Lithium'];
			const expectedLength = [ 8, 6, 7];

			actualLength =  materials.map(material => material.length);
			
			expect(actualLength).toStrictEqual(expectedLength);

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

});