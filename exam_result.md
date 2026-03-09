# 📝 Final Exam Result — JavaScript Object Oriented Programming
### Student Submission Review | Examiner: Eko Kurniawan Khannedy (Module)
### Reviewed by: Your Lecturer

---

> **Review Date:** 2026-03-09
> **Module:** JavaScript Object Oriented Programming
> **Project:** `rpgverse.js` — Mini RPG Battle System
> **Submission Status:** ✅ Submitted

---

## 🧑‍🏫 Lecturer's Opening Notes

First of all — good job for submitting a complete, single-file project. The overall architecture of `rpgverse.js` shows that you understand the **big picture** of OOP: you separated concerns correctly (Items, Characters, Party, Battle), your naming is consistent and professional, and your demo scenario is well-structured.

However, a final exam is about **correctness of detail**, not just structure. And this submission has several **critical bugs** that would cause the program to either crash at runtime or silently produce wrong results. I'll walk through every single one.

Read this review carefully. The bugs I flag here are exactly the kind of issues that break real production systems.

---

## 📊 Score Summary

| Part | Competency | Max | Your Score | Status |
|------|-----------|-----|-----------|--------|
| 1 | Constructor Function + Prototype | 15 | 13 | ✅ |
| 2 | ES6 Classes (all features) | 25 | 14 | ⚠️ |
| 3 | Custom Error Classes | 10 | 5 | ❌ |
| 4 | Static Members | 10 | 7 | ⚠️ |
| 5 | `instanceof` Operator | 5 | 5 | ✅ |
| 6 | Iterable & Iterator | 20 | 17 | ✅ |
| 7 | Battle + Error Handling | 10 | 5 | ⚠️ |
| 8 | Demo Completeness | 5 | 4 | ✅ |
| **Total** | | **100** | **70** | ⚠️ |

---

## 🔍 Detailed Review by Part

---

### ✅ Part 1 — Constructor Function + Prototype (13/15)

**Task 1.1 — `Item` Constructor Function**

```js
function Item(name, type, rarity) {
  this.name = name;
  this.type = type;
  this.rarity = rarity;
  this.isEquipped = false;
}
```

✅ **CORRECT.** All four properties are initialized via `this`, parameters are correct, `isEquipped` defaults to `false`. Clean.

---

**Task 1.2 — `Item.prototype.describe()`**

```js
Item.prototype.describe = function () {
  console.log(`[${this.rarity}] ${this.name} (${this.type})`);
};
```

✅ **CORRECT.** Added to the prototype (not inside the constructor), correct template literal format. This is exactly right — this method is now shared across all `Item` instances without duplication.

---

**Task 1.3 — `Weapon` Constructor Inheritance**

```js
function Weapon(name, rarity, attackBonus, element) {
  Item.call(this, name, "equipment", rarity);
  this.attackBonus = attackBonus;
  this.element = element;
}
Weapon.prototype = Object.create(Item.prototype);
Weapon.prototype.constructor = Weapon;
```

✅ **CORRECT.** `Item.call(this, ...)` correctly inherits properties. `Object.create(Item.prototype)` correctly sets up the prototype chain. `constructor` reference is restored. This is the proper way to do prototype inheritance — well done.

**Minor deduction (-2):** In the demo, `sword.describe()` is called and outputs `[rare] Flame Sword (equipment)` which is correct, but the `attackBonus` and `element` properties are never demonstrated or tested in the demo. They exist but go unused, which means you didn't fully exercise what you built.

---

### ⚠️ Part 2 — ES6 Classes (14/25)

**Task 2.1 — `Character` Base Class**

Let's go field by field:

```js
faction = "Neutral";         // ✅ Public class field
#secretPower;                // ✅ Private class field declared
#health = 0;                 // ✅ Private backing field
static count = 0;            // ✅ Static class field
```

All field declarations are correct.

**🔴 CRITICAL BUG — Constructor validation logic:**

```js
if (
  (name === "" || typeof name === "string") &&
  maxHealth > 0 &&
  attackPower > 0
) {
```

This condition is **logically inverted for the name check.** The expression `name === "" || typeof name === "string"` evaluates to `true` when `name` is an empty string — which is exactly the case you are supposed to **reject**.

Because `"" === ""` is `true`, the entire condition passes when name is an empty string, and no error is thrown. Your demo even tries to catch this:

