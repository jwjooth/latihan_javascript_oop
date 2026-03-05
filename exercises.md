# 30 JavaScript OOP Coding Exercises
### *Junior → Mid-Level Engineer Training Track · 2026 Edition*
> **Rules:** AI is allowed for searching concepts, reading docs, and understanding theory.  
> AI **must not** be used to generate or copy-paste solutions.  
> Goal: Train reasoning, architecture thinking, and independent problem-solving.

---

## 🟢 EASY (10 Problems)
*Build your OOP vocabulary and muscle memory*

---

### Exercise 1 — The User Profile Builder
**Difficulty:** Easy

**Real-world context:**  
Every SaaS product has a user registration system. On day one of a new job, you'll likely be asked to model core domain entities.

**Problem Description:**  
Create a `UserProfile` class that models a registered user. It should store `firstName`, `lastName`, `email`, and `createdAt` (auto-set on instantiation). Add methods:
- `getFullName()` → returns `"FirstName LastName"`
- `getDaysSinceRegistration()` → returns how many full days have passed since `createdAt`
- `updateEmail(newEmail)` → updates email only if it contains `@` and `.`, otherwise throws an error

**Input & Output:**
```js
const user = new UserProfile("Ada", "Lovelace", "ada@example.com");
user.getFullName();             // "Ada Lovelace"
user.updateEmail("bademail");   // throws Error("Invalid email format")
user.getDaysSinceRegistration(); // e.g., 0 (if run same day)
```

**Constraints & Edge Cases:**
- `createdAt` must be set automatically — caller should never pass it
- `updateEmail` must validate before mutating state
- What happens if `firstName` or `lastName` is an empty string?

**Engineering Skill Tested:** Class construction, instance methods, input validation, encapsulation basics

**Thinking Hints:**
- Where should validation logic live — inside the constructor or in a separate method?
- How would you test `getDaysSinceRegistration()` without mocking the system clock?

---

### Exercise 2 — The Shopping Cart
**Difficulty:** Easy

**Real-world context:**  
E-commerce is everywhere. Modeling a cart correctly from the start prevents billions in bugs downstream (ask Amazon circa 2001).

**Problem Description:**  
Build a `ShoppingCart` class. It should support:
- `addItem({ id, name, price, quantity })` — adds an item or increases quantity if item already exists
- `removeItem(id)` — removes an item by id
- `getTotal()` — returns total price (price × quantity, summed)
- `getItemCount()` — returns total number of individual items

**Input & Output:**
```js
const cart = new ShoppingCart();
cart.addItem({ id: 1, name: "Keyboard", price: 80, quantity: 1 });
cart.addItem({ id: 1, name: "Keyboard", price: 80, quantity: 2 });
cart.getItemCount(); // 3
cart.getTotal();     // 240
cart.removeItem(1);
cart.getTotal();     // 0
```

**Constraints & Edge Cases:**
- Adding the same item twice should increment quantity, not duplicate the entry
- `price` should never be negative
- `removeItem` on a non-existent id should fail gracefully

**Engineering Skill Tested:** Stateful class design, array/map usage inside objects, idempotency awareness

**Thinking Hints:**
- Should items be stored as an array or a Map? What are the tradeoffs?
- How would you handle floating point precision issues in `getTotal()`?

---

### Exercise 3 — The Timer Utility
**Difficulty:** Easy

**Real-world context:**  
Performance monitoring and profiling tools are built into every serious engineering platform. You'll write utilities like this in logging libraries, CI pipelines, and dev tools.

**Problem Description:**  
Create a `Timer` class with:
- `start()` — starts the timer (throws if already running)
- `stop()` — stops the timer (throws if not running)
- `reset()` — resets the timer to 0
- `getElapsed()` — returns elapsed milliseconds; if timer is running, returns current live elapsed time

**Input & Output:**
```js
const t = new Timer();
t.start();
// ... some async operations ...
t.stop();
t.getElapsed(); // e.g., 342 (ms)
t.reset();
t.getElapsed(); // 0
```

**Constraints & Edge Cases:**
- Calling `start()` twice without `stop()` in between must throw
- Calling `stop()` before `start()` must throw
- `getElapsed()` before any call should return `0`

**Engineering Skill Tested:** State machine thinking inside a class, error handling, `Date.now()` usage

**Thinking Hints:**
- What internal state variables do you need to track?
- Draw the valid state transitions on paper first: `idle → running → stopped`

---

### Exercise 4 — The Logger Class
**Difficulty:** Easy

**Real-world context:**  
Every production system has a logging layer. Understanding how to build one from scratch informs how you use tools like Winston, Pino, or Datadog.

**Problem Description:**  
Build a `Logger` class that supports log levels: `info`, `warn`, `error`. Each log call stores an entry `{ level, message, timestamp }` internally. Implement:
- `info(message)`, `warn(message)`, `error(message)`
- `getLogs(level?)` — returns all logs, or only those matching the level if provided
- `clear()` — empties the log history

**Input & Output:**
```js
const logger = new Logger();
logger.info("Server started");
logger.warn("Memory usage high");
logger.error("DB connection failed");
logger.getLogs("warn"); // [{ level: "warn", message: "Memory usage high", timestamp: ... }]
logger.getLogs();       // all 3 entries
```

**Constraints & Edge Cases:**
- Invalid log levels passed to `getLogs()` should return an empty array
- Timestamps should be real Date objects, not strings
- `clear()` should not break future `info/warn/error` calls

**Engineering Skill Tested:** Accumulator pattern, filtering, internal state isolation

**Thinking Hints:**
- What data structure best stores the logs internally?
- How would you extend this later to support log level *filtering* at write time, not just read time?

---

### Exercise 5 — The Stack Data Structure
**Difficulty:** Easy

**Real-world context:**  
Stacks are used in browser history, undo/redo systems, call stacks, and expression parsers. You'll build one eventually in any serious engineering role.

**Problem Description:**  
Implement a `Stack` class (do **not** use built-in array methods like `shift` or `splice` — only `push` and `pop` on the internal array):
- `push(item)` — adds to top of stack
- `pop()` — removes and returns top item (throws if empty)
- `peek()` — returns top item without removing it
- `isEmpty()` — returns boolean
- `size()` — returns number of items

