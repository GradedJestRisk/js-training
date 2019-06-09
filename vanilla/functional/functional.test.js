
describe('Functional tests ', function() {

	describe('Map features', function() {

		test('map applies an operator on each element', () => {

            anArray     =  [1, 2, 3];
            squaredArray = [1, 5, 9];
			expect(
                anArray.map(function(elem){ return elem*elem })
                ).toBe(squaredArray);
		
		});

	
	});

	describe('Reduce features', function() {


		test('reduce applies an operator on all elements ', () => {


		});

	});


});