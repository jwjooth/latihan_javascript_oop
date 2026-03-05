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