**Input & Output:**
```js
const s = new Stack();
s.push(10); s.push(20); s.push(30);
s.peek();   // 30
s.pop();    // 30
s.size();   // 2
s.isEmpty(); // false
```

**Constraints & Edge Cases:**
- `pop()` and `peek()` on empty stack must throw descriptive errors
- No direct array index access from outside the class

**Engineering Skill Tested:** Encapsulation, LIFO logic, defensive method design

**Thinking Hints:**
- How do you enforce that the internal array is not directly accessible from outside?
- What would a `toString()` method for debugging look like?

---

### Exercise 6 — The Config Manager
**Difficulty:** Easy

**Real-world context:**  
Configuration management is a fundamental backend concern. Apps need to read settings, merge defaults, and never expose secrets.

**Problem Description:**  
Build a `ConfigManager` class:
- Constructor accepts a `defaults` object
- `set(key, value)` — sets a config value
- `get(key)` — returns the value (checking user-set values first, then defaults)
- `getAll()` — returns merged config (defaults overridden by set values)
- `reset(key)` — deletes user-set value for a key, falling back to default

**Input & Output:**
```js
const config = new ConfigManager({ theme: "light", lang: "en", timeout: 3000 });
config.set("theme", "dark");
config.get("theme");    // "dark"
config.get("lang");     // "en" (from defaults)
config.reset("theme");
config.get("theme");    // "light"
```

**Constraints & Edge Cases:**
- `getAll()` should return a new object — not a reference to internal state
- Setting a key to `undefined` should be treated as a deletion
- What happens when a key exists in neither defaults nor overrides?

**Engineering Skill Tested:** Object composition, shallow copy awareness, layered data lookup

**Thinking Hints:**
- Why is returning a copy from `getAll()` important in real applications?
- How does this pattern relate to environment variable management (`.env` files + defaults)?

---

### Exercise 7 — The Bank Account
**Difficulty:** Easy

**Real-world context:**  
Financial domain modeling is one of the most common interview topics. It tests your ability to protect state and enforce business rules.

**Problem Description:**  
Create a `BankAccount` class:
- Constructor takes `owner` (string) and initial `balance` (number, default 0)
- `deposit(amount)` — adds to balance (must be > 0)
- `withdraw(amount)` — subtracts from balance (throws if insufficient funds or invalid amount)
- `getBalance()` — returns current balance
- `getStatement()` — returns array of all transactions `{ type, amount, balanceAfter }`

**Input & Output:**
```js
const acct = new BankAccount("Turing", 1000);
acct.deposit(500);
acct.withdraw(200);
acct.getBalance();    // 1300
acct.getStatement();
// [
//   { type: "deposit",  amount: 500, balanceAfter: 1500 },
//   { type: "withdraw", amount: 200, balanceAfter: 1300 }
// ]
```

**Constraints & Edge Cases:**
- Direct mutation of `balance` from outside the class must be impossible (use conventions or closures)
- Depositing or withdrawing 0 or negative values must throw
- `getStatement()` should return a copy, not a mutable reference

**Engineering Skill Tested:** Encapsulation, business rule enforcement, audit trail pattern

**Thinking Hints:**
- What naming conventions or JavaScript features can protect internal state?
- The statement is an audit trail — what are the implications of returning the real array vs a copy?

---

### Exercise 8 — Prototypal Greeting Chain
**Difficulty:** Easy

**Real-world context:**  
Understanding prototype chains is essential for debugging production JavaScript — especially when working with legacy codebases or transpiled output.

**Problem Description:**  
Without using the `class` keyword, create a `Person` constructor function and a `Employee` constructor function that inherits from `Person` using prototypal inheritance. Both should:
- `Person(name, age)` → has `greet()` that returns `"Hi, I'm [name]"`
- `Employee(name, age, role)` → inherits `greet()`, but adds `introduce()` that returns `"Hi, I'm [name] and I work as a [role]"`

**Input & Output:**
```js
const e = new Employee("Grace", 34, "Engineer");
e.greet();       // "Hi, I'm Grace"
e.introduce();   // "Hi, I'm Grace and I work as a Engineer"
e instanceof Person;    // true
e instanceof Employee;  // true
```

**Constraints & Edge Cases:**
- Must **not** use `class`, `extends`, or arrow functions for constructors
- `Employee.prototype` chain must properly reflect `Person`
- `constructor` property on `Employee.prototype` must point back to `Employee`

**Engineering Skill Tested:** Prototype chain, `Object.create`, constructor functions, `instanceof`

**Thinking Hints:**
- What is the difference between setting `Employee.prototype = new Person()` vs `Object.create(Person.prototype)`?
- Why does the `constructor` property matter and when does it break?

---

### Exercise 9 — The Notification Service (Static Methods)
**Difficulty:** Easy

**Real-world context:**  
Notification systems (email, SMS, push) follow factory-like patterns. Static utility methods are commonly misunderstood but used everywhere.

**Problem Description:**  
Build a `Notification` class with:
- Instance properties: `type` (`"email" | "sms" | "push"`), `recipient`, `message`
- Instance method: `send()` → returns `"Sending [type] to [recipient]: [message]"`
- Static method: `Notification.validate(data)` → returns `true` if `type`, `recipient`, and `message` are all non-empty strings, `false` otherwise
- Static method: `Notification.createBatch(dataArray)` → creates and returns an array of `Notification` instances, **skipping invalid ones silently**

**Input & Output:**
```js
Notification.validate({ type: "email", recipient: "a@b.com", message: "Hello" }); // true
Notification.validate({ type: "", recipient: "a@b.com", message: "Hello" });       // false

const batch = Notification.createBatch([
  { type: "sms", recipient: "+123", message: "Hi" },
  { type: "",    recipient: "+456", message: "Hey" },  // invalid, skip
]);
batch.length; // 1
batch[0].send(); // "Sending sms to +123: Hi"
```

**Constraints & Edge Cases:**
- Static methods should not depend on instance state
- `createBatch` should be resilient — never throw on bad data, just skip

**Engineering Skill Tested:** Static vs instance method distinction, factory pattern basics, defensive programming

