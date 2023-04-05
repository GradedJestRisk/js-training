import { stub } from 'sinon';
import { expect } from 'chai';
import { callWrappedTransitive, callTransitive } from '../src/dependency/client.js';
import { wrappedDependency } from '../src/dependency/dependency.js';
import * as dependency from '../src/dependency/dependency.js';

describe('dependencies', () => {
    describe('direct', () => {
        describe('using sinon', () => {
            it('cannot be mocked', () => {
                let errorMessage;

                // given
                try {
                    stub(dependency, 'dependency').returns('bar');
                } catch (error) {
                    errorMessage = error.message;
                }

                // when
                // const result = dependency.dependency();

                // then
                expect(errorMessage).to.equal('ES Modules cannot be stubbed');

            });
        });
    });
    describe('transitive', () => {
        describe('using sinon', () => {
            it('can be mocked through a wrapper', () => {
                // given
                stub(wrappedDependency, 'dependency').returns('bar');

                // when
                const result = callWrappedTransitive();

                // then
                expect(result).to.equal('bar');
            });
            it('cannot be mocked directly', () => {
                let errorMessage;

                // given
                try {
                    stub(dependency, 'dependency').returns('bar');
                } catch (error) {
                    errorMessage = error.message;
                }

                // when
                // callTransitive();

                // then
                expect(errorMessage).to.equal('ES Modules cannot be stubbed');
            });
        });
    });
});
