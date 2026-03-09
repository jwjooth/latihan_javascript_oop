# ⚔️ RPGverse — Mini RPG Battle System

A text-based RPG battle system built in vanilla JavaScript, created as a final exam project for the **JavaScript Object Oriented Programming** module.

---

## 📖 About

RPGverse demonstrates core JavaScript OOP concepts through a playable battle simulation — characters, parties, weapons, and turn-based combat, all running in the console.

---

## 🧠 Concepts Covered

- Constructor Functions & Prototype Inheritance
- ES6 Classes, `extends`, `super`
- Public & Private Class Fields (`#`)
- Static Fields & Methods
- Getters & Setters
- Custom Error Classes
- `try / catch / finally`
- Iterable & Iterator Protocol (`Symbol.iterator`)
- `instanceof` operator

---

## 🗂️ Structure

```
rpgverse.js       ← single file, all logic + demo scenario
```

### Classes

| Class | Description |
|---|---|
| `Item` | Base item (constructor function) |
| `Weapon` | Extends `Item` via prototype inheritance |
| `Character` | Base ES6 class with private fields |
| `Warrior` | Extends `Character` — melee fighter |
| `Mage` | Extends `Character` — spell caster |
| `Archer` | Extends `Character` — ranged attacker |
| `Party` | Iterable container for characters |
| `Battle` | Manages turn-based combat with error handling |
| `BattleUtils` | Static utility class |
| `InvalidCharacterError` | Custom error for bad character data |
| `BattleError` | Custom error for battle violations |

---

## 🚀 Run

```bash
node rpgverse.js
```

No dependencies. Pure JavaScript.

---

## 📋 Demo Output

The demo scenario at the bottom of `rpgverse.js` walks through:

1. Item & Weapon creation
2. Character creation across all three subclasses
3. Health getter/setter validation
4. Custom error handling
5. `instanceof` type checks
6. Party system with iterable `for...of`
7. Static utility validation
8. Live battle simulation
9. Empty party error handling
10. Final battle stats

---

## 📚 Module

**JavaScript Object Oriented Programming**
by Eko Kurniawan Khannedy — [Programmer Zaman Now](https://www.youtube.com/c/ProgrammerZamanNow)
