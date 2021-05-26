class Car {
   constructor(param1, param2) {
      this.prop1 = param1;
      this.prop2 = param2;
   }

   getName() {
      console.log('color', this.prop1, this.prop2);
      return this.prop1 + " " + this.prop2;
   }
}
