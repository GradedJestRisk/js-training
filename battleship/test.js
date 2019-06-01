var assert = require('assert');

var calc = require('./battleship.js');

describe('Battleship Tests', function() {

	describe('Model', function() {

		describe('fire', function() {

			it('fire on ship return true', function(done) {
				assert.equal(model.fire("06"), true);
				done();
			});

			it('fire on sea return false', function(done) {
				assert.equal(model.fire("00"), true);
				done();
			});

		});

	});
   
});