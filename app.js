const employee = require("./lib/employee");
const department = require("./lib/department");
const inquirer = require('inquirer');

const addNewEmployee = (ans) => {
    console.log(ans);
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



//employee.promptForDetails(addNewEmployee);
//department.promptForDetails(addNewDepartment);
department.listAllDepartments(displayDepartmentsToSelect);

