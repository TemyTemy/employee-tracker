const employee = require("./lib/employee");
const department = require("./lib/department");

const addNewEmployee = (ans) => {
    console.log(ans);
}

const addNewDepartment = (ans) => {
    console.log(ans);
    department.createDepartment(ans);
}

//employee.promptForDetails(addNewEmployee);
department.promptForDetails(addNewDepartment);

