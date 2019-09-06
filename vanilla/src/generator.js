// the factory produces a generator function
const counter = function (initial_value = 0) {

    let count = initial_value;

    // the generator function produces a value
    return function counter_generator() {
        count += 1;
        return count;
    }

};


const constant = function (value) {

    return function constant_generator() {
        return value;
    }

};

const integer = function (from = 0, to = Number.MAX_SAFE_INTEGER, step = 1) {
    let current = from;
    return function integer_generator() {
        if (current < to) {
            const result = current;
            current += step;
            return result;
        }
    }

};

const iterator = function (array, gen = integer(0, array.length)) {
    // why args ??
    return function iterator_generator(...args) {
        const element_nr = gen(...args);
        if (element_nr !== undefined) {
            return array[element_nr];
        }
    }

};

const property = function (object, gen = iterator(Object.keys(object))) {

    return function property_generator(...args) {
        const key = gen(...args);
        if (key !== undefined) {
            return [key, object[key]];
        }
    }

};

const collect = function (generator, array) {

    return function collect_generator(...args) {

        const value = generator(...args);

        if (value !== undefined) {
            array.push(value);
        }

        return value;
    }

};

const repeat = function (generator) {
    if (generator() !== undefined) {
        // tail call   
        return (repeat(generator));
    }
}

const objectify = function (method,...names) {

    // names held in closure
    return function objectify_constructor( ...values) {

        let object = Object.create(null);

        object.greet = method;

        names.forEach(function (name, name_nr) {
            object[name] = values[name_nr];
        });

        return Object.freeze(object);
        
    }
}


// Exports
module.exports = {
    counter,
    constant,
    integer,
    iterator,
    property,
    collect,
    repeat,
    objectify
}
