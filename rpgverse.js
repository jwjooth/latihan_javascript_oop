// task 1.1
function Item(name, type, rarity) {
  this.name = name;
  this.type = type;
  this.rarity = rarity;
  this.isEquipped = false;
}

// task 1.2
Item.prototype.describe = function () {
  console.log(`[${this.rarity}] ${this.name} (${this.type})`);
};

// task 1.3
function Weapon(name, rarity, attackBonus, element) {
  Item.call(this, name, "equipment", rarity);
  this.attackBonus = attackBonus;
  this.element = element;
}

Weapon.prototype = Object.create(Item.prototype);
Weapon.prototype.constructor = Weapon;

// task 3.1
class InvalidCharacterError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidCharacterError";
  }
}

// task 3.2
class BattleError extends Error {
  constructor(message) {
    super(message);
    this.name = "BattleError";
  }
}

// task 2.1
class Character {
  faction = "Neutral";
  #secretPower;
  #health = 0;
  static count = 0;
  constructor(name, maxHealth, attackPower, secretPower) {
    if (
      typeof name === "string" &&
      name !== "" &&
      maxHealth > 0 &&
      attackPower >= 0
    ) {
      this.name = name;
      this.attackPower = attackPower;
      this.maxHealth = maxHealth;
      this.#health = maxHealth;
      this.#secretPower = secretPower;

      Character.count++;
    } else {
      throw new InvalidCharacterError("Invalid character parameters");
    }
  }
  get health() {
    return this.#health;
  }
  set health(value) {
    if (typeof value !== "number") {
      throw new TypeError("Health must be a number");
    }
    if (value < 0) value = 0;
    if (value > this.maxHealth) value = this.maxHealth;
    this.#health = value;
  }
  #calculateSecretBonus() {
    return this.#secretPower * 1.5;
  }
  attack(target) {
    const secretBonus = this.#calculateSecretBonus();
    const totalDamage = this.attackPower + secretBonus;
    console.log(
      `${this.name} attacks ${target} for ${this.attackPower} damage!`,
    );
    target.health -= totalDamage;
  }
  isAlive() {
    return this.health > 0 ? true : false;
  }
  status() {
    console.log(
      `${this.name} | HP: ${this.#health}/${this.maxHealth} | ATK: ${this.attackPower} | Faction: ${this.faction}`,
    );
  }
}

// task 2.2
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
    console.log(
      `${this.name} raises their shield! Defense: ${this.shieldDefense}`,
    );
  }
}

// task 2.3
class Mage extends Character {
  constructor(name, maxHealth, attackPower, secretPower, manaPoints) {
    super(name, maxHealth, attackPower, secretPower);
    this.manaPoints = manaPoints;
    this.faction = "Arcane Order";
  }
  attack(target) {
    super.attack(target);
    console.log(
      `${this.name} channels arcane energy! Remaining mana: ${this.manaPoints - 10}`,
    );
    this.manaPoints -= 10;
  }
  castSpell(target) {
    if (this.manaPoints < 20)
      throw new BattleError(`${this.name} doesnt have enough mana!`);
    const damage = (this.attackPower *= 2);
    this.manaPoints -= 20;
    console.log(
      `${this.name} casts Arcane Blast on ${target} for ${damage} damage!`,
    );
    target.health -= damage;
  }
}

// task 2.4
class Archer extends Character {
  constructor(name, maxHealth, attackPower, secretPower, arrowCount) {
    super(name, maxHealth, attackPower, secretPower);
    this.arrowCount = arrowCount;
    this.faction = "Ranger Scouts";
  }
  attack(target) {
    if (this.arrowCount <= 0)
      throw new BattleError(`${this.name} has no arrows left!`);
    super.attack(target);
    this.arrowCount -= 1;
    console.log(
      `${this.name} fires an arrow! ${this.arrowCount} arrows remaining`,
    );
  }
}

// task 4.1
class BattleUtils {
  static version = "1.0.0";
  static totalBattles = 0;
  static calculateDamage(attacker, defender) {
    BattleUtils.totalBattles++;
    return Math.max(0, attacker.attackPower - Math.floor(Math.random() * 10));
  }
  static printStats() {
    console.log(`
      === RPGverse ${this.version} ===
      Total Characters Created:
      ${Character.count}
      Total Battles Fought:
      ${BattleUtils.totalBattles}
      `);
  }
  static isValidCharacter(obj) {
    return obj instanceof Character ? true : false;
  }
}

// task 6.1
class Party {
  constructor(name = "Adventurers") {
    this.name = name;
    this.members = [];
  }
  addMember(character) {
    if (character instanceof Character) {
      this.members.push(character);
    } else {
      throw new InvalidCharacterError("Invalid character");
    }
  }
  removeMember(name) {
    this.members = this.members.filter((value) => value.name !== name);
  }
  size() {
    return this.members.length;
  }
  [Symbol.iterator]() {
    let index = 0;
    const members = this.members;
    return {
      next() {
        if (index < members.length) {
          return {
            value: members[index++],
            done: false,
          };
        }
        return {
          value: undefined,
          done: true,
        };
      },
    };
  }
}

