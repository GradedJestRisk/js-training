import { string, object } from '../src/export-named.js';
import { expect } from 'chai';

describe('import', () => {
    context('on primary type', () => {
        it.skip('are immutable', () => {
            // when
            string = 'rose';
        });
    });
    context('on object type', () => {
        it.skip('reference is immutable', () => {
            // when
            object = {
                name: 'rose',
                age: 50
            };
        });
        it('but fields are mutable', () => {
            // when
            object.name = 'rose';

            // then
            expect(object.name).to.equal('rose');
        });
    });

});
