# 📝 Remedial Exam Result — JavaScript Object Oriented Programming
### Student Remedial Submission Review | Examiner: Eko Kurniawan Khannedy (Module)
### Reviewed by: Your Lecturer

---

> **Review Date:** 2026-03-09
> **Module:** JavaScript Object Oriented Programming
> **Project:** `rpgverse.js` (Revised Submission)
> **Previous Score:** 70 / 100
> **Remedial Status:** ✅ Submitted

---

## 🧑‍🏫 Lecturer's Opening Notes

This is a strong revision. You clearly read the previous feedback carefully, addressed most of the critical bugs, and even went beyond the minimum by improving the demo section (showing `sword.attackBonus` and `sword.element` — well done, that was a minor note from last time). The class ordering fix alone resolves a chain of crashes that would have broken the entire program.

You are **much closer** to a clean submission. But there are **2 remaining bugs** — one major, one minor — that I need to flag before giving you the final verdict.

---

## 📊 Score Summary

| Part | Competency | Max | Previous | This Attempt | Change |
|------|-----------|-----|---------|-------------|--------|
| 1 | Constructor Function + Prototype | 15 | 13 | **15** | ▲ +2 |
| 2 | ES6 Classes (all features) | 25 | 14 | **21** | ▲ +7 |
| 3 | Custom Error Classes | 10 | 5 | **10** | ▲ +5 |
| 4 | Static Members | 10 | 7 | **10** | ▲ +3 |
| 5 | `instanceof` Operator | 5 | 5 | **5** | — |
| 6 | Iterable & Iterator | 20 | 17 | **20** | ▲ +3 |
| 7 | Battle + Error Handling | 10 | 5 | **6** | ▲ +1 |
| 8 | Demo Completeness | 5 | 4 | **5** | ▲ +1 |
| **Total** | | **100** | **70** | **92** | **▲ +22** |

---

## ✅ What You Fixed — Full Credit

Let me acknowledge every bug from the last review that is now resolved:

---

### ✅ Bug #2 — Class ordering (was: ReferenceError)

```js
// ✅ FIXED — now correctly placed at the top
class InvalidCharacterError extends Error { ... }
class BattleError extends Error { ... }
// ... THEN Character, Warrior, Mage, Archer ...
```

This was the most damaging structural bug. Fixed correctly. The entire program can now run without crashing on startup.

---

### ✅ Bug #1 — Name validation logic (was: empty string passed)

```js
// ✅ FIXED
typeof name === "string" && name !== "" && maxHealth > 0 && attackPower >= 0
```

Correct. The `&&` chain properly rejects empty strings. The `>= 0` for `attackPower` also matches the spec. Clean fix.

---

### ✅ Bug #3 — `attack()` now applies damage

```js
// ✅ FIXED — damage is now applied to target
attack(target) {
  const secretBonus = this.#calculateSecretBonus();
  const totalDamage = this.attackPower + secretBonus;
  console.log(`${this.name} attacks ${target} for ${this.attackPower} damage!`);
  target.health -= totalDamage; // ✅ Health is modified
}
```

The core mechanic works now. Secret bonus is calculated and used. Health is actually reduced. The battle simulation is no longer a silent illusion.

---

### ✅ Bug #5 — `new BattleError()` (was: missing `new`)

```js
// ✅ FIXED in Mage
throw new BattleError(`${this.name} doesnt have enough mana!`);

// ✅ FIXED in Archer
throw new BattleError(`${this.name} has no arrows left!`);
```

Both now correctly use the `new` keyword. No more `TypeError` crashing.

---

### ✅ Bug #7 — Mana check order (was: deduct before check)

```js
// ✅ FIXED — check comes first now
if (this.manaPoints < 20) throw new BattleError(...);
const damage = ...
this.manaPoints -= 20;
```

Correct order. The guard clause correctly prevents the spell from proceeding when mana is insufficient.

