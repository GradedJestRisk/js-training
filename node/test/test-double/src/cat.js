const meow = () => {
   return 'meow';
};
const talk = () => {
   // https://stackoverflow.com/questions/39861674/stubbing-method-in-same-file-using-sinon
   return factory.meow();
};

const say = (injectedMeow = meow) => {
   return injectedMeow();
};

const factory = {
   meow,
   talk,
   say
};

module.exports = factory;
