
describe('Functional tests ', function() {

	describe('Map features', function() {

		test('map applies an operator on each element', () => {

			anArray     =  [1, 2, 3];
			squaredArray = [1, 4, 9];

			mappedArray =  anArray.map(function(elem){ return elem * elem });
			
			expect( mappedArray).toStrictEqual(squaredArray);

		});

	
	});

	describe('Reduce features', function() {


		test('reduce applies an operator on all elements ', () => {

			anArray    = [1,  2,  3];
			arrayTotal =  1 + 2 + 3;

			expect( 
				anArray.reduce(function(total, elem){ return elem + total }, 0)
			).toBe(arrayTotal);

		});

	});

	describe('Filter features', function() {

		test('filter keep all elements matching a condition ', () => {

			anArray             = [1, 2, 3, 4];
			arrayWithEvenNumber = [   2,    4];

			filteredArray =  anArray.filter(function(elem){return elem % 2 == 0; });
				
			expect(filteredArray).toStrictEqual(arrayWithEvenNumber);

		});

	});

});