---

### ✅ Bug #8 — `Party.removeMember()` (was: wrong syntax crash)

```js
// ✅ FIXED
removeMember(name) {
  this.members = this.members.filter((value) => value.name !== name);
}
```

Clean. `.filter()` returns a new array without the removed member. This is idiomatic JavaScript.

---

### ✅ Bug #9 — `Battle.start()` now has `InvalidCharacterError` handling

```js
} else if (error instanceof InvalidCharacterError) {
  console.error(`Invalid Character Error: ${error.message}`);
}
```

The third `catch` branch is now present as the spec required.

---

### ✅ Bug #10 — `status()` uses `this.maxHealth`

```js
// ✅ FIXED
`HP: ${this.#health}/${this.maxHealth}`
```

A Warrior with `maxHealth = 120` now correctly shows `HP: 120/120`. No more hardcoded `/100`.

---

### ✅ Bug #11 — `BattleUtils.printStats()` no longer double-increments

```js
// ✅ FIXED — this.totalBattles++ removed from printStats()
static printStats() {
  console.log(`=== RPGverse ${this.version} ===
  Total Characters Created: ${Character.count}
  Total Battles Fought: ${BattleUtils.totalBattles}`);
}
```

Stats now only increment in `calculateDamage()`. Calling `printStats()` is read-only.

---

### ✅ Demo Improvement — Weapon properties now shown

```js
// ✅ NEW — you added this yourself
console.log(`Attack bonus: ${sword.attackBonus}`);
console.log(`Element: ${sword.element}`);
```

This was a minor note from the last review. You noticed it and fixed it without being explicitly told. That's the right instinct.

---

## 🐛 Remaining Bugs (2)

---

### 🟠 Bug A — `Mage.castSpell()` still mutates `attackPower` (Major)

```js
castSpell(target) {
  ...
  const damage = (this.attackPower *= 2); // 🔴 Still wrong
  ...
}
```

The mana order is fixed — but the mutation is still there. `this.attackPower *= 2` permanently doubles the mage's base attack power. Every call to `castSpell()` compounds:

- Call 1: `attackPower` goes from 30 → 60, deals 60 damage
- Call 2: `attackPower` goes from 60 → 120, deals 120 damage
- Call 3: 120 → 240, deals 240 damage

This creates an accidentally exponential mage that becomes god-tier after a few spells. The `const damage = (this.attackPower *= 2)` syntax assigns the mutated value to `damage`, but the mutation happens as a side effect.

**The fix is one character:**
```js
const damage = this.attackPower * 2; // multiply, don't assign
```

`*` vs `*=` — one character that changes "read and compute" into "permanently overwrite."

---

### 🟡 Bug B — `Battle.start()` validation logic never fires (Minor-Major)

```js
start() {
  // 🔴 This block never throws — two separate logic errors
  if (
    (!this.party1) instanceof Party &&
    (!this.party2) instanceof this.party1
  )
    throw new BattleError();

  // 🔴 This also never throws — wrong property name
  if (this.party1.length === 0 && this.party2.length === 0)
    throw new BattleError();

  try { ... }
```

**Problem 1 — `(!this.party1) instanceof Party`:**

`!this.party1` evaluates to a **boolean** (`false` if party1 exists). A boolean is never an `instanceof Party`. So this entire condition is permanently `false`. It never throws, no matter what you pass.

The correct form is:
```js
!(this.party1 instanceof Party)
```

Note the position of `!` — negate the result of `instanceof`, not the object.

**Problem 2 — `&& this.party2.length`:**

`Party` has no `.length` property. It has a `.size()` method. `this.party1.length` is `undefined`, and `undefined === 0` is `false`. The empty-party check never fires either.

The correct check is: `this.party1.size() === 0`

**Problem 3 — `&&` should be `||`:**

Even if the logic was correct, using `&&` means *both* parties must be invalid simultaneously. A single empty party would slip through. Use `||` — throw if *either* is invalid.

**Problem 4 — Validations are outside the `try` block:**

If the `throw new BattleError()` lines did fire, they would not be caught by the `catch` block below — because they're before the `try`. Move them inside `try`.

**The correct validation:**
```js
try {
  if (!(this.party1 instanceof Party) || !(this.party2 instanceof Party))
    throw new BattleError("Invalid party — must be a Party instance");
  if (this.party1.size() === 0 || this.party2.size() === 0)
    throw new BattleError("Each party must have at least 1 member");
  ...
}
```

---

### 🟡 Bug C — `attack()` log shows wrong damage value (Minor)

```js
console.log(`${this.name} attacks ${target} for ${this.attackPower} damage!`);
//                                               ^^^^^^^^^^^^^^^^^^^
//                          logs base attackPower, but deals totalDamage (with secret bonus)
```

Two small issues:
1. The log reports `this.attackPower` but the actual damage dealt is `totalDamage` (= `attackPower + secretBonus`). The player sees misleading combat numbers.
2. `${target}` where `target` is an object logs `[object Object]`. Should be `${target.name}`.

**Correct log:**
```js
console.log(`${this.name} attacks ${target.name} for ${totalDamage} damage!`);
```

---

## 📊 Remaining Bug Impact

| Bug | Severity | Crashes? | Silent? | 
|-----|----------|----------|---------|
| A — `castSpell` `*=` mutation | 🟠 Major | No | Silent (exponential stat corruption) |
| B — Battle validation never fires | 🟠 Major | No | Silent (empty party runs without error) |
| C — `attack()` log inconsistency | 🟡 Minor | No | Misleading output only |

---

## 🏁 Final Verdict

```
╔══════════════════════════════════════════════════════════╗
║      REMEDIAL EXAM RESULT: JavaScript OOP               ║
╠══════════════════════════════════════════════════════════╣
║  Previous Score:   70 / 100  (C+)                       ║
║  Current Score:    92 / 100  (A-)                       ║
║  Improvement:      +22 points                           ║
║  Decision:  ✅  PASS — CLEARED FOR NEXT MODULE          ║
╚══════════════════════════════════════════════════════════╝
```

---

### 📋 Decision Explanation

**You pass.** The improvement from 70 to 92 is significant and real — you didn't just patch surface-level issues, you understood *why* each fix was necessary.

The 3 remaining bugs are real and I've documented them clearly, but none of them are blockers for module progression:

- Bug A (`*=` mutation) is a single-character fix you now know how to solve
- Bug B (validation logic) requires understanding operator precedence — I've shown you the exact correct form above
- Bug C (log inconsistency) is cosmetic

The fundamental OOP concepts of this module — prototype chains, ES6 class inheritance, iterables, private fields, error handling — are all correctly implemented in your revised submission. That is what this module tests.

---

## 🚀 You Are Cleared For:

> ### Next Module: JavaScript Standard Library

**Take these 3 things with you:**

1. **`*` vs `*=` mindset** — Always ask: "Am I computing a value or permanently changing state?" Mutations on class properties should almost always be intentional and explicit.

2. **Operator precedence with `!` and `instanceof`** — `!obj instanceof X` and `!(obj instanceof X)` are completely different. When in doubt, add parentheses.

3. **Validation belongs inside `try`** — If your validation throws and you want it caught, it must live inside the `try` block.

---

> **From your lecturer:**
>
> A jump from 70 to 92 between submissions is exactly what a good developer looks like — you identify the problems, you fix them, and you move forward. The 3 remaining bugs I've noted here? Keep them in mind. That kind of attention to mutation and logic precision will save you many hours of debugging in the Standard Library module and beyond.
>
> See you in the next module. Well done. 🚀

---

*Module: JavaScript Object Oriented Programming | By Eko Kurniawan Khannedy*
*Final status recorded: PASS ✅*