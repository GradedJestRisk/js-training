class Rectangle {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
  area() {
    return this.height * this.width;
  }
}

class Circle {
  constructor(radius) {
    this.radius = radius;
  }
}

module.exports = { Rectangle, Circle }