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

steam body
https://nodejs.dev/en/api/v18/stream/

send data
https://gist.github.com/kimobrian/e11b5b2be63ce656fab0a3ce03b6dda6
