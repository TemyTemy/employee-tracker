const employee = require("./lib/employee");
const department = require("./lib/department");
const role = require("./lib/role");
const inquirer = require('inquirer');

const menuQuestions = [
    {
     type: 'list',
     name: 'choice',
     choices: ['Add Employee', 'Update Employee',
               'Remove Employee', 'View All Employee',
               'Exit']
    } 
];

const addNewEmployee = (ans) => {
    employee.addNewEmployee(ans);
}

const addNewDepartment = (ans) => {
    department.selectDepartment(ans).then((answers) => console.log(answers));
   // department.createDepartment(ans);
}

const showSelectedDepartment = (selected) => {
    console.log(selected);
}

const displayDepartmentsToSelect = (ans) => {
   department.selectDepartment(ans, showSelectedDepartment);
}

const displayRolesAnswers = (ans) => {
    console.log(ans);
}



//employee.promptForDetails(addNewEmployee);
//department.promptForDetails(addNewDepartment);
//department.listAllDepartments(displayDepartmentsToSelect, undefined);
//role.promptForDetails(displayRolesAnswers);


function presentMenu() {
    inquirer.prompt(menuQuestions)
    .then((answers) => {
        executeChoice(answers.choice);
    });
}



function executeChoice(choice) {
    switch (choice) {
        case 'Add Employee':
            employee.promptForDetails(addNewEmployee);            
            break;
        case 'Exit':                
            console.log('Bye');
        default:
            console.log('Nothing');    
    }        
}
