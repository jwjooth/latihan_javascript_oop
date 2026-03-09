# 🎓 Final Exam — JavaScript Object Oriented Programming
### Module by Eko Kurniawan Khannedy | Examiner: Your Lecturer

---

> **Read this carefully before you start.**
>
> This is your **one and only final exam** for this module. It is designed as a **single, unified project** that will test every competency you have learned — from Constructor Functions and Prototypes, all the way to Iterables and Custom Errors.
>
> There is no multiple-choice here. You will **build a real system** from scratch. Every feature you implement maps to a topic from the module. Skipping a feature means leaving a competency untested.
>
> **Grading is based on correctness, code quality, and completeness.** Good luck. You've got this. 💪

---

## 🏗️ Project: `RPGverse` — A Mini RPG Battle System

You are tasked with building a **text-based RPG Battle System** in JavaScript. The system must simulate characters, items, battles, and party management.

This project will be evaluated entirely through the **browser console** (or Node.js). No UI is required — your output is `console.log`.

---

## 📋 Competency Checklist

Before submitting, verify you have implemented **every** item below:

| # | Competency | Where It Appears |
|---|---|---|
| 1 | Object & Class concepts | All class definitions |
| 2 | Constructor Function (old style) | `Item` class via constructor function |
| 3 | Properties in Constructor Function | `Item` properties |
| 4 | Methods in Constructor Function | `Item` methods |
| 5 | Parameter in Constructor Function | `Item` parameters |
| 6 | Constructor Inheritance (old style) | `Weapon` via constructor inheritance |
| 7 | Prototype & Prototype Inheritance | Adding methods to `Item.prototype` |
| 8 | ES6 `class` keyword | `Character`, `Battle`, `Party` |
| 9 | Constructor in Class | All ES6 classes |
| 10 | Properties in Class | All ES6 classes |
| 11 | Methods in Class | All ES6 classes |
| 12 | Class Inheritance (`extends`) | `Warrior`, `Mage`, `Archer` extend `Character` |
| 13 | `super` constructor | Child class constructors |
| 14 | `super` method | Overridden methods calling parent |
| 15 | Getter & Setter | `Character` health with validation |
| 16 | Public Class Field | `Character.faction` |
| 17 | Private Class Field (`#`) | `Character.#secretPower` |
| 18 | Private Method (`#`) | Internal calculation logic |
| 19 | `instanceof` operator | Battle type-checking |
| 20 | Static Class Field | `Character.count` |
| 21 | Static Method | `BattleUtils.calculateDamage()` |
| 22 | `throw` Error | Validation throughout |
| 23 | Error Handling (`try/catch`) | Battle execution |
| 24 | `finally` keyword | Cleanup after battle |
| 25 | Custom Error Class | `InvalidCharacterError`, `BattleError` |
| 26 | Iterable & Iterator | `Party` class iterable |

---

## 🗂️ File Structure

Create a **single file** named `rpgverse.js`. All code goes in this one file. At the bottom of the file, place your **demo/test scenario** that exercises every feature.

```
rpgverse.js
```

---

## 🔨 Part 1 — The Old Way (Constructor Function + Prototype)

> These tasks test your understanding of JavaScript OOP **before** ES6.

### Task 1.1 — `Item` Constructor Function

Create a **Constructor Function** called `Item` with the following:

**Parameters:**
- `name` (string) — name of the item
- `type` (string) — e.g., `"consumable"`, `"equipment"`
- `rarity` (string) — e.g., `"common"`, `"rare"`, `"legendary"`

**Properties (set via `this` inside constructor):**
- `this.name`
- `this.type`
- `this.rarity`
- `this.isEquipped = false`

**Requirements:**
- Must be a proper constructor function (not an ES6 class)
- Creating an object must use the `new` keyword

```js
// Expected usage:
const potion = new Item("Health Potion", "consumable", "common");
console.log(potion.name); // "Health Potion"
```

---

### Task 1.2 — Add Method to `Item.prototype`

After defining `Item`, add a method called `describe()` **directly to `Item.prototype`** (not inside the constructor function body).

`describe()` should print to console:
```
[common] Health Potion (consumable)
```

**Requirements:**
- Must be added to the prototype, not inside the constructor
- Prove you understand prototype-based method sharing

---

### Task 1.3 — `Weapon` Constructor with Constructor Inheritance

Create a **Constructor Function** called `Weapon` that **inherits** from `Item` using:
```js
Item.call(this, name, "equipment", rarity);
```

**Additional properties for `Weapon`:**
- `this.attackBonus` (number) — how much attack power the weapon adds
- `this.element` (string) — e.g., `"fire"`, `"ice"`, `"none"`

Set up **Prototype Inheritance** correctly so that `Weapon` instances have access to `Item.prototype.describe()`.

