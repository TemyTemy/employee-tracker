const employee = require("./lib/employee");
const department = require("./lib/department");
const role = require("./lib/role");
const inquirer = require('inquirer');
const cTable = require('console.table');

const menuQuestions = [
    {
     type: 'list',
     name: 'choice',
     choices: ['Add Employee', 
               'Update Employee',
               'Remove Employee',
               'View All Employees',
               'View Employees by department',
               'View Employees by manager',
               'Add a New Department',
               'View Departments',
               'Remove Department',
               'Add New Role',
               'Remove Role',
               'View Roles',
               'Exit']
    } 
];

const addNewEmployee = (ans) => {
    employee.createEmployee(ans, presentMenu);
}

const updateExistingEmployee = (ans, defaultValues) => { 
    employee.updateExistingEmployee(ans, defaultValues.employee_id, presentMenu);
}

console.clear();
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

function initiateEmployeeDeletion(ans) {    
    console.log(ans.employee.employee_id);
    employee.doDeleteEmployee(ans.employee.employee_id, presentMenu);
}

function selectEmployeeForUpdate(list) {
    employee.selectEmployee(list, "Select the employee you want to update", initiateEmployeeUpdate);
}

function selectEmployeeForListingByManager(list) {
    employee.selectEmployee(list, "Select the manager from list", initiateListEmployeeByManager);
}

function initiateListEmployeeByManager(ans) {    
    employee.listEmployeesByManager(ans.employee.employee_id, doListEmployee);
}

function selectEmployeeForDeletion(list) {
    employee.selectEmployee(list, "Select the employee you want to delete", initiateEmployeeDeletion);
}

function selectDepartmentForDeletion(list) {
    department.selectDepartment(list, initiateDepartmentDeletion);
}

function initiateDepartmentDeletion(ans) {      
    department.deleteDepartment(ans.department.id, presentMenu);
}

function selectDepartmentForEmployeesListing(list, originalCallBack) {
    department.selectDepartment(list, initiateListEmployeeByDepartment);
}

function initiateListEmployeeByDepartment(ans) {
    employee.listEmployeesByDepartment(ans.department.id, doListEmployee);
}

function doListEmployee(result) {
    console.table(result);
    presentMenu();
}

function doDepartmentListing(result) {
    console.table(result);
    presentMenu();
}

function doRolesListing(result) {
    console.table(result);
    presentMenu();
}

function initiateRoleCreation(ans) {
    role.createRole(ans,  presentMenu);   
}

function initiateRoleDeletion(ans) {
    role.deleteRole(ans.role.id,  presentMenu);   
}

function initiateDepartmentCreation(ans) {
    department.createDepartment(ans,  presentMenu);   
}

function executeChoice(choice) {       
    switch (choice) {
        case 'Add Employee':
            employee.promptForDetails(addNewEmployee, undefined);            
            break;
        case 'Update Employee':
            employee.listEmployees(selectEmployeeForUpdate);
            break;   
        case 'View All Employees':
            employee.listEmployees(doListEmployee);
            break;
        case 'View Employees by department':
            department.listAllDepartments(selectDepartmentForEmployeesListing, undefined);
            break;
        case 'View Employees by manager':
            employee.listEmployees(selectEmployeeForListingByManager);
            break;              
        case 'Remove Employee':
            employee.listEmployees(selectEmployeeForDeletion);
            break;
        case 'Add a New Department':
            department.promptForDetails(initiateDepartmentCreation);
            break;   
        case 'View Departments':
            department.listAllDepartments(doDepartmentListing);
            break;
        case 'Remove Department':
            department.listAllDepartments(selectDepartmentForDeletion);
            break;            
        case 'Add New Role':
            role.promptForDetails(initiateRoleCreation);
            break; 
        case 'Remove Role':
            role.listAllRoles(initiateRoleDeletion);
            break;        
        case 'View Roles':
            role.listAllRoles(doRolesListing);
            break;    
        default:
            console.log('Nothing');    
        case 'Exit':                
            console.log('Bye');
    }        
}
