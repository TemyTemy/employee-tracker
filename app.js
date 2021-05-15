const employee = require("./lib/employee");
const department = require("./lib/department");
const role = require("./lib/role");
const inquirer = require('inquirer');
const cTable = require('console.table');

const menuQuestions = [
    {
     type: 'list',
     name: 'choice',
     choices: ['Add Employee', 'Update Employee',
               'Remove Employee', 'View All Employes',
               'Exit']
    } 
];

const addNewEmployee = (ans) => {
    employee.createEmployee(ans, presentMenu);
}

const updateExistingEmployee = (ans, defaultValues) => {
    console.log(ans);
    employee.updateExistingEmployee(ans, defaultValues.employee_id)
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
    role.createRole(ans);
}



//employee.promptForDetails(addNewEmployee);
//department.promptForDetails(addNewDepartment);
//department.listAllDepartments(displayDepartmentsToSelect, undefined);
//role.promptForDetails(displayRolesAnswers);

presentMenu();

function presentMenu() {
    inquirer.prompt(menuQuestions)
    .then((answers) => {
        executeChoice(answers.choice);
    });
}

function initiateEmployeeUpdate(ans) {    
    employee.promptForDetails(updateExistingEmployee, ans.employee)    
}

function selectEmployeeForUpdate(list) {
    employee.selectEmployee(list, "Select the employee you want to update", initiateEmployeeUpdate);
}

function doListAllEmployees(res) {
    console.table(result);
    presentMenu();
}


function executeChoice(choice) {
    switch (choice) {
        case 'Add Employee':
            employee.promptForDetails(addNewEmployee, undefined);            
            break;
        case 'Update Employee':
            employee.listEmployees(selectEmployeeForUpdate);
            break;   
        case 'View All Employes':
            employee.listEmployees(doListAllEmployees);
            break;            
        default:
            console.log('Nothing');    
        case 'Exit':                
            console.log('Bye');
    }        
}