```js
const badChar = new Character("", -100, -5, 0); // You expect InvalidCharacterError
```

But with this logic, the empty string passes the name check. The character would only be rejected because `maxHealth` and `attackPower` are negative. If someone passed `new Character("", 100, 10, 0)`, they would get a valid character with an empty name — that is a silent bug.

**The correct condition should be:**
```js
if (
  typeof name === "string" && name !== "" &&
  maxHealth > 0 &&
  attackPower >= 0  // Note: >= 0, not > 0 — the spec says non-negative
) {
```

Also note: the exam spec says `attackPower` should be **non-negative** (i.e., `>= 0`), not strictly positive (`> 0`). A support character with 0 attack is valid. Your check `attackPower > 0` would reject them.

---

**🔴 CRITICAL BUG — Custom errors used before they're defined:**

```js
class Character {
  constructor(...) {
    // ...
    throw new InvalidCharacterError("Invalid character parameters"); // ← HERE
  }
}

// ... 50 lines later ...

class InvalidCharacterError extends Error { ... } // ← DEFINED HERE
class BattleError extends Error { ... }           // ← DEFINED HERE
```

In JavaScript, `class` declarations are **NOT hoisted** the same way `function` declarations are. If the `Character` constructor tries to throw `InvalidCharacterError` before that class is defined in execution order, you will get:

```
ReferenceError: Cannot access 'InvalidCharacterError' before initialization
```

**Fix:** Always define your custom error classes **before** the classes that use them. Move `InvalidCharacterError` and `BattleError` to the very **top of the file**, before `Item`, before everything.

---

**🔴 CRITICAL BUG — `attack()` method doesn't apply damage:**

```js
attack(target) {
  this.#calculateSecretBonus();
  return `${this.name} attacks ${target} for ${this.attackPower} damage!`;
}
```

Two problems here:

1. The method **returns a string** but never `console.log`s it. The exam spec says to *print* the attack message. In `Battle.start()` you call `member.attack(enemy)` — but since `attack()` only returns a string and never logs it, the entire battle runs completely silently with no output.

2. More critically: the attack **never modifies the target's health**. The spec says:
   ```
   target.health -= totalDamage
   ```
   Without this line, the battle simulation is a total fiction — everyone enters the battle alive, no damage is dealt, and everyone exits alive. The `isAlive()` check in the battle loop will always return `true` forever.

3. `#calculateSecretBonus()` is called but its return value is discarded. The total damage should be `attackPower + secretBonus`, not just `attackPower`.

**Correct implementation:**
```js
attack(target) {
  const secretBonus = this.#calculateSecretBonus();
  const totalDamage = this.attackPower + secretBonus;
  console.log(`${this.name} attacks ${target.name} for ${totalDamage} damage!`);
  target.health -= totalDamage;
}
```

---

**Task 2.1 — `status()` method:**

