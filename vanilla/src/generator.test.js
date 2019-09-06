const {
    counter,
    constant,
    integer,
    iterator,
    property,
    collect,
    repeat,
    objectify
} = require('./generator.js');

describe('counter', () => {

    test('counter return next value', () => {

        let count = counter(1);

        expect(count()).toEqual(2);

        expect(count()).toEqual(3);

        expect(count()).toEqual(4);
    });

});

describe('constant', () => {

    test('constant return same value', () => {

        let pi = constant(3, 1415927);

        expect(pi()).toEqual(3, 1415927);
        expect(pi()).toEqual(3, 1415927);

    });

});

describe('integer', () => {

    test('first call return initial value', () => {

        const finger_of_one_hand = integer(1, 5, 1);

        expect(finger_of_one_hand()).toEqual(1);

    });

    test('next calls call return according to step value', () => {

        const multiple_of_two = integer(0, 100, 2);

        expect(multiple_of_two()).toEqual(0);
        expect(multiple_of_two()).toEqual(2);
        expect(multiple_of_two()).toEqual(4);

    });

    test('last call return undefined', () => {

        const single_item = integer(1, 2, 1);

        expect(single_item()).toEqual(1);
        expect(single_item()).toEqual(undefined);
        expect(single_item()).toEqual(undefined);

    });


});

describe('iterator', () => {

    test('first call return first element', () => {

        const an_array = [5, 4, 3, 2, 1, 0];
        const an_iterator = iterator(an_array);

        expect(an_iterator()).toEqual(5);

    });

    test('successive calls successive elements', () => {

        const an_array = [5, 4, 3, 2, 1, 0];
        const an_iterator = iterator(an_array);

        expect(an_iterator()).toEqual(5);
        expect(an_iterator()).toEqual(4);
        expect(an_iterator()).toEqual(3);

    });

    test('successive calls successive elements using sequence', () => {

        const an_array = [5, 4, 3, 2, 1, 0];
        const two_sequence = integer(0, 6, 2);
        const a_two_step_iterator = iterator(an_array, two_sequence);

        expect(a_two_step_iterator()).toEqual(an_array[0]);
        expect(a_two_step_iterator()).toEqual(an_array[2]);
        expect(a_two_step_iterator()).toEqual(an_array[4]);

    });

    test('last call returns undefined', () => {

        const an_array = [5, 4];
        const an_iterator = iterator(an_array);

        expect(an_iterator()).toEqual(5);
        expect(an_iterator()).toEqual(4);
        expect(an_iterator()).toEqual(undefined);
        expect(an_iterator()).toEqual(undefined);

    });

});


describe('property', () => {

    test('first call return first property', () => {

        const an_object = { name: 'calvin', surname: 'hyper_man' };
        const a_property_enumerator = property(an_object);

        expect(a_property_enumerator()).toEqual(['name', 'calvin']);

    });

    test('successive call return successive properties', () => {

        const an_object = { name: 'calvin', surname: 'hyper_man' };
        const a_property_enumerator = property(an_object);

        expect(a_property_enumerator()).toEqual(['name', 'calvin']);
        expect(a_property_enumerator()).toEqual(['surname', 'hyper_man']);

    });

    test('last call returns undefined', () => {

        const an_object = { name: 'calvin', surname: 'hyper_man' };
        const a_property_enumerator = property(an_object);

        expect(a_property_enumerator()).toEqual(['name', 'calvin']);
        expect(a_property_enumerator()).toEqual(['surname', 'hyper_man']);
        expect(a_property_enumerator()).toEqual(undefined);
        expect(a_property_enumerator()).toEqual(undefined);

    });
});

describe('collect', () => {

    test('starting with empty array, collect all values', () => {

        const an_array = [];
        repeat(collect(integer(0, 7), an_array));

        expect(an_array).toEqual([0, 1, 2, 3, 4, 5, 6]);

    });

    test('starting with non-empty array, append all values', () => {

        const an_array = ['a', 'H'];
        repeat(collect(integer(0, 7), an_array));

        expect(an_array).toEqual(['a', 'H', 0, 1, 2, 3, 4, 5, 6]);

    });

});


describe('objectify', () => {

    test('make an object', () => {

        greet = function () {
            return 'Hello, ' + this.name + ' !';  
        };
        
        const peopleMaker = objectify(greet, 'name', 'surname');
        
        const calvin = peopleMaker('calvin', 'hyper_man');
        expect(calvin.name).toBe('calvin');
        expect(calvin.surname).toBe('hyper_man');

        expect(calvin.greet()).toBe('Hello, calvin !');
        
    });

});
