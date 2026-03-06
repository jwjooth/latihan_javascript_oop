// exercise 1
class UserProfile {
  firstName;
  lastName;
  email;
  registerDay = new Date();

  constructor(firstName, lastName, email) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  getFullName() {
    if (this.firstName && this.lastName) {
      console.log(`${this.firstName} ${this.lastName}`);
    } else {
      console.log("Invalid firstname or lastname format");
    }
  }

  getDaysSinceRegistration() {
    console.log(this.registerDay);
  }

  updateEmail(newEmail) {
    if (/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(newEmail)) {
      this.email = newEmail;
    } else {
      console.error("Invalid email format");
    }
  }
}

const user = new UserProfile("Ada", "Lovelace", "ada@example.com");
user.getFullName(); // "Ada Lovelace"
user.updateEmail("bademail"); // throws Error("Invalid email format")
user.getDaysSinceRegistration(); // e.g., 0 (if run same day)

// exercise 2
class ShoppingCart {
  items = new Map();
  existingItem;
  addItem({ id, name, price, quantity }) {
    this.existingItem = this.items.get(id);
    if (price < 0) return Error("price should never be negative");
    if (!this.items.has(id)) {
      this.items.set(id, { id, name, price, quantity });
    } else {
      this.items.set(id, {
        id,
        name,
        price,
        quantity: this.existingItem.quantity + quantity,
      });
    }
  }
  removeItem(id) {
    this.items.delete(id);
  }
  getTotal() {
    let total = 0;
    for (const item of this.items.values()) {
      total = item.price * item.quantity;
    }
    return total;
  }
  getItemCount() {
    let count = 0;
    for (const item of this.items.values()) {
      count += item.quantity;
    }
    return count;
  }
}

const cart = new ShoppingCart();
cart.addItem({ id: 1, name: "Keyboard", price: 80, quantity: 1 });
cart.addItem({ id: 1, name: "Keyboard", price: 80, quantity: 2 });
console.log(cart.getItemCount()); // 3
console.log(cart.getTotal()); // 240
cart.removeItem(1);
console.log(cart.getTotal()); // 0

// exercise 3
class Timer {
  isRunning = false;
  startTime = null;
  elapsedTime = 0;
  start() {
    if (this.isRunning) {
      throw new Error("the timer is already running");
    }
    this.startTime = performance.now();
    this.isRunning = true;
  }
  stop() {
    if (!this.isRunning) {
      throw new Error("the timer is not running");
    }
    this.elapsedTime += performance.now() - this.startTime;
    this.isRunning = false;
  }
  reset() {
    this.elapsedTime = 0;
    this.startTime = null;
    this.isRunning = false;
  }
  getElapsed() {
    if (!this.isRunning) {
      return this.elapsedTime;
    } else {
      return performance.now() - this.startTime + this.elapsedTime;
    }
  }
}

const t = new Timer();
t.start();
// ... some async operations ...
t.stop();
console.log(t.getElapsed()); // e.g., 342 (ms)
t.reset();
console.log(t.getElapsed()); // 0

// exercise 4
class Logger {
  logs = [];
  info(message) {
    this.logs.push({ level: "info", message, timestamp: new Date() });
  }
  warn(message) {
    this.logs.push({ level: "warn", message, timestamp: new Date() });
  }
  error(message) {
    this.logs.push({ level: "error", message, timestamp: new Date() });
  }
  getLogs(level) {
    if(level){
      for (let i = 0; i < this.logs.length; i++) {
        if (this.logs[i].level === level) {
          console.log(this.logs[i]);
          break;
        }
      }
    } else {
      console.log(this.logs);
    }
  }
  clear() {
    this.logs = [];
  }
}

const logger = new Logger();
logger.info("Server started");
logger.warn("Memory usage high");
logger.error("DB connection failed");
logger.getLogs("warn"); // [{ level: "warn", message: "Memory usage high", timestamp: ... }]
logger.getLogs(); // all 3 entries
