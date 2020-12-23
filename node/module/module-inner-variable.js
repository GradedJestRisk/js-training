let value = 'bar';

const setValueToFoo = function(){
    value = 'foo';
}

const displayValue = function(){
    console.log('value is ' + value);
}

displayValue();
setValueToFoo();
displayValue();
