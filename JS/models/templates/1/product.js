class Product {
  constructor(id, name, price, description) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
  }

  // Método para obtener la información del producto en formato JSON
  toJSON() {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      price: this.price,
      description: this.description,
    });
  }

  // Método para actualizar la información del producto a partir de un JSON
  static fromJSON(json) {
    const data = JSON.parse(json);
    return new Product(data.id, data.name, data.price, data.description);
  }

  // Método para obtener una descripción del producto
  getDescription() {
    return `${this.name}: ${this.description} - ${this.price.toFixed(2)}€`;
  }

  // Método para aplicar un descuento al precio del producto
  applyDiscount(discountPercentage) {
    if (discountPercentage < 0 || discountPercentage > 100) {
      throw new Error("El porcentaje de descuento debe estar entre 0 y 100");
    }
    this.price = this.price - this.price * (discountPercentage / 100);
  }

  // Método para actualizar la información del producto
  updateInfo({ name, price, description }) {
    if (name) this.name = name;
    if (price) this.price = price;
    if (description) this.description = description;
  }

  // Método para obtener la información completa del producto
  getInfo() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      description: this.description,
    };
  }
}

class ProductDatabase {
  constructor() {
    this.products = [];
  }

  // Método para añadir un producto a la base de datos
  addProduct(product) {
    this.products.push(product);
  }

  // Método para eliminar un producto de la base de datos por su ID
  removeProductById(id) {
    this.products = this.products.filter((product) => product.id !== id);
  }

  // Método para obtener todos los productos
  getAllProducts() {
    return this.products;
  }

  // Método para encontrar un producto por su ID
  findProductById(id) {
    return this.products.find((product) => product.id === id);
  }

  // Método para actualizar un producto por su ID
  updateProductById(id, newInfo) {
    const product = this.findProductById(id);
    if (product) {
      product.updateInfo(newInfo);
    }
  }

  // Método para convertir toda la base de datos a JSON
  toJSON() {
    return JSON.stringify(
      this.products.map((product) => JSON.parse(product.toJSON()))
    );
  }

  // Método para cargar la base de datos desde un JSON
  static fromJSON(json) {
    const data = JSON.parse(json);
    const db = new ProductDatabase();
    data.forEach((productData) =>
      db.addProduct(Product.fromJSON(JSON.stringify(productData)))
    );
    return db;
  }
}

// Ejemplo de uso
const product1 = new Product(1, "Laptop", 999.99, "Laptop de alta gama");
const product2 = new Product(
  2,
  "Smartphone",
  499.99,
  "Smartphone de última generación"
);
const product3 = new Product(1, "Laptop", 999.99, "Laptop de alta gama");

const db = new ProductDatabase();
db.addProduct(product1);
db.addProduct(product2);
db.addProduct(product3);

console.log(db.getAllProducts());

console.log("");
// console.log(db.findProductById(1).getInfo());

db.removeProductById(1);
console.log(db.getAllProducts());
