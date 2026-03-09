# 📝 Final Revision Result — JavaScript Object Oriented Programming
### Student 3rd Submission Review | Examiner: Eko Kurniawan Khannedy (Module)
### Reviewed by: Your Lecturer

---

> **Review Date:** 2026-03-09
> **Module:** JavaScript Object Oriented Programming
> **Project:** `rpgverse.js` (3rd Revision)
> **Previous Score:** 92 / 100
> **Remaining Bugs from Last Review:** Bug A (Major), Bug B (Major), Bug C (Minor)

---

## 🧑‍🏫 Lecturer's Opening Notes

Two out of three remaining bugs are now fully fixed. Specifically, Bug A — the one I called the most impactful of the three — is cleanly resolved. Bug C, the log inconsistency, is also gone. Well done on those two.

Bug B however — the `Battle.start()` validation — is still broken. You made changes to it, which shows you tried, but the fix introduced a *new* type of runtime crash on top of the original silent-failure. I'll walk through it in detail below.

---

## 📊 Score Summary

| Part | Competency | Max | Attempt 1 | Attempt 2 | This Attempt |
|------|-----------|-----|-----------|-----------|-------------|
| 1 | Constructor Function + Prototype | 15 | 13 | 15 | **15** |
| 2 | ES6 Classes (all features) | 25 | 14 | 21 | **24** |
| 3 | Custom Error Classes | 10 | 5 | 10 | **10** |
| 4 | Static Members | 10 | 7 | 10 | **10** |
| 5 | `instanceof` Operator | 5 | 5 | 5 | **5** |
| 6 | Iterable & Iterator | 20 | 17 | 20 | **20** |
| 7 | Battle + Error Handling | 10 | 5 | 6 | **8** |
| 8 | Demo Completeness | 5 | 4 | 5 | **5** |
| **Total** | | **100** | **70** | **92** | **96** |

---

## ✅ What You Fixed This Round

---

### ✅ Bug A — `castSpell()` mutation is gone

```js
// Previous (broken):
const damage = (this.attackPower *= 2); // permanently mutated the stat

// This submission (correct):
const damage = this.attackPower * 2; // ✅ read-only computation
```

This was the most impactful fix of the three. One character (`*` vs `*=`), but the difference between a mage that works correctly every battle and one that exponentially breaks after the first spell. Clean.

---

### ✅ Bug C — `attack()` log now shows correct values

```js
// Previous (misleading):
console.log(`${this.name} attacks ${target} for ${this.attackPower} damage!`);
// showed base attackPower, not totalDamage; `target` printed [object Object]

// This submission (correct):
console.log(`${this.name} attacks ${target.name} for ${totalDamage} damage!`);
// ✅ uses target.name, ✅ shows actual damage dealt including secret bonus
```

Both issues in that log line are fixed. The combat output now accurately reflects what's actually happening to the target's health.

---

## 🐛 Remaining Bug — `Battle.start()` validation (still broken, differently)

This is the one bug that has persisted across all three submissions. Let me show you exactly what the code looks like and dissect each line:

```js
start() {
  if (
    !(this.party1 instanceof Party) ||          // line A
    !(this.party2 instanceof this.party1)       // line B  🔴
  )
    throw new BattleError("Invalid party - must be a Party instance");

  if (this.party1.length === 0 && this.party2.size === 0)  // line C 🔴
    throw new BattleError("Each party must have at least 1 member");

  try { ... }
```

---

**Line A — ✅ Now correct:**
```js
!(this.party1 instanceof Party)
```
The parentheses are in the right place now. `!` negates the result of `instanceof`, not the object. This line works.

---

**Line B — 🔴 New crash: `instanceof this.party1`:**
```js
!(this.party2 instanceof this.party1)
```

`instanceof` requires its **right-hand side to be a constructor function or class**. `this.party1` is an *instance object* (a `Party` object), not a class. At runtime, JavaScript will throw:

```
TypeError: Right-hand side of 'instanceof' is not callable
```