**Thinking Hints:**
- When should logic live on the class itself (static) versus on instances?
- How is `Notification.createBatch` related to the Factory design pattern?

---

### Exercise 10 — The Event Emitter (Mini Version)
**Difficulty:** Easy

**Real-world context:**  
Node.js's `EventEmitter`, browser DOM events, and virtually every UI framework is built on this pattern. It's the backbone of event-driven architecture.

**Problem Description:**  
Build a `MiniEmitter` class with:
- `on(event, listener)` — registers a listener for an event
- `off(event, listener)` — removes a specific listener
- `emit(event, ...args)` — calls all listeners for an event, passing `args`
- `once(event, listener)` — registers a listener that auto-removes after first call

**Input & Output:**
```js
const emitter = new MiniEmitter();
const greet = (name) => console.log(`Hello, ${name}`);
emitter.on("greet", greet);
emitter.emit("greet", "World"); // logs: "Hello, World"
emitter.off("greet", greet);
emitter.emit("greet", "World"); // nothing happens

let count = 0;
emitter.once("ping", () => count++);
emitter.emit("ping"); // count = 1
emitter.emit("ping"); // count still = 1
```

**Constraints & Edge Cases:**
- `off` with an unregistered listener should do nothing (no error)
- `emit` for an event with no listeners should do nothing (no error)
- Multiple listeners for the same event should all fire in registration order

**Engineering Skill Tested:** Observer pattern, closure references, array mutation during iteration

**Thinking Hints:**
- How do you track which function reference to remove in `off`? Why does function identity matter?
- For `once`, how do you remove the listener after first invocation without losing the reference?

---

## 🟡 MEDIUM (12 Problems)
*Apply design thinking and handle real complexity*

---

### Exercise 11 — The Role-Based Access Control System
**Difficulty:** Medium

**Real-world context:**  
RBAC is in virtually every enterprise application. Getting it right means building a hierarchy that's easy to extend, audit, and reason about.

**Problem Description:**  
Design a `RBACSystem` with:
- `addRole(roleName, permissions[])` — defines a role with a set of permission strings
- `assignRole(userId, roleName)` — assigns a role to a user
- `can(userId, permission)` — returns `true` if the user's role includes the permission
- `addInheritance(childRole, parentRole)` — child role inherits all parent permissions
- `getRolesForUser(userId)` — returns role names assigned to a user

**Input & Output:**
```js
rbac.addRole("viewer", ["read"]);
rbac.addRole("editor", ["write"]);
rbac.addInheritance("editor", "viewer"); // editor now also has "read"
rbac.assignRole("user1", "editor");
rbac.can("user1", "read");   // true
rbac.can("user1", "delete"); // false
```

**Constraints & Edge Cases:**
- Circular inheritance (`A → B → A`) must be detected and throw an error
- A user can have only one role at a time (or expand: multiple roles, your choice — justify it)
- `can()` for an unregistered user returns `false`

**Engineering Skill Tested:** Graph traversal thinking, class composition, real-world domain modeling

**Thinking Hints:**
- How would you detect a cycle in the inheritance graph?
- Should permissions be stored as arrays or Sets? What is the lookup complexity difference?

---

### Exercise 12 — The Paginator
**Difficulty:** Medium

**Real-world context:**  
Every API that returns list data needs pagination. Misimplementing pagination causes off-by-one bugs, missed records, and performance disasters in production.

**Problem Description:**  
Build a `Paginator` class:
- Constructor: `new Paginator(data[], pageSize)`
- `getPage(pageNumber)` — returns the items for that page (1-indexed)
- `getTotalPages()` — returns total number of pages
- `hasNext(pageNumber)` — returns boolean
- `hasPrev(pageNumber)` — returns boolean
- `getPageMeta(pageNumber)` — returns `{ page, pageSize, total, totalPages, hasNext, hasPrev }`

**Input & Output:**
```js
const p = new Paginator([1,2,3,4,5,6,7,8,9,10], 3);
p.getPage(1);        // [1, 2, 3]
p.getPage(4);        // [10]
p.getTotalPages();   // 4
p.hasNext(4);        // false
p.getPageMeta(2);    // { page: 2, pageSize: 3, total: 10, totalPages: 4, hasNext: true, hasPrev: true }
```

**Constraints & Edge Cases:**
- Requesting a page beyond `totalPages` should throw or return empty — pick one and justify
- Empty data array must be handled (total pages = 0 or 1?)
- `pageSize` of 0 or negative must throw during construction

**Engineering Skill Tested:** Math/index boundary logic, API response design, constructor-level validation

**Thinking Hints:**
- How do you calculate the last page's item count when data doesn't divide evenly?
- Is there an argument for making this a generator-based lazy paginator instead?

---

### Exercise 13 — The Pipeline Builder
**Difficulty:** Medium

**Real-world context:**  
Data transformation pipelines are the backbone of ETL jobs, API middleware, and build tools (Webpack, Babel, Vite). Understanding the pipeline pattern makes you immediately effective in these systems.

**Problem Description:**  
Build a `Pipeline` class:
- `pipe(fn)` — adds a transformation function; returns `this` (for chaining)
- `execute(input)` — runs input through all functions in order
- `executeAsync(input)` — same, but supports async functions (returns a Promise)
- `reset()` — clears all registered functions

**Input & Output:**
```js
const result = new Pipeline()
  .pipe(x => x * 2)
  .pipe(x => x + 10)
  .pipe(x => `Result: ${x}`)
  .execute(5);
// "Result: 20"

const asyncResult = await new Pipeline()
  .pipe(async x => await fetchUserById(x))
  .pipe(user => user.name.toUpperCase())
  .executeAsync(42);
// "JOHN DOE"
```

**Constraints & Edge Cases:**
- If any function throws, the error should propagate — no silent swallowing
- `pipe()` must return `this` to enable method chaining
- `execute()` on an empty pipeline should return input unchanged

**Engineering Skill Tested:** Method chaining, functional composition, sync/async parity, fluent interface design

**Thinking Hints:**
- How does this relate to `Array.prototype.reduce`?
- What is the difference between your `Pipeline` and a simple `compose` / `pipe` function from functional programming?

---

### Exercise 14 — The Cache with TTL
**Difficulty:** Medium