```js
// Expected usage:
const sword = new Weapon("Flame Sword", "rare", 25, "fire");
sword.describe(); // [rare] Flame Sword (equipment)
console.log(sword instanceof Item); // true (bonus: test this in Part 5)
```

> 💡 **Hint:** Remember, prototype inheritance is "a little tricky." Think about how to correctly set up `Weapon.prototype` so it chains to `Item.prototype` without breaking the constructor reference.

---

## ⚔️ Part 2 — The Modern Way (ES6 Classes)

> These tasks test your mastery of the `class` keyword and all its features.

### Task 2.1 — `Character` Base Class

Create an ES6 class `Character` with the following:

**Public Class Fields (outside constructor):**
- `faction = "Neutral"` — default faction name

**Private Class Fields:**
- `#secretPower` — a hidden power value (set in constructor, never exposed directly)

**Static Class Field:**
- `static count = 0` — tracks total characters created

**Constructor parameters:**
- `name` (string)
- `maxHealth` (number)
- `attackPower` (number)
- `secretPower` (number) — stored in `#secretPower`

**Inside the constructor:**
- Set `this.name`
- Set `this.attackPower`
- Initialize `this.#secretPower = secretPower`
- Increment `Character.count` by 1
- Set private backing field `#health = maxHealth` and `this.maxHealth = maxHealth`

**Getter `health`:**
- Returns the current `#health` value

**Setter `health`:**
- Validates that the new value is a number
- Clamps the value: health cannot go below `0` or above `maxHealth`
- If the value is not a number, throw a `TypeError` with a descriptive message

**Private Method `#calculateSecretBonus()`:**
- Returns `this.#secretPower * 1.5`
- This method should only be used internally

**Public Methods:**
- `attack(target)` — deals `this.attackPower` damage to `target`. Internally calls `this.#calculateSecretBonus()` and adds it to the attack (so total damage = `attackPower + secretBonus`). Prints:
  ```
  [Character Name] attacks [Target Name] for [X] damage!
  ```
  Then sets `target.health -= totalDamage`

- `isAlive()` — returns `true` if `this.health > 0`, `false` otherwise

- `status()` — prints:
  ```
  [Name] | HP: 80/100 | ATK: 30 | Faction: Neutral
  ```

```js
// Expected usage:
const hero = new Character("Arthur", 100, 20, 10);
console.log(Character.count); // 1
console.log(hero.health);     // 100
hero.health = 150;            // clamped to 100
hero.health = -10;            // clamped to 0
hero.health = "abc";          // throws TypeError
```

---

### Task 2.2 — `Warrior` Class (extends `Character`)

Create a class `Warrior` that **extends `Character`**.

**Constructor parameters:** `name`, `maxHealth`, `attackPower`, `secretPower`, `shieldDefense`

**Must:**
- Call `super(name, maxHealth, attackPower, secretPower)` — use `super` constructor
- Set `this.shieldDefense = shieldDefense`
- Set `this.faction = "Warriors Guild"`

**Override the `attack(target)` method:**
- Call `super.attack(target)` to perform base attack
- Print an extra line:
  ```
  [Warrior Name] follows up with a shield bash!
  ```

**Add a new method `defend()`:**
- Temporarily prints: `[Name] raises their shield! Defense: [shieldDefense]`

---

### Task 2.3 — `Mage` Class (extends `Character`)

Create a class `Mage` that **extends `Character`**.

**Constructor parameters:** `name`, `maxHealth`, `attackPower`, `secretPower`, `manaPoints`

**Must:**
- Call `super` constructor
- Set `this.manaPoints = manaPoints`
- Set `this.faction = "Arcane Order"`

**Override `attack(target)`:**
- Call `super.attack(target)`
- Print: `[Mage Name] channels arcane energy! Remaining mana: [manaPoints - 10]`
- Decrease `this.manaPoints` by 10

**Add a new method `castSpell(target)`:**
- Deals `this.attackPower * 2` damage to target
- Costs 20 mana. If `manaPoints < 20`, throw a custom `BattleError` (see Part 3)
- Print: `[Mage Name] casts Arcane Blast on [Target Name] for [damage] damage!`

---

### Task 2.4 — `Archer` Class (extends `Character`)

Create a class `Archer` that **extends `Character`**.

**Constructor parameters:** `name`, `maxHealth`, `attackPower`, `secretPower`, `arrowCount`

**Must:**
- Call `super` constructor
- Set `this.arrowCount = arrowCount`
- Set `this.faction = "Ranger Scouts"`

**Override `attack(target)`:**
- If `arrowCount <= 0`, throw a custom `BattleError`: `"[Name] has no arrows left!"`
- Otherwise: call `super.attack(target)`, reduce `arrowCount` by 1
- Print: `[Archer Name] fires an arrow! [arrowCount] arrows remaining.`

