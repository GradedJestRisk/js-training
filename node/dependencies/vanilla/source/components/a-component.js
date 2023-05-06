const aComponent = ({
   aDependency,
   anotherDependency,
   aParameter
}) => {
   console.log(`aComponent was called with parameter ${aParameter}`);
   aDependency.call();
   anotherDependency.call();
};

export { aComponent };