// task 7.1
class Battle {
  constructor(party1, party2) {
    this.party1 = party1;
    this.party2 = party2;
  }

  start() {
    if (
      (!this.party1) instanceof Party &&
      (!this.party2) instanceof this.party1
    )
      throw new BattleError();
    if (this.party1.length === 0 && this.party2.length === 0)
      throw new BattleError();
    try {
      console.log(
        `⚔️ Battle Start: ${this.party1.name} vs ${this.party2.name}!`,
      );
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
      } else if (error instanceof InvalidCharacterError) {
        console.error(`Invalid Character Error: ${error.message}`);
      } else {
        console.error(`Unknown Error: ${error.message}`);
      }
    } finally {
      console.log(`⚔️ Battle concluded. Updating stats...`);
      BattleUtils.printStats();
    }
  }
}

// DEMO SCENARIO

console.log("=================================");
console.log("🎮 RPGverse Demo Start");
console.log("=================================");

/* ===============================
   1. CREATE ITEMS & WEAPONS
================================= */

console.log("\n--- Item & Weapon Test ---");

const potion = new Item("Health Potion", "consumable", "common");
const sword = new Weapon("Flame Sword", "rare", 25, "fire");

potion.describe();
sword.describe();
console.log(`Attack bonus: ${sword.attackBonus}`);
console.log(`Element: ${sword.element}`);

console.log("Weapon instanceof Weapon:", sword instanceof Weapon);
console.log("Weapon instanceof Item:", sword instanceof Item);

/* ===============================
   2. CREATE CHARACTERS
================================= */

console.log("\n--- Character Creation ---");

const warrior = new Warrior("Thorin", 120, 25, 10, 15);
const mage = new Mage("Gandalf", 80, 30, 15, 100);
const archer = new Archer("Legolas", 90, 22, 12, 10);

console.log("Total characters created:", Character.count);

/* ===============================
   3. GETTER / SETTER TEST
================================= */

console.log("\n--- Health Setter Validation ---");

console.log("Initial HP:", warrior.health);

warrior.health = 200;
console.log("After setting to 200 (clamped):", warrior.health);

warrior.health = -50;
console.log("After setting to -50 (clamped):", warrior.health);

try {
  warrior.health = "invalid";
} catch (e) {
  console.log("Caught error:", e.message);
}

/* ===============================
   4. INVALID CHARACTER ERROR
================================= */

console.log("\n--- Invalid Character Test ---");

try {
  const badChar = new Character("", -100, -5, 0);
} catch (e) {
  console.log("Caught InvalidCharacterError:", e.message);
}

/* ===============================
   5. INSTANCEOF CHECKS
================================= */

console.log("\n--- instanceof Tests ---");

console.log(warrior instanceof Warrior);
console.log(warrior instanceof Character);
console.log(warrior instanceof Mage);

console.log(mage instanceof Mage);
console.log(mage instanceof Character);

console.log(archer instanceof Archer);
console.log(archer instanceof Character);

/* ===============================
   6. PARTY SYSTEM
================================= */

console.log("\n--- Party System ---");

const heroes = new Party("Fellowship");

heroes.addMember(warrior);
heroes.addMember(mage);
heroes.addMember(archer);

console.log("Party size:", heroes.size());

try {
  heroes.addMember({});
} catch (e) {
  console.log("Caught InvalidCharacterError:", e.message);
}

/* ===============================
   7. ITERABLE PARTY TEST
================================= */

console.log("\n--- Party Iteration ---");

for (const member of heroes) {
  member.status();
}

/* ===============================
   8. STATIC UTILITY TEST
================================= */

console.log("\n--- BattleUtils Validation ---");

console.log("Warrior valid:", BattleUtils.isValidCharacter(warrior));
console.log("Mage valid:", BattleUtils.isValidCharacter(mage));
console.log("Random object valid:", BattleUtils.isValidCharacter({}));

/* ===============================
   9. CREATE ENEMY PARTY
================================= */

console.log("\n--- Enemy Party Creation ---");

const enemy1 = new Warrior("Orc Warrior", 100, 20, 8, 10);
const enemy2 = new Archer("Goblin Archer", 70, 18, 5, 5);

const enemies = new Party("Orc Horde");

enemies.addMember(enemy1);
enemies.addMember(enemy2);

/* ===============================
   10. START BATTLE
================================= */

console.log("\n--- Battle Simulation ---");

const battle = new Battle(heroes, enemies);

battle.start();

/* ===============================
   11. BATTLE ERROR TEST
================================= */

console.log("\n--- Empty Party Battle Test ---");

const emptyParty = new Party("Lonely Squad");

const brokenBattle = new Battle(heroes, emptyParty);

brokenBattle.start();

/* ===============================
   12. FINAL STATS
================================= */

console.log("\n--- Final Stats ---");

BattleUtils.printStats();

console.log("\n=================================");
console.log("🏁 RPGverse Demo Finished");
console.log("=================================");
