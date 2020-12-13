// Dependencies
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

// ======================================================================================================
// Path to generated HTML
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

// ======================================================================================================
// Render HTML file
const render = require("./lib/htmlRenderer");

// ======================================================================================================
// Ask the user some questions about a new team member
const output = [];
const userQuestions = [
    {
        type: "input",
        name: "name",
        message: "Enter the team member's first and last name: "
    },
    {
        type: "list",
        name: "role",
        message: "Select the team member's role: ",
        choices: ["Manager", "Engineer", "Intern"]
    },
    {
        type: "input",
        name: "email",
        message: "Enter the team member's email address: "
    },
    {
        type: "input",
        name: "id",
        message: "Enter the team member's ID number: "
    },
    {
        type: "input",
        name: "office",
        message: "Enter the manager's office number: ",
        when: function(response) {
            return response.role === "Manager";
        }
    },
    {
        type: "input",
        name: "github",
        message: "Enter the engineer's GitHub account: ",
        when: function(response) {
            return response.role === "Engineer";
        }
    },
    {
        type: "input",
        name: "school",
        message: "Enter the intern's school name: ",
        when: function(response) {
            return response.role === "Intern";
        }
    },
    {
        type: "confirm",
        name: "addMember",
        message: "Would you like to add another team member?"
    }
];

// ======================================================================================================
// Function to prompt the user to answer the questions about adding new team member info
function userPrompt() {
    inquirer.prompt(userQuestions)
    .then (response => {
        output.push(response)
        if (response.addMember) {
            userPrompt();
        } else {
            const teamMember = output.map(employee => {
                switch(employee.role) {
                    // If "Manager" is selected, return to Manager's set of questions
                    case "Manager":
                        return new Manager(employee.name, employee.id, employee.email, employee.office)
                    // If "Engineer" is selected, return to Engineer's set of questions
                    case "Engineer":
                        return new Engineer(employee.name, employee.id, employee.email, employee.github)
                    // If "Intern" is selected, return to Intern's set of questions
                    case "Intern":
                        return new Intern(employee.name, employee.id, employee.email, employee.school)
                }
            });
            // Write to HTML file
            fs.writeFile(outputPath, render(teamMember), err =>{
                if(err){
                    throw err
                }
                console.log("Your team had been created!")
            });
        }
    })
    .catch(err => {
        if(err){
            console.log("Error: ", err);
        }
    })
}

userPrompt();
