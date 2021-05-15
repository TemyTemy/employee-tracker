const inquirer = require('inquirer');
const department = require('./department');
const dbutil = require('./dbutil');
const FETCH_ALL_ROLES_SQL = 'select r.id as id, r.title as title, r.salary as salary, r.department_id as department_id, d.name as department_name from role r, department d where r.department_id = d.id';



const rolesDetailsQuestions = (depts) => [
    {
        type: 'input',
        message: 'What is the role title',
        name: 'title'
    },
    {
        type: 'input',
        message: 'What is the salary',
        name: 'salary'
    },
    {
        type: 'list',
        message: 'What department is the role in',
        name: 'department',
        choices: depts
    }
];

function initiateCaptureDetails(callBack) {
    department.listAllDepartments(doCaptureDetails, callBack);
}

function doCaptureDetails(list, callBack) {
  choices = [];
  list.forEach((dept) => choices.push({"value": dept.id, "name": dept.name}));
  inquirer.prompt(rolesDetailsQuestions(choices)).then((ans) => callBack(ans));
}

function doListRoles(callBack) {
    choices = [];
    list.forEach((dept) => choices.push({"value": dept.id, "name": dept.name}));
    inquirer.prompt(rolesDetailsQuestions(choices)).then((ans) => callBack(ans));
  }

const role = {
    promptForDetails: (callBack) => {
        initiateCaptureDetails(callBack);
    }
}

module.exports = role;