```js
status() {
  console.log(
    `${this.name} | HP: ${this.#health}/100 | ATK: ${this.attackPower} | Faction: ${this.faction}`,
  );
}
```

⚠️ **Minor bug:** The max health is hardcoded as `/100`. It should be `/${this.maxHealth}`. A `Warrior` with `maxHealth = 120` would show `HP: 120/100` which makes no sense.

---

**Task 2.2 — `Warrior` Class**

```js
class Warrior extends Character {
  constructor(name, maxHealth, attackPower, secretPower, shieldDefense) {
    super(name, maxHealth, attackPower, secretPower);
    this.shieldDefense = shieldDefense;
    this.faction = "Warriors Guild";
  }
  attack(target) {
    super.attack(target);
    console.log(`${this.name} follows up with a shield bash`);
  }
  defend() {
    console.log(`${this.name} raises their shield! Defense: ${this.shieldDefense}`);
  }
}
```

✅ `extends` and `super` constructor are correct.
✅ `super.attack(target)` calling parent method is correct.
✅ `defend()` is correct.
⚠️ Inherits the damage-not-applied bug from `Character.attack()`.

---

**Task 2.3 — `Mage` Class**

```js
castSpell(target) {
  this.attackPower *= 2;         // 🔴 BUG 1
  this.manaPoints -= 20;
  if (this.manaPoints < 20) throw BattleError(); // 🔴 BUG 2
  ...
}
```

**🔴 BUG 1 — `attackPower` is permanently mutated:**
`this.attackPower *= 2` modifies the character's base `attackPower` forever. Call `castSpell()` twice and the mage's attack doubles again. The spec says to deal `this.attackPower * 2` damage — calculate it as a local variable, don't mutate the property.

**Correct:**
```js
const damage = this.attackPower * 2;
```

**🔴 BUG 2 — `BattleError` thrown without `new` keyword:**
```js
throw BattleError(); // WRONG — calls BattleError as a function, not a constructor
throw new BattleError(); // CORRECT
```

Calling a class without `new` throws: `TypeError: Class constructor BattleError cannot be invoked without 'new'`. Your code would crash with a `TypeError`, not a `BattleError`.

Also: the mana check logic is **inverted**. You deduct mana first, then check if mana is sufficient. This means at `manaPoints = 20`, you deduct to 0 first, then `0 < 20` throws the error — but the damage was already partially calculated. The check should come **before** deducting.

**Correct order:**
```js
castSpell(target) {
  if (this.manaPoints < 20) throw new BattleError(`${this.name} doesn't have enough mana!`);
  const damage = this.attackPower * 2;
  this.manaPoints -= 20;
  console.log(`${this.name} casts Arcane Blast on ${target.name} for ${damage} damage!`);
  target.health -= damage;
}
```

---

**Task 2.4 — `Archer` Class**

```js
attack(target) {
  if (this.arrowCount <= 0)
    throw BattleError(`${this.name} has no arrows left!`); // 🔴 Missing `new`
  ...
}
```

Same bug as Mage — `BattleError(...)` is missing `new`. This will crash at runtime.

---

**Task 2.5 — Getter/Setter Validation**

✅ Implemented correctly in the demo section (section 3). The try/catch around the invalid setter is properly placed and works correctly — assuming the class declaration order bug is fixed first.

---

### ❌ Part 3 — Custom Error Classes (5/10)

```js
class InvalidCharacterError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidCharacterError";
  }
}
class BattleError extends Error {
  constructor(message) {
    super(message);
    this.name = "BattleError";
  }
}
```

✅ **The class definitions themselves are correct.** `extends Error`, `super(message)`, `this.name` — all right.

❌ **But both classes are placed AFTER the classes that use them** (see the hoisting bug explained in Part 2). This is a structural problem, not a logic problem — but it causes a `ReferenceError` at runtime.

❌ **`BattleError` is thrown without `new` in both `Mage` and `Archer`** (see above).

Score reflects: correct class bodies (-0), wrong positioning (-3), missing `new` keyword when throwing (-2).

---

### ⚠️ Part 4 — Static Members (7/10)

```js
static printStats() {
  this.totalBattles++;  // 🔴 Double-counting bug
  console.log(`...`);
}
```

**🔴 BUG — `totalBattles` is incremented inside `printStats()`:**
`totalBattles` is already incremented in `calculateDamage()`. Calling `printStats()` increments it again every time you print. In your demo, you call `BattleUtils.printStats()` twice — so two extra phantom battles are added to the count. Remove the increment from `printStats()`.

✅ `static version`, `static totalBattles` — correct.
✅ `calculateDamage()` — correct (though `defender` is unused, which is fine).
✅ `isValidCharacter()` — correct.

---

### ✅ Part 5 — `instanceof` (5/5)

```js
console.log(warrior instanceof Warrior);   // true ✅
console.log(warrior instanceof Character); // true ✅
console.log(warrior instanceof Mage);      // false ✅
// ...
console.log(sword instanceof Weapon); // true ✅
console.log(sword instanceof Item);   // true ✅
```

✅ **PERFECT.** All instanceof checks are present and logically correct. You correctly demonstrated that `instanceof` traverses the full prototype/class chain. This section is clean.

---

### ✅ Part 6 — Iterable & Iterator (17/20)

**`[Symbol.iterator]()`**

```js
[Symbol.iterator]() {
  let index = 0;
  const members = this.members;
  return {
    next() {
      if (index < members.length) {
        return { value: members[index++], done: false };
      }
      return { value: undefined, done: true };
    },
  };
}
```

✅ **EXCELLENT.** This is a textbook-correct manual iterator implementation. You correctly:
- Return a fresh iterator object each time `[Symbol.iterator]()` is called (the `index` variable is scoped inside, so each `for...of` gets its own independent counter)
- Return `{ value, done: false }` for items
- Return `{ value: undefined, done: true }` when exhausted
- This is exactly what the module teaches about the Iterator protocol

**❌ `removeMember()` is broken:**

```js
removeMember(name) {
  delete this.members(name); // 🔴 Wrong syntax AND wrong method
}
```

`this.members` is an array. `this.members(name)` attempts to call the array as a function, which throws `TypeError: this.members is not a function`. Even if the syntax was `this.members[name]`, `delete` on an array index leaves a `hole` (sparse array), not a clean removal.

**Correct implementation:**
```js
removeMember(name) {
  this.members = this.members.filter(m => m.name !== name);
}
```

---

### ⚠️ Part 7 — Battle + Error Handling (5/10)

```js
start() {
  try {
    console.log(`⚔️ Battle Start: ${this.party1.name} vs ${this.party2.name}!`);
    for (const member of this.party1) {
      if (!member.isAlive()) continue;
      for (const enemy of this.party2) {
        if (enemy.isAlive()) {
          member.attack(enemy);
          break;
        }
      }
    }
  } catch (error) {
    if (error instanceof BattleError) {
      console.error(`Battle Error: ${error.message}`);
    } else {
      console.error(`Unknown Error: ${error.message}`);
    }
  } finally {
    console.log(`⚔️ Battle concluded. Updating stats...`);
    BattleUtils.printStats();
  }
}
```

✅ `try/catch/finally` structure is correctly used.
✅ `for...of` over `party1` uses the Iterable protocol.
✅ `isAlive()` check is present.
✅ `finally` always runs — demonstrated correctly.

**❌ Missing validation for empty parties and non-Party arguments:**
The exam spec says:
> Validate that `party1` and `party2` are instances of `Party`. If not, throw `BattleError`.
> Validate both parties have at least 1 member. If not, throw `BattleError`.

Your `start()` method has no such checks. In your demo, you create an `emptyParty` and run a battle against it — but no `BattleError` is thrown, because there's no validation. The battle just silently starts and ends with no activity. The catch block never fires.

**❌ `catch` doesn't handle `InvalidCharacterError`:**
The spec says to handle `InvalidCharacterError` separately. Your catch only handles `BattleError` and a generic fallback. While functional, this is incomplete.

**❌ Attack doesn't apply damage (inherited from Part 2 bug):**
Since `Character.attack()` never modifies `target.health`, the entire battle simulation produces no actual changes in the game state. `isAlive()` will always return `true` for all enemies.

---

### ✅ Part 8 — Demo Completeness (4/5)

Your demo section is well-organized with clear comments separating each test. The flow is logical and covers all major features. The only deduction is that some tests don't function as intended due to the bugs above (the empty party battle test doesn't throw an error, the attack simulation doesn't apply damage).

---

## 🐛 Bug Summary Table

| # | Bug | Severity | Location |
|---|-----|----------|----------|
| 1 | `name === "" \|\| typeof name === "string"` — empty string passes validation | 🔴 Critical | `Character` constructor |
| 2 | `InvalidCharacterError` and `BattleError` defined AFTER they're used — causes `ReferenceError` | 🔴 Critical | File structure / class ordering |
| 3 | `attack()` returns a string instead of logging + applying damage to target | 🔴 Critical | `Character.attack()` |
| 4 | `#calculateSecretBonus()` return value is discarded in `attack()` | 🔴 Critical | `Character.attack()` |
| 5 | `BattleError()` thrown without `new` keyword — causes `TypeError` | 🔴 Critical | `Mage.castSpell()`, `Archer.attack()` |
| 6 | `this.attackPower *= 2` permanently mutates the base stat | 🟠 Major | `Mage.castSpell()` |
| 7 | Mana check happens AFTER deduction — wrong order | 🟠 Major | `Mage.castSpell()` |
| 8 | `delete this.members(name)` — wrong syntax, crashes | 🟠 Major | `Party.removeMember()` |
| 9 | `Battle.start()` has no validation for empty/invalid parties | 🟠 Major | `Battle.start()` |
| 10 | `status()` hardcodes `/100` instead of using `this.maxHealth` | 🟡 Minor | `Character.status()` |
| 11 | `BattleUtils.printStats()` increments `totalBattles` — double-counting | 🟡 Minor | `BattleUtils.printStats()` |
| 12 | `attackPower > 0` should be `>= 0` per spec | 🟡 Minor | `Character` constructor validation |

