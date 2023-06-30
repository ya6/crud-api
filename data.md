function myDecorator(fn) {
return function decoratedFunction() {
console.log('Before executing function');
const result = fn.apply(this, arguments);
console.log('After executing function');
return result;
};
}

function myFunction() {
console.log('Executing function');
}

const decoratedFunction = myDecorator(myFunction);
decoratedFunction();