**Real-world context:**  
Caching with expiry is one of the most commonly implemented utilities in backend development. Redis does this at scale; you need to understand the concept by building it yourself first.

**Problem Description:**  
Build a `TTLCache` class:
- `set(key, value, ttlMs)` — stores value with expiry (in milliseconds)
- `get(key)` — returns value if not expired, `null` if expired or missing
- `delete(key)` — removes a key
- `has(key)` — returns `true` only if key exists **and** is not expired
- `cleanup()` — removes all expired entries from memory

**Input & Output:**
```js
const cache = new TTLCache();
cache.set("session", "abc123", 1000); // expires in 1s
cache.get("session");  // "abc123"
// wait 1001ms...
cache.get("session");  // null
cache.has("session");  // false
```

**Constraints & Edge Cases:**
- Expired values should not be returned even if `cleanup()` hasn't been called
- `set` with a negative or zero TTL should throw
- Overwriting an existing key resets its TTL

**Engineering Skill Tested:** Time-aware state management, lazy expiry vs eager expiry trade-off

**Thinking Hints:**
- Lazy expiry (check on read) vs eager expiry (cleanup loop): what are the real-world trade-offs?
- How would you make `cleanup()` safe to call frequently without wasting CPU?

---

### Exercise 15 — The Form Validator
**Difficulty:** Medium

**Real-world context:**  
Every frontend and backend system performs data validation. Building a composable validator forces you to think about extensibility — the hallmark of mid-level engineering.

**Problem Description:**  
Build a `FormValidator` class:
- `addRule(fieldName, validatorFn, errorMessage)` — registers a validation rule
- `validate(formData)` — runs all rules against `formData`, returns `{ valid: boolean, errors: { [field]: string[] } }`
- Rules for the same field stack (all must pass)
- `addRequiredRule(fieldName)` — convenience method for "field must be non-empty"
- `addMinLengthRule(fieldName, min)` — convenience method

**Input & Output:**
```js
const v = new FormValidator();
v.addRequiredRule("username");
v.addMinLengthRule("username", 3);
v.addRule("email", val => val.includes("@"), "Must be valid email");

v.validate({ username: "Jo", email: "notanemail" });
// {
//   valid: false,
//   errors: {
//     username: ["Must be at least 3 characters"],
//     email:    ["Must be valid email"]
//   }
// }
```

**Constraints & Edge Cases:**
- A field with no rules should not appear in `errors`
- `validatorFn` returns `true` for valid, `false` for invalid
- Multiple errors on the same field should all be collected (not short-circuit)

**Engineering Skill Tested:** Rule accumulation, composable API design, iterating over complex structures

**Thinking Hints:**
- How would you design this to support async validators (e.g., check if username is taken via API)?
- Is this a good use case for the Strategy pattern?

---

### Exercise 16 — The DOM-less Component State
**Difficulty:** Medium

**Real-world context:**  
Before React's hooks, developers managed component state imperatively. Understanding state management without a framework strengthens your mental model of how React/Vue work internally.

**Problem Description:**  
Build a `ComponentState` class:
- `constructor(initialState)` — sets the initial state object
- `setState(patch)` — merges `patch` into current state (shallow merge)
- `getState()` — returns a copy of current state
- `subscribe(listener)` — registers a listener called with `(newState, prevState)` on each change
- `unsubscribe(listener)` — removes the listener
- `reset()` — resets to initial state and notifies listeners

**Input & Output:**
```js
const state = new ComponentState({ count: 0, user: null });
const log = (next, prev) => console.log("Changed:", prev, "→", next);
state.subscribe(log);

state.setState({ count: 1 });       // triggers log
state.setState({ user: "Alice" });  // triggers log, count still 1
state.getState(); // { count: 1, user: "Alice" }
state.reset();    // triggers log, back to { count: 0, user: null }
```

**Constraints & Edge Cases:**
- `getState()` must return a copy — mutations must not affect internal state
- Deep nested objects: shallow merge only (document this limitation explicitly in a comment)
- Listeners called synchronously in the order they were subscribed

**Engineering Skill Tested:** Immutability patterns, observer pattern, shallow vs deep copy awareness

**Thinking Hints:**
- Why do frameworks like React require state to be immutably updated?
- How would you extend this to support time-travel debugging (storing state history)?

---

### Exercise 17 — The Job Queue
**Difficulty:** Medium

**Real-world context:**  
Background job queues (BullMQ, Sidekiq, Celery) are critical infrastructure. Implementing a simple one forces you to reason about concurrency, ordering, and failure handling.

**Problem Description:**  
Build a `JobQueue` class:
- `enqueue(jobFn, priority?)` — adds a job (async function); higher priority number = runs first
- `runNext()` — dequeues and runs the highest-priority job, returns its result
- `runAll()` — runs all jobs in priority order, returns array of results
- `size()` — number of pending jobs
- Jobs can fail — failed jobs should be caught and stored in a `failed` array

**Input & Output:**
```js
const q = new JobQueue();
q.enqueue(async () => "low-priority result", 1);
q.enqueue(async () => "high-priority result", 10);
const results = await q.runAll();
// ["high-priority result", "low-priority result"]
q.size(); // 0
```

**Constraints & Edge Cases:**
- If a job throws, it must not stop the other jobs
- `runNext()` on empty queue throws or returns `null` — pick one and justify
- Jobs with equal priority run in FIFO order

**Engineering Skill Tested:** Priority queue logic, async flow control, error isolation in loops

**Thinking Hints:**
- How do you sort by priority efficiently? What's wrong with re-sorting the entire array on each `runNext`?
- How would you add retry logic without breaking the existing interface?

---

### Exercise 18 — The Polymorphic Shape Calculator
**Difficulty:** Medium

**Real-world context:**  
Polymorphism is one of the hardest OOP concepts to apply well. Geometry is a clean domain to practice it before applying it to messier business domains.

**Problem Description:**  
Create a base class `Shape` with:
- Abstract-style method `area()` — throws `"area() must be implemented"` if called on `Shape` directly
- `toString()` — returns `"[ShapeName] with area [X]"`

