const anotherComponent = ({
   aDependency,
   aParameter
}) => {
   console.log(`anotherComponent was called with parameter ${aParameter}`);
   aDependency.call();
};

export { anotherComponent };