---

### Task 2.5 — Getter & Setter Validation Demonstration

After creating your character instances in your demo section, demonstrate the setter validation:

```js
try {
    hero.health = "not a number"; // should throw TypeError
} catch (e) {
    console.log(`Caught error: ${e.message}`);
}
```

---

## 💥 Part 3 — Custom Errors

> These tasks test your ability to create and use custom error classes.

### Task 3.1 — `InvalidCharacterError`

Create a custom error class `InvalidCharacterError` that extends the built-in `Error` class.

**Constructor parameter:** `message`

**Must:**
- Call `super(message)`
- Set `this.name = "InvalidCharacterError"`

**Usage:** Throw this when invalid data is passed to a `Character` constructor (e.g., negative `maxHealth`, empty `name`, or non-number `attackPower`).

Add validation **inside the `Character` constructor** that throws `InvalidCharacterError` if:
- `name` is empty or not a string
- `maxHealth` is not a positive number
- `attackPower` is not a non-negative number

---

### Task 3.2 — `BattleError`

Create a custom error class `BattleError` that extends `Error`.

**Constructor parameter:** `message`

**Must:**
- Call `super(message)`
- Set `this.name = "BattleError"`

**Usage:** Used in `Mage.castSpell()` and `Archer.attack()` when conditions aren't met.

---

## ⚡ Part 4 — Static Members & Utilities

> These tasks test your knowledge of the `static` keyword.

### Task 4.1 — `BattleUtils` Static Class

Create a class `BattleUtils` with **only static members** (no instances should ever be made).

**Static Fields:**
- `static version = "1.0.0"` — system version
- `static totalBattles = 0` — total battles fought

**Static Methods:**

`static calculateDamage(attacker, defender)`
- Receives two `Character` instances
- Returns `Math.max(0, attacker.attackPower - Math.floor(Math.random() * 10))`
- Also increments `BattleUtils.totalBattles`

`static printStats()`
- Prints:
  ```
  === RPGverse v1.0.0 ===
  Total Characters Created: [Character.count]
  Total Battles Fought: [BattleUtils.totalBattles]
  ```

`static isValidCharacter(obj)`
- Returns `true` if `obj` is an instance of `Character` (use `instanceof`)
- Returns `false` otherwise

---

## 🔁 Part 5 — `instanceof` Operator

> These tasks demonstrate your understanding of `instanceof` in an inheritance chain.

### Task 5.1 — Type Checking

In your demo section, create one instance of each subclass (`Warrior`, `Mage`, `Archer`) and one instance of the `Weapon` constructor function. Then log the following checks:

```js
// For each character:
console.log(warrior instanceof Warrior);   // true
console.log(warrior instanceof Character); // true — inheritance chain
console.log(warrior instanceof Mage);      // false

// For weapon (constructor function based):
console.log(sword instanceof Weapon); // true
console.log(sword instanceof Item);   // true — prototype chain
```

Also use `BattleUtils.isValidCharacter()` to verify each character.

---

## 🔄 Part 6 — Iterable & Iterator

> This is the final and most advanced competency. Do not skip it.

### Task 6.1 — `Party` Class (Iterable)

Create a class `Party` that acts as a **container for characters** and implements the **Iterable protocol**.

**Constructor:** Takes an optional `name` for the party (default: `"Adventurers"`)

**Properties:**
- `this.name` — party name
- `this.members = []` — array of `Character` instances

**Methods:**
- `addMember(character)` — adds a `Character` to `this.members`. If the argument is not an instance of `Character`, throw `InvalidCharacterError`
- `removeMember(name)` — removes a character by name
- `size()` — returns `this.members.length`

**Make `Party` Iterable:**

Implement the `[Symbol.iterator]()` method so that `Party` instances can be used in a `for...of` loop.

The iterator should:
- Return each `Character` in the party **one by one**
- Each iteration yields the character object
- When all characters have been yielded, return `{ value: undefined, done: true }`

> 💡 You must implement this **manually** using an object with a `next()` method — do **not** just return `this.members[Symbol.iterator]()`. That would defeat the purpose of this exercise.

**Expected usage:**
```js
const party = new Party("Heroes of the North");
party.addMember(warrior);
party.addMember(mage);
party.addMember(archer);

for (const member of party) {
    member.status();
}
```

---

## 🧪 Part 7 — `Battle` Class (Error Handling + try/catch/finally)

> Tie everything together.

### Task 7.1 — `Battle` Class

Create a class `Battle` with:

**Constructor:** `(party1, party2)` — two `Party` instances

**Method `start()`:**

Wrap the entire battle logic inside a `try...catch...finally` block.