Create subclasses: `Circle(radius)`, `Rectangle(width, height)`, `Triangle(base, height)`. Each overrides `area()`. Create a `ShapeCollection` class that:
- `add(shape)` — adds a shape
- `totalArea()` — sum of all areas
- `largestShape()` — returns the shape with the largest area

**Input & Output:**
```js
const shapes = new ShapeCollection();
shapes.add(new Circle(5));
shapes.add(new Rectangle(4, 6));
shapes.add(new Triangle(3, 8));

shapes.totalArea();     // ~114.54
shapes.largestShape();  // Circle instance (area ≈ 78.54)
shapes.largestShape().toString(); // "Circle with area 78.54"
```

**Constraints & Edge Cases:**
- All dimension inputs must be positive numbers — validate in constructors
- `area()` values should be rounded to 2 decimal places
- `largestShape()` on empty collection throws

**Engineering Skill Tested:** Inheritance, polymorphism, template method pattern, collection operations

**Thinking Hints:**
- What makes `ShapeCollection` work without knowing the specific shape type?
- Could this be designed using composition instead of inheritance? What would change?

---

### Exercise 19 — The Rate Limiter
**Difficulty:** Medium

**Real-world context:**  
Rate limiting is a first-class concern in any public API. Understanding the sliding window vs fixed window approaches is expected at the mid-level.

**Problem Description:**  
Implement a `RateLimiter` class using the **fixed window** strategy:
- `constructor(maxRequests, windowMs)` — e.g., 5 requests per 10,000ms
- `isAllowed(userId)` — returns `true` if the user is within their limit, `false` otherwise; counts the request
- `getRemaining(userId)` — returns how many requests a user has left in current window
- `reset(userId)` — manually resets a user's counter (for admin use)

**Input & Output:**
```js
const limiter = new RateLimiter(3, 5000); // 3 req / 5s
limiter.isAllowed("user1"); // true (1/3)
limiter.isAllowed("user1"); // true (2/3)
limiter.isAllowed("user1"); // true (3/3)
limiter.isAllowed("user1"); // false
limiter.getRemaining("user1"); // 0
// wait 5001ms...
limiter.isAllowed("user1"); // true (window reset)
```

**Constraints & Edge Cases:**
- Window resets automatically per user when `windowMs` has elapsed — no manual trigger
- Different users have independent counters
- `windowMs` and `maxRequests` must be positive integers

**Engineering Skill Tested:** Time-windowed state, per-entity tracking, production API concerns

**Thinking Hints:**
- How does your window reset without a background timer? Think lazy evaluation.
- What is the difference between "fixed window" and "sliding window" rate limiting? Which is more fair?

---

### Exercise 20 — The Undo/Redo Manager
**Difficulty:** Medium

**Real-world context:**  
Undo/redo is in every text editor, design tool, and form. Implementing it correctly with OOP reveals the Command pattern in action.

**Problem Description:**  
Build an `UndoManager` class that works with command objects:
- A command object has `{ execute(), undo() }` methods
- `run(command)` — executes the command and pushes to history
- `undo()` — undoes the last command
- `redo()` — re-executes the most recently undone command
- `canUndo()` / `canRedo()` — returns boolean
- `getHistory()` — returns the list of executed command descriptions (if commands have a `description` property)

**Input & Output:**
```js
let value = 0;
const addFive = {
  description: "Add 5",
  execute: () => { value += 5; },
  undo:    () => { value -= 5; }
};
const mgr = new UndoManager();
mgr.run(addFive); // value = 5
mgr.run(addFive); // value = 10
mgr.undo();       // value = 5
mgr.redo();       // value = 10
mgr.canRedo();    // false (no more to redo)
```

**Constraints & Edge Cases:**
- Running a new command after an undo must clear the redo stack
- `undo()` when nothing to undo must throw or do nothing — justify your choice
- Commands should not be mutated — keep references as-is

**Engineering Skill Tested:** Command pattern, dual-stack management, action history integrity

**Thinking Hints:**
- Why does a new command after undo clear the redo stack? Think about history divergence.
- How would you limit history size (e.g., max 50 commands) without breaking the interface?

---

### Exercise 21 — The CSV Table Parser (OOP Style)
**Difficulty:** Medium

**Real-world context:**  
CSV parsing and data transformation is a daily task in data engineering, reporting tools, and internal dashboards. Wrapping it in a class makes it reusable and testable.

**Problem Description:**  
Build a `CSVTable` class:
- `constructor(csvString)` — parses CSV string (first row = headers)
- `getHeaders()` — returns array of header strings
- `getRow(index)` — returns row as an object `{ header: value, ... }`
- `getColumn(header)` — returns all values under that column
- `filter(header, predicate)` — returns new `CSVTable` with only rows where `predicate(value)` is true
- `toJSON()` — returns array of row objects

**Input & Output:**
```js
const csv = `name,age,city
Alice,30,NYC
Bob,25,LA
Charlie,35,NYC`;

const table = new CSVTable(csv);
table.getHeaders();           // ["name", "age", "city"]
table.getColumn("city");      // ["NYC", "LA", "NYC"]
table.filter("city", v => v === "NYC").toJSON();
// [{ name: "Alice", age: "30", city: "NYC" }, { name: "Charlie", age: "35", city: "NYC" }]
```

**Constraints & Edge Cases:**
- Handle quoted fields with commas inside: `"Smith, Jr.",30,NYC`
- `filter()` should return a new `CSVTable` instance, not mutate the original
- Empty CSV (only headers, no rows) should be valid

**Engineering Skill Tested:** String parsing, immutable transformation methods, class self-reference in return types

**Thinking Hints:**
- How do you handle quoted commas without a regex that's too greedy?
- Why return a new `CSVTable` from `filter()` instead of an array? What design principle does that follow?

---

### Exercise 22 — The Dependency Injection Container (Mini)
**Difficulty:** Medium

**Real-world context:**  
DI containers are the core of Angular, NestJS, Spring, and every enterprise framework. Understanding how one works removes the "magic" from all frameworks.

**Problem Description:**  
Build a `DIContainer` class:
- `register(name, factory)` — registers a service factory (a function that creates the service)
- `registerSingleton(name, factory)` — registers a service that is only created once and reused
- `resolve(name)` — creates and returns the service (calling the factory, injecting other resolved services if the factory accepts the container)
- `has(name)` — checks if a service is registered