---

## 💡 What You Did Well

- **Prototype chain setup** — `Object.create(Item.prototype)` with constructor restoration is exactly right.
- **Manual Iterator implementation** — this is the hardest part of the module and you nailed it completely. The index closure pattern is correct.
- **Class field types** — you correctly placed public, private, and static fields in the right places.
- **`super` usage** — calling `super()` in every child constructor before accessing `this` is correct throughout.
- **`instanceof` checks** — all correct and thorough.
- **Demo structure** — your test scenario is organized, readable, and shows a clear understanding of what needs to be tested.
- **Getter/Setter structure** — the clamping logic for health is correct.

---

## 📌 How to Fix (Prioritized)

If you were to fix this submission, here is the order to tackle bugs:

1. **Move `InvalidCharacterError` and `BattleError` to the very top of the file** — this unblocks everything else.
2. **Fix the `name` validation logic** in `Character` constructor.
3. **Fix `Character.attack()`** — log the message, apply damage, use the secret bonus.
4. **Add `new` before all `throw BattleError()`** calls.
5. **Fix `Mage.castSpell()`** — check mana before deducting, use a local variable for damage.
6. **Fix `Party.removeMember()`** — use `.filter()`.
7. **Add party validation** to `Battle.start()`.
8. **Fix `status()`** to use `this.maxHealth`.
9. **Remove the extra increment** from `BattleUtils.printStats()`.

