const inquirer = require('inquirer');
const mysql = require('mysql');

const dbutil = require('./dbutil');
const FETCH_ALL_EMPLOYEE_SQL = 'select id, first_name, last_name from employee';
const FETCH_ALL_ROLES_SQL = 'select id, title from role';
let MANAGER_LIST = [];
let ROLES_LIST = [];
var connection;

const employeeDetailsQuestions = [
    {
        type: 'input',
        message: 'What is the employee\'s first name',
        name: 'firstName'
    },
    {
        type: 'input',
        message: 'What is the employee\'s last name',
        name: 'lastName'
    },
    {
        type: 'list',
        message: 'What is the employee\'s role',
        name: 'role',
        choices: ROLES_LIST
    },
    {
        type: 'list',
        message: 'Who is the employee\'s manager',
        name: 'manager',
        choices: MANAGER_LIST
    }
];

function doConnect() {
    return dbutil.connect();
}

const captureEmployeeDetails = (cb) => {
    connection.end();
    inquirer.prompt(employeeDetailsQuestions).then((ans) =>  {        
        cb(ans);
    });
};

const getRoles = (cb) => {
    connection.query(FETCH_ALL_ROLES_SQL, (err, res) => {
        if (err) {
            throw err;
        } else {
            if (res && res.length > 0) {
                res.forEach(({ id, title }) => {
                    ROLES_LIST.push({name: `${title}`, value: id});                    
                });
               captureEmployeeDetails(cb); 
            } else {
                ROLES_LIST.push({value: -1, name: 'No roles defined'});
                captureEmployeeDetails(cb);
            }                                
        }                
    });           
}

const initiateEmployeeDetailsCapture = (cb) => {  
        connection = doConnect();         
        connection.query(FETCH_ALL_EMPLOYEE_SQL, (err, res) => {            
            if (err) {
                throw err;
            } else {
                if (res && res.length > 0) {
                    res.forEach(({ id, first_name, last_name }) => {
                        MANAGER_LIST.push({name: `${first_name} ${last_name}`, value: id});
                    });
                   getRoles(cb);
                } else {
                    MANAGER_LIST.push({name: 'No managers defined', value: -1});
                   getRoles(cb);
                }                                
            }
        });
}

const employee = {
    promptForDetails: (callBack) => {
        initiateEmployeeDetailsCapture(callBack);
    }
}


module.exports = employee;