**Input & Output:**
```js
const container = new DIContainer();
container.register("config", () => ({ dbUrl: "localhost" }));
container.registerSingleton("db", (c) => ({ connect: () => c.resolve("config").dbUrl }));

const db1 = container.resolve("db");
const db2 = container.resolve("db");
db1 === db2; // true (singleton)
db1.connect(); // "localhost"
```

**Constraints & Edge Cases:**
- Resolving an unregistered service throws with a descriptive message
- Circular dependencies (A needs B, B needs A) should be detected and throw
- Factory function receives the container itself as its only argument

**Engineering Skill Tested:** Inversion of control, singleton pattern, lazy initialization, recursion with cycle detection

**Thinking Hints:**
- How do you detect circular dependencies during `resolve()`?
- What's the difference between `register` (transient) and `registerSingleton`? When does the singleton get created?

---

## 🔴 HARD (8 Problems)
*Architect-level thinking under realistic constraints*

---

### Exercise 23 — The Observable Store
**Difficulty:** Hard

**Real-world context:**  
MobX, Vuex, Zustand, and Redux are all variations of the observable store concept. Building one from scratch is how you truly understand state management frameworks.

**Problem Description:**  
Build an `ObservableStore` class:
- `constructor(initialState)` — initializes state
- `get(path)` — gets a nested value using dot notation (`"user.profile.name"`)
- `set(path, value)` — sets a nested value using dot notation, triggering watchers
- `watch(path, callback)` — subscribes to changes at a specific path (or any child path beneath it)
- `unwatch(path, callback)` — removes watcher
- `computed(name, deriveFn)` — registers a computed value that auto-recalculates when its observed paths change; accessible via `get(name)`

**Input & Output:**
```js
const store = new ObservableStore({ user: { name: "Alice", age: 30 }, cart: { items: [] } });

store.watch("user.name", (newVal, oldVal) => console.log(`Name: ${oldVal} → ${newVal}`));
store.set("user.name", "Bob"); // logs: "Name: Alice → Bob"
store.get("user.name");        // "Bob"

store.computed("cartSize", s => s.get("cart.items").length);
store.get("cartSize"); // 0
```

**Constraints & Edge Cases:**
- `watch("user", cb)` should trigger when **any** path under `user` changes
- Setting a path that doesn't exist must create it (deep creation)
- Computed values must not cause infinite loops if they trigger mutations
- `watch` callback must receive both old and new value

**Engineering Skill Tested:** Proxy/path-based reactivity, recursive path traversal, pub/sub architecture, computed dependency graph

**Thinking Hints:**
- How do you efficiently determine which watchers to notify when a nested path changes?
- How does MobX use JavaScript `Proxy` to make objects automatically observable?
- For computed values, how do you know which paths a `deriveFn` accesses without running it with a tracer?

---

### Exercise 24 — The Task Scheduler with Dependencies
**Difficulty:** Hard

**Real-world context:**  
Build systems (Make, Gradle, Turborepo), CI pipelines, and workflow engines all solve the same problem: run tasks in the right order, accounting for dependencies.

**Problem Description:**  
Build a `Scheduler` class:
- `addTask(name, asyncFn, dependencies[])` — registers a task with its dependencies
- `run()` — executes all tasks in dependency order; tasks with no inter-dependencies run in parallel
- Returns a map of `{ taskName: result }`
- Each task function receives the results of its dependencies as arguments

**Input & Output:**
```js
const s = new Scheduler();
s.addTask("fetchConfig", async () => ({ apiUrl: "https://api.example.com" }), []);
s.addTask("fetchUser",   async (config) => fetch(config.apiUrl + "/user"), ["fetchConfig"]);
s.addTask("fetchPosts",  async (config) => fetch(config.apiUrl + "/posts"), ["fetchConfig"]);
s.addTask("buildPage",   async (user, posts) => ({ user, posts }), ["fetchUser", "fetchPosts"]);

const results = await s.run();
// fetchConfig and the two fetches run optimally; buildPage waits for both
```

**Constraints & Edge Cases:**
- Circular dependencies must throw before execution starts
- If a task fails, dependent tasks must not run (propagate failure)
- Tasks with the same set of ready dependencies must run concurrently (not sequentially)
- Duplicate task names must throw at `addTask` time

**Engineering Skill Tested:** Topological sort, DAG traversal, `Promise.all` for parallelism, error propagation

**Thinking Hints:**
- How do you implement topological sort using Kahn's algorithm or DFS?
- How do you determine which tasks are "ready to run" at each step?
- How do you pass each task only the results it needs, not all results?

---

### Exercise 25 — The Virtual DOM Differ
**Difficulty:** Hard

**Real-world context:**  
React, Vue, and Preact are all built on a virtual DOM diff algorithm. Writing even a simple one is one of the best exercises in tree traversal, recursion, and performance reasoning.

**Problem Description:**  
Build a `VDomDiffer` class. A virtual DOM node is represented as:
```js
{ tag: "div", props: { id: "app" }, children: [ { tag: "p", props: {}, children: ["Hello"] } ] }
```
Implement:
- `diff(oldTree, newTree)` — returns an array of **patch operations** representing what changed
- Patch operations: `{ type: "UPDATE_PROP", path, key, value }`, `{ type: "REPLACE", path, node }`, `{ type: "INSERT", path, node }`, `{ type: "REMOVE", path }`
- `apply(tree, patches)` — applies patches to a tree, returns new tree (immutably)

**Input & Output:**
```js
const old = { tag: "div", props: { class: "box" }, children: ["Hello"] };
const next = { tag: "div", props: { class: "container" }, children: ["Hello", " World"] };

const patches = differ.diff(old, next);
// [
//   { type: "UPDATE_PROP", path: [], key: "class", value: "container" },
//   { type: "INSERT",      path: ["children"], node: " World" }
// ]
```

**Constraints & Edge Cases:**
- When `tag` changes, it's always a full `REPLACE` (no prop-level diffing)
- Text nodes (strings) diff by value equality
- Null/undefined nodes must be handled gracefully
- `apply` must not mutate the original tree

**Engineering Skill Tested:** Recursive tree traversal, structural comparison, patch/apply architecture, immutability