---

## 🏁 Final Verdict

```
╔══════════════════════════════════════════════════════════╗
║         FINAL EXAM RESULT: JavaScript OOP               ║
╠══════════════════════════════════════════════════════════╣
║  Score:      70 / 100                                   ║
║  Grade:      C+                                         ║
║  Decision:   ⚠️  CONDITIONAL PASS — REMEDIAL REQUIRED   ║
╚══════════════════════════════════════════════════════════╝
```

---

### 📋 Decision Explanation

You **will not advance to the next module immediately.** Here is why:

A score of **70** shows that you understand the *concepts* — you know what a prototype chain is, what `extends` does, what an iterator looks like. That knowledge is real and valuable.

But **5 of the 12 bugs listed are Critical-severity** — meaning they would cause runtime crashes (`ReferenceError`, `TypeError`) in a real application. The most damaging one is Bug #3: your entire battle system simulates fights where no damage is ever applied. The system runs, but it doesn't *work*.

A developer who ships code that compiles but silently does nothing is harder to debug than a developer who ships code that fails loudly. In production, this type of bug costs hours.

---

### 📝 Remedial Assignment

You do **not** need to redo the entire exam. Your remedial is targeted:

**Fix the following and resubmit only the corrected `rpgverse.js`:**

1. ✅ Move custom error classes to the top of the file
2. ✅ Fix the `name` validation condition in `Character`
3. ✅ Fix `Character.attack()` to log and apply damage with secret bonus
4. ✅ Add `new` to all `throw BattleError(...)` calls
5. ✅ Fix `Mage.castSpell()` — check mana first, use local variable for damage
6. ✅ Fix `Party.removeMember()` — use `.filter()`
7. ✅ Add validation in `Battle.start()` for empty parties

**Optional (for full marks):**
- Fix `status()` to use `this.maxHealth`
- Remove double-increment in `BattleUtils.printStats()`
- Fix `attackPower >= 0` check

---

### 🚀 Path to Next Module

Once you fix the 7 required items and your `rpgverse.js` runs cleanly in Node.js with all battle interactions working correctly (damage applied, errors thrown and caught as expected), you are cleared to proceed to:

> **Next Module: JavaScript Standard Library**

The concepts from this module — especially Iterables, Class Inheritance, and Error Handling — appear heavily in the Standard Library module. Getting these fundamentals right now will make the next module significantly easier for you.

---

*Review completed by your lecturer. Fix, resubmit, and we move forward. You're close — these are fixable bugs, not fundamental misunderstandings. 💪*

---

*Module: JavaScript Object Oriented Programming | By Eko Kurniawan Khannedy*