**Inside `try`:**
- Log: `"⚔️ Battle Start: [Party1 Name] vs [Party2 Name]!"`
- Validate that `party1` and `party2` are instances of `Party`. If not, throw `BattleError`
- Validate both parties have at least 1 member. If not, throw `BattleError`
- Simulate battle: iterate over `party1` using `for...of`, and have each member attack the first alive member of `party2` (find them using a regular `for` loop + `isAlive()`)
- After all of `party1` attacks, do the reverse (`party2` attacks `party1`)
- Log the outcome (who is still alive after all attacks)

**Inside `catch (e)`:**
- If `e instanceof BattleError`: log `"Battle Error: [message]"`
- If `e instanceof InvalidCharacterError`: log `"Character Error: [message]"`
- Otherwise: log `"Unknown Error: [message]"`

**Inside `finally`:**
- Always print: `"⚔️ Battle concluded. Updating stats..."`
- Call `BattleUtils.printStats()`

---

## 🎬 Part 8 — Demo / Test Scenario

At the **bottom of `rpgverse.js`**, write a complete test scenario that demonstrates every single feature implemented above.

Your demo **must** include, in order:

1. **Create Items and Weapons** using the constructor function (old way)
   - Print their `.describe()` using the prototype method

2. **Create Characters** of all three subclasses
   - Demonstrate `Character.count` incrementing

3. **Demonstrate Getter/Setter** with valid and invalid values (use `try/catch`)

4. **Demonstrate Custom Errors**
   - Try to create a `Character` with invalid data
   - Show `InvalidCharacterError` being caught

5. **`instanceof` checks** — all from Part 5

6. **Create a `Party`** and add all characters to it
   - Try adding a non-character and catch the error

7. **Iterate over the Party** using `for...of` and call `.status()` on each

8. **Run `BattleUtils.isValidCharacter()`** on each character and a random object

9. **Execute a `Battle`**
   - Normal battle (should work)
   - Battle with empty party (should throw `BattleError`, caught in `catch`)

10. **Call `BattleUtils.printStats()`** at the very end

---

## 📐 Code Quality Requirements

Your code will also be evaluated on the following:

- ✅ All constructor functions use **PascalCase**
- ✅ Private fields use the `#` prefix
- ✅ Static members are accessed via **class name**, not instance
- ✅ `super()` is called **before** accessing `this` in any child constructor
- ✅ `try/catch/finally` is used meaningfully, not just to suppress errors
- ✅ Custom errors have correct `name` property set
- ✅ The `Party` iterable returns a **fresh iterator** on each `for...of` call
- ✅ Console output is clean and readable — use emoji/separators for clarity

---

## ⏱️ Time Estimate

| Part | Estimated Time |
|---|---|
| Part 1 — Constructor Function + Prototype | 30 min |
| Part 2 — ES6 Classes | 45 min |
| Part 3 — Custom Errors | 15 min |
| Part 4 — Static Members | 15 min |
| Part 5 — instanceof | 10 min |
| Part 6 — Iterable & Iterator | 30 min |
| Part 7 — Battle + Error Handling | 20 min |
| Part 8 — Demo Scenario | 20 min |
| **Total** | **~3 hours** |

---

## 🧾 Submission

Submit a single file: **`rpgverse.js`**

Make sure it runs **without errors** in the browser console or Node.js (`node rpgverse.js`).

Before submitting, run this self-check:

```
□ Does `node rpgverse.js` execute without crashing?
□ Is every competency from the checklist implemented?
□ Does the demo section exercise every feature at least once?
□ Are all custom errors properly thrown AND caught?
□ Does the Party class work correctly with for...of?
□ Does Weapon.prototype correctly chain to Item.prototype?
□ Are static members accessed via the class, not an instance?
□ Does the health setter correctly clamp and validate values?
```

---

## 🏆 Grading Rubric

| Category | Points |
|---|---|
| Part 1: Constructor Function + Prototype | 15 |
| Part 2: ES6 Classes (all 4 classes) | 25 |
| Part 3: Custom Error Classes | 10 |
| Part 4: Static Members | 10 |
| Part 5: instanceof | 5 |
| Part 6: Iterable & Iterator | 20 |
| Part 7: Battle + Error Handling | 10 |
| Part 8: Demo completeness | 5 |
| **Code Quality** | **Bonus +5** |
| **Total** | **100 (+5 bonus)** |

---

> **A note from your lecturer:**
>
> This exam is designed to be challenging but completely achievable with everything you've learned in this module. Every single task maps 1-to-1 to a concept we studied together.
>
> Don't rush. Read each task twice before writing code. Test as you go — don't wait until everything is written to run it.
>
> If you can build `rpgverse.js` and it runs cleanly end-to-end, you are genuinely ready for the next module.
>
> You're a developer. Go build something. 🚀

---

*Exam created for the JavaScript Object Oriented Programming module.*
*Good luck — I believe in you!*