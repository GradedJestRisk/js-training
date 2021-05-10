
// https://stackoverflow.com/questions/52945683/how-can-i-cleanly-monkey-patch-a-function-in-javascript/52945914
const patchedFn = {
   apply (target, ctx, args) {
      console.log("patched function is invoked with arguments: " + args)
      return Reflect.apply(...arguments)
   }
}

const originalFn = function (arg) {
   return console.log("originalFn is invoked with argument: " + arg);
}

const proxyFn = new Proxy(originalFn, patchedFn);

// Now proxy function can be invoked as following

proxyFn("Hello");
proxyFn(...["Hello"]);
proxyFn.call(null, "Hello");
proxyFn.apply(null, ["Hello"]);

// All the above invocation will print the below output
// patched function is invoked with arguments: Hello
// originalFn is invoked with argument: Hello
