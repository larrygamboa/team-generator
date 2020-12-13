// Define and export the Engineer class
const Employee = require("./Employee")

class Engineer extends Employee {
    constructor(name, id, email) {
        this.name = name;
        this.id = id;
        this.email = email;
    };

    getGithub() {
        return this.github;
    };

    getRole() {
        return `Engineer`;
    };
};

module.exports = Engineer;
