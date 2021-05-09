class Recipe {
   constructor({
                  id,
                  name,
                  serving
               }) {
      this.id = id;
      this.name = name;
      this.serving = serving;
   }
   feedsACrowd(){
      return (this.serving >= 10);
   }
}

module.exports = Recipe;