**Thinking Hints:**
- How do you represent "path" to a node in the tree? Consider array index paths like `["children", 0, "children", 1]`
- Why does changing the `tag` require a full replace instead of patching?
- How do real frameworks optimize this with "keys" on list items?

---

### Exercise 26 — The Schema Validator with Nested Types
**Difficulty:** Hard

**Real-world context:**  
Zod, Yup, Joi, and JSON Schema validation are essential tools. Building your own reveals exactly how recursive type systems work — a skill that transfers directly to TypeScript type design.

**Problem Description:**  
Build a `Schema` class with chainable type builders:
- `Schema.string()`, `Schema.number()`, `Schema.boolean()`, `Schema.array(itemSchema)`, `Schema.object(shapeObj)`
- Each type has modifiers: `.required()`, `.optional()`, `.min(n)` (for string/number/array), `.max(n)`
- `schema.parse(data)` — validates and returns data if valid, throws `ValidationError` with all collected errors if invalid

**Input & Output:**
```js
const userSchema = Schema.object({
  name:  Schema.string().required().min(2),
  age:   Schema.number().required().min(0).max(120),
  tags:  Schema.array(Schema.string()).optional(),
  address: Schema.object({
    city: Schema.string().required()
  }).optional()
});

userSchema.parse({ name: "A", age: -1 });
// throws ValidationError:
//   - name: "Must be at least 2 characters"
//   - age: "Must be at least 0"
```

**Constraints & Edge Cases:**
- All errors must be collected before throwing (not fail-fast)
- Nested object schemas must produce paths like `"address.city: Required"`
- Unknown keys in object schemas should be ignored by default (not error)
- `.optional()` means the field can be `undefined` but if present, must be valid

**Engineering Skill Tested:** Recursive schema validation, fluent/builder pattern, error aggregation with paths

**Thinking Hints:**
- How do you design the fluent API so each modifier returns the same schema instance (or a new one)?
- How do you pass the current "path" through recursive validation for meaningful error messages?
- How does this differ from simply writing a validation function for each type?

---

### Exercise 27 — The Reactive Computed Graph
**Difficulty:** Hard

**Real-world context:**  
Spreadsheet engines (Excel, Google Sheets), build tools, and reactive frameworks all maintain a directed acyclic computation graph. This is the engine underneath Vue's `computed`, MobX's `@computed`, and Svelte's `$:`.

**Problem Description:**  
Build a reactive computation graph:
- `reactive(value)` — creates a reactive cell; returns `{ get(), set(val) }`
- `computed(fn)` — creates a derived cell that automatically re-computes when dependencies change; returns `{ get() }`
- When a reactive cell's value changes, all transitively dependent computed cells are marked dirty and re-evaluated lazily on next `get()`
- `effect(fn)` — runs `fn` immediately and re-runs it whenever its reactive dependencies change

**Input & Output:**
```js
const firstName = reactive("Ada");
const lastName  = reactive("Lovelace");
const fullName  = computed(() => `${firstName.get()} ${lastName.get()}`);
const greeting  = computed(() => `Hello, ${fullName.get()}`);

greeting.get();            // "Hello, Ada Lovelace"
firstName.set("Grace");
greeting.get();            // "Hello, Grace Lovelace" (recomputed)

effect(() => console.log("Name is:", fullName.get()));
// immediately logs: "Name is: Grace Lovelace"
lastName.set("Hopper");
// automatically logs: "Name is: Grace Hopper"
```

**Constraints & Edge Cases:**
- Computed values must be lazy (only re-compute on `get()`, not on dependency change)
- Dependency tracking must be automatic — no manual declaration of what a computed depends on
- Diamond dependencies (A → B, A → C, D depends on B + C) must not cause double-evaluation
- Effect re-runs must not stack — if an effect causes another reactive change, it must not re-run synchronously/infinitely

**Engineering Skill Tested:** Automatic dependency tracking, dirty-marking propagation, lazy evaluation, glitch prevention in reactive graphs

**Thinking Hints:**
- How do Vue and MobX track which reactive cells a `computed` reads from without you declaring them? Think about a global "current computation" context.
- What data structure do you use to store the dependency graph?
- How do you prevent a computed cell at the bottom of a diamond from evaluating twice when both inputs change simultaneously?

---

### Exercise 28 — The Plugin System
**Difficulty:** Hard

**Real-world context:**  
VS Code, Vite, Webpack, and Express all expose plugin systems. Designing one requires mastering lifecycle hooks, extension points, and sandboxed execution.

**Problem Description:**  
Build an `Application` class with a plugin system:
- `use(plugin)` — registers a plugin (a plugin is an object with `name` and optional hook methods)
- Lifecycle hooks plugins can implement: `onInit(app)`, `onRequest(req, next)`, `onResponse(res)`, `onError(err)`
- `start()` — initializes the app, calls all `onInit` hooks in registration order
- `handleRequest(req)` — runs `onRequest` hooks as middleware chain (each calls `next()` to continue); returns final response via `onResponse` hooks

**Input & Output:**
```js
const authPlugin = {
  name: "auth",
  onInit: (app) => console.log("Auth initialized"),
  onRequest: (req, next) => {
    if (!req.token) throw new Error("Unauthorized");
    next();
  }
};
const logPlugin = {
  name: "logger",
  onRequest: (req, next) => { console.log("Req:", req.path); next(); },
  onResponse: (res) => { console.log("Res:", res.status); }
};

const app = new Application();
app.use(logPlugin).use(authPlugin);
await app.start();
await app.handleRequest({ path: "/home", token: "abc" });
```

**Constraints & Edge Cases:**
- Plugins registered with the same name should throw at `use()` time
- If a plugin's `onRequest` doesn't call `next()`, the chain stops (intentional)
- If any hook throws, `onError` hooks are called in order
- `use()` should return `this` for chaining

**Engineering Skill Tested:** Middleware/chain-of-responsibility pattern, lifecycle hook architecture, plugin registry, error propagation across hooks

**Thinking Hints:**
- How does Express's middleware `(req, res, next)` chain work internally? How does your `onRequest` chain differ?
- How do you ensure that errors thrown in hook callbacks reach all `onError` handlers?
- What are the risks of allowing plugins to call `next()` asynchronously vs synchronously?

