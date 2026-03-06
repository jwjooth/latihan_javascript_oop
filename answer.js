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
    if (level) {
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

// exercise 5
class Stack {
  array = [];
  push(item) {
    this.array.push(item);
  }
  pop() {
    if (this.array.length === 0) {
      throw new Error("the stack is empty");
    } else {
      console.log(this.array[this.array.length - 1]);
      this.array.pop();
    }
  }
  peek() {
    if (this.array.length === 0) {
      throw new Error("the stack is empty");
    } else {
      console.log(this.array[this.array.length - 1]);
    }
  }
  isEmpty() {
    if (this.array.length === 0) {
      console.log(true);
    } else {
      console.log(false);
    }
  }
  size() {
    console.log(this.array.length);
  }
}

const s = new Stack();
s.push(10);
s.push(20);
s.push(30);
s.peek(); // 30
s.pop(); // 30
s.size(); // 2
s.isEmpty(); // false

// exercise 6
class ConfigManager {
  object = {};
  defaultValues = {};
  constructor({ theme, lang, timeout }) {
    this.object = {
      theme,
      lang,
      timeout,
    };
    this.defaultValues = {
      theme,
      lang,
      timeout,
    };
  }

  set(key, value) {
    if (key in this.object) {
      this.object[key] = value;
    }
  }
  get(key) {
    return this.object[key];
  }
  reset() {
    this.object = this.defaultValues;
  }
}

const config = new ConfigManager({ theme: "light", lang: "en", timeout: 3000 });
config.set("theme", "dark");
console.log(config.get("theme")); // "dark"
console.log(config.get("lang")); // "en" (from defaults)
config.reset("theme");
console.log(config.get("theme")); // "light"

// exercise 7
class BankAccount {
  owner = "";
  balance = 0;
  statement = [];
  constructor(owner, balance) {
    this.owner = owner;
    this.balance = balance;
  }
  deposit(amount) {
    if (amount < 0) throw new Error("Amount must greater than 0");
    this.balance += amount;
    this.statement.push({
      type: "deposit",
      amount,
      balanceAfter: this.balance,
    });
  }
  withdraw(amount) {
    if (amount > this.balance)
      throw new Error("Cant withdraw more than balance");
    if (amount < 0) throw new Error("Amount must greater than 0");
    this.balance -= amount;
    this.statement.push({
      type: "withdraw",
      amount,
      balanceAfter: this.balance,
    });
  }
  getBalance() {
    return this.balance;
  }
  getStatement() {
    return this.statement;
  }
}

const acct = new BankAccount("Turing", 1000);
acct.deposit(500);
acct.withdraw(200);
console.log(acct.getBalance()); // 1300
console.log(acct.getStatement());
// [
//   { type: "deposit",  amount: 500, balanceAfter: 1500 },
//   { type: "withdraw", amount: 200, balanceAfter: 1300 }
// ]

// exercise 8
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.greet = function () {
  return `Hi, I'm ${this.name}`;
};

function Employee(name, age, role) {
  Person.call(this, name, age);
  this.role = role;
}

Employee.prototype = Object.create(Person.prototype);
Employee.prototype.introduce = function () {
  return `Hi, I'm ${this.name} and I work as a ${this.role}`;
};

Employee.prototype.constructor = Employee;

const e = new Employee("Grace", 34, "Engineer");
console.log(e.greet()); // "Hi, I'm Grace"
console.log(e.introduce()); // "Hi, I'm Grace and I work as a Engineer"
console.log(e instanceof Person); // true
console.log(e instanceof Employee); // true