You replaced `Party` with `this.party1` — but `instanceof` doesn't work that way. You're not checking "is party2 the same *type* as party1." You're checking "is party2 an instance of the `Party` class." The fix is simply:

```js
!(this.party2 instanceof Party)  // Party the class, not this.party1 the instance
```

---

**Line C — 🔴 Two separate errors, `.length` and `.size`:**
```js
if (this.party1.length === 0 && this.party2.size === 0)
```

Error 1: `this.party1.length` — `Party` has no `.length` property. It has a `.size()` method. `this.party1.length` is `undefined`. `undefined === 0` is `false`. This condition never triggers.

Error 2: `this.party2.size` — `.size` without `()` is a **reference to the method function itself**, not the result of calling it. A function object is always truthy and is never `=== 0`. This condition also never triggers.

Additionally, `&&` means *both* parties must be empty simultaneously to throw. A single empty party would slip through. The correct operator is `||`.

**The three fixes needed for this block:**
```js
// Fix line B and C together:
if (!(this.party1 instanceof Party) || !(this.party2 instanceof Party))
  throw new BattleError("Invalid party — must be a Party instance");
if (this.party1.size() === 0 || this.party2.size() === 0)
  throw new BattleError("Each party must have at least 1 member");
```

---

**Still outside `try` — validations won't be caught:**

Both `throw` statements are before the `try` block. If they fire, the `catch` block will not handle them — the error propagates uncaught to the top level. Move both `if` checks inside `try`, before the `console.log`.

```js
start() {
  try {
    if (!(this.party1 instanceof Party) || !(this.party2 instanceof Party))
      throw new BattleError("Invalid party — must be a Party instance");
    if (this.party1.size() === 0 || this.party2.size() === 0)
      throw new BattleError("Each party must have at least 1 member");

    console.log(`⚔️ Battle Start: ...`);
    // ... rest of battle
  } catch (error) { ... }
  finally { ... }
}
```

---

## 🏁 Final Verdict

```
╔══════════════════════════════════════════════════════════╗
║       FINAL REVISION RESULT: JavaScript OOP             ║
╠══════════════════════════════════════════════════════════╣
║  Attempt 1:    70 / 100  (C+)                           ║
║  Attempt 2:    92 / 100  (A-)                           ║
║  Attempt 3:    96 / 100  (A)                            ║
║  Decision:  ✅  PASS — CLEARED FOR NEXT MODULE          ║
╚══════════════════════════════════════════════════════════╝
```

---

### 📋 Decision Explanation

**96 is a strong A.** The trajectory across three submissions — 70 → 92 → 96 — shows consistent, deliberate improvement. You are not guessing at fixes; you understand what you're changing and why.

The remaining validation bug in `Battle.start()` is now just **3 small corrections** away from being perfect:
1. Change `instanceof this.party1` → `instanceof Party`
2. Change `.length` → `.size()` and `.size` → `.size()`
3. Change `&&` → `||` on the empty-party check
4. Move both `if` blocks inside `try`

None of these require conceptual understanding you don't already have — they're precision errors, not knowledge gaps.

---

### 🚀 You Are Cleared For:

> ### Next Module: JavaScript Standard Library

**One thing to carry into every module from here:**

When you read `instanceof`, always ask: *"Is the right-hand side a class or constructor?"* Not an instance, not a string, not `undefined` — a callable constructor. That reflex will save you from a whole class of TypeErrors as your code gets more complex.

---

> **From your lecturer:**
>
> 70 → 92 → 96 across three attempts. That's not just passing a module — that's what learning actually looks like. You identified real bugs, fixed them precisely, and iterated. The one bug that survived all three rounds? Now you know exactly why it broke, in three different ways, which means you won't write that mistake again.
>
> Go build something with the Standard Library. You're ready. 🚀

---

*Module: JavaScript Object Oriented Programming | By Eko Kurniawan Khannedy*
*Final status: PASS ✅ — Cleared for JavaScript Standard Library*