---

### Exercise 29 — The Memory-Efficient Lazy Collection
**Difficulty:** Hard

**Real-world context:**  
Processing large datasets (millions of records from a database, log files, CSV exports) requires lazy evaluation. Node.js streams and Python generators solve this — now build your own.

**Problem Description:**  
Build a `LazyCollection` class built on generator functions:
- `LazyCollection.from(iterable)` — creates from any iterable
- `.map(fn)` — lazy transformation
- `.filter(predicate)` — lazy filter
- `.take(n)` — yields only first `n` items
- `.skip(n)` — skips first `n` items
- `.toArray()` — materializes the collection
- `.forEach(fn)` — iterates without materializing
- `.reduce(fn, initial)` — folds the collection

All intermediate operations must be **lazy** — no data is processed until a terminal operation (`toArray`, `forEach`, `reduce`) is called.

**Input & Output:**
```js
const result = LazyCollection.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  .filter(x => x % 2 === 0)   // lazy
  .map(x => x * x)             // lazy
  .take(3)                     // lazy
  .toArray();                  // terminal — evaluates now

// [4, 16, 36]  (evens: 2,4,6 → squared)
```

**Constraints & Edge Cases:**
- Operations must not iterate the source until a terminal is called
- Must work on **infinite generators** (e.g., `function* naturals() { let i=0; while(true) yield i++; }`)
- Chaining 10+ operations must not create intermediate arrays
- `take(0)` returns empty; `skip` beyond collection length yields nothing

**Engineering Skill Tested:** Generator protocol, iterator composition, lazy evaluation strategy, memory efficiency awareness

**Thinking Hints:**
- How do you make each method return a new `LazyCollection` that wraps the previous generator?
- How does JavaScript's `Symbol.iterator` protocol work, and how can you implement it on your class?
- What happens with memory usage if you use `.map().map().map()` eagerly vs lazily on 10 million items?

---

### Exercise 30 — The Type-Safe Event Bus
**Difficulty:** Hard

**Real-world context:**  
Cross-module communication in large-scale applications (micro-frontends, modular monoliths, microservices via message passing) relies on event buses. In 2026, engineers are expected to design type-safe APIs — this exercise simulates that constraint without requiring TypeScript.

**Problem Description:**  
Build a `TypedEventBus` class that enforces event schema contracts at registration time (use JSDoc or runtime checks since this is JavaScript):
- `defineEvent(eventName, schemaValidator)` — registers an event type with a validation function
- `publish(eventName, payload)` — validates payload against the schema, then notifies all subscribers; throws if schema fails
- `subscribe(eventName, handler)` — returns an `unsubscribe` function
- `publishAsync(eventName, payload)` — same as publish but handlers run asynchronously (no blocking)
- `getEventHistory(eventName, limit?)` — returns last N published events with timestamps
- `replay(eventName, subscriber)` — immediately calls subscriber with all historical events for that type

**Input & Output:**
```js
const bus = new TypedEventBus();
bus.defineEvent("user.created", (p) => p.id && p.email); // schema validator

const unsub = bus.subscribe("user.created", (payload) => console.log("New user:", payload.email));
bus.publish("user.created", { id: 1, email: "alice@example.com" }); // works
bus.publish("user.created", { id: 2 }); // throws: "Invalid payload for event 'user.created'"

unsub(); // stop listening
bus.getEventHistory("user.created", 5); // [{ payload: {...}, timestamp: Date }]
bus.replay("user.created", (p) => console.log("Replayed:", p.email)); // replays history
```

**Constraints & Edge Cases:**
- Publishing to an undefined event type throws immediately
- Subscribers added after `replay` call must not receive replayed events
- `publishAsync` must not block: handlers run via microtask queue
- Event history must be capped (configurable max, default 100) to avoid memory leaks
- Handler errors in `publishAsync` must not crash the bus — collect them and expose via `getErrors()`

**Engineering Skill Tested:** Runtime contract enforcement, pub/sub with history, async handler isolation, memory-bounded storage, error surfacing

**Thinking Hints:**
- How do you make `publishAsync` non-blocking without losing the delivery guarantee? (`Promise.resolve().then(...)` vs `setTimeout`)
- What is the difference between an event bus and an observable store (Exercise 23)? When would you choose one over the other?
- How does `replay()` relate to event sourcing patterns used in backend architecture (Kafka, EventStoreDB)?
- What is the risk of storing event history indefinitely, and how do the largest event-driven systems handle this?

---

## 📊 Exercise Map by Core Concept

| OOP Concept | Exercises |
|---|---|
| Class construction & instance methods | 1, 2, 3, 4, 7 |
| Encapsulation & data protection | 1, 5, 6, 7 |
| Prototypal inheritance | 8 |
| Class inheritance & polymorphism | 18 |
| Static methods & factory pattern | 9 |
| Observer / Event-driven pattern | 10, 16, 23, 30 |
| Command pattern | 20 |
| Strategy / Composable design | 13, 15 |
| Singleton & DI pattern | 22 |
| Middleware / Chain of responsibility | 28 |
| Data structures (Stack, Queue, Cache) | 5, 14, 17 |
| Async OOP | 17, 24, 30 |
| Reactive programming | 23, 27 |
| Tree traversal & diffing | 25 |
| Recursive/nested type systems | 26 |
| Generator / lazy evaluation | 29 |

---

## 🗺️ Suggested Learning Path

```
Week 1–2:   Exercises 1–5   (Core Class Mechanics)
Week 3–4:   Exercises 6–10  (Patterns & Behaviors)
Week 5–7:   Exercises 11–15 (Domain Modeling)
Week 8–10:  Exercises 16–22 (Architecture Thinking)
Week 11–14: Exercises 23–30 (Senior-Level Design)
```

> **Tip for using AI tools correctly during these exercises:**  
> ✅ Ask: *"What is the Command pattern in OOP?"*  
> ✅ Ask: *"How does JavaScript's prototype chain work?"*  
> ❌ Don't ask: *"Write me a solution for the Undo Manager exercise"*  
> The moment you generate a solution, you lose the one thing these exercises give you: **the experience of being stuck and thinking your way out.**
