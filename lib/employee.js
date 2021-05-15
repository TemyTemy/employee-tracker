const inquirer = require('inquirer');
const mysql = require('mysql');

const dbutil = require('./dbutil');
const FETCH_ALL_EMPLOYEE_BASIC_SQL = 'select id, first_name, last_name from employee';
const FETCH_ALL_EMPLOYEE_EXTENDED_SQL = `select e.id employee_id,
                                         e.first_name first_name,
                                         e.last_name last_name,
                                         r.id role_id, r.title title,
                                         em.id manager_id,
                                         em.first_name manager_first_name,                                    
                                         em.last_name manager_last_name, d.id department_id,
                                         d.name department_name,
                                         r.salary salary from employee e 
                                         join role r on r.id = e.role_id
                                         join department d on d.id = r.department_id
                                         left outer join employee em on em.id = e.manager_id
                                         order by e.id`;

const FETCH_ALL_ROLES_SQL = 'select id, title from role';
const CREATE_EMPLOYEE_SQL = 'insert into employee (first_name, last_name, role_id, manager_id) values(?, ?, ?, ?)';
const UPDATE_EMPLOYEE_SQL = 'update employee set first_name = ?, last_name = ?, role_id = ?, manager_id = ? WHERE id = ?';
let MANAGER_LIST = [];
let ROLES_LIST = [];
var connection;

const employeeDetailsQuestions = (defaultValues) => [
    {
        type: 'input',
        message: 'What is the employee\'s first name',
        name: 'firstName',
        validate: nameValid,
        default: defaultValues ? defaultValues.first_name : undefined
    },
    {
        type: 'input',
        message: 'What is the employee\'s last name',
        name: 'lastName',
        default: defaultValues ? defaultValues.last_name : undefined
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

function nameValid(value) {
      if (value && value.trim().length > 0) {
          return true;
      }
      return 'Name value sould not be empty';
}

const captureEmployeeDetails = (cb, defaultValues) => {
    connection.end();
    inquirer.prompt(employeeDetailsQuestions(defaultValues)).then((ans) =>  {        
        cb(ans, defaultValues);
    });
};

const doCreateEmployee = (firstName, lastName, roleId, managerId, callBack) => {
    const connection = dbutil.connect();
    connection.query(CREATE_EMPLOYEE_SQL, [firstName, lastName, roleId, managerId], (err, results, fields) => {
      if (err) {
        return console.error(err.message);
      }   
      console.log('Employee Created with id Id:' + results.insertId);
    });      
    connection.end();
    callBack();
};

const doUpdateEmployee = (firstName, lastName, roleId, managerId, id, callBack) => {
    const connection = dbutil.connect();
    connection.query(UPDATE_EMPLOYEE_SQL, [firstName, lastName, roleId, managerId, id], (err, results, fields) => {
      if (err) {
        return console.error(err.message);
      }   
      console.log('Employee Updated successfully');
    });      
    connection.end();
    callBack();
};

const getRoles = (cb, defaultValues) => {
    connection.query(FETCH_ALL_ROLES_SQL, (err, res) => {
        if (err) {
            throw err;
        } else {
            if (res && res.length > 0) {
                res.forEach(({ id, title }) => {
                    ROLES_LIST.push({name: `${title}`, value: id});                    
                });
               captureEmployeeDetails(cb, defaultValues); 
            } else {
                ROLES_LIST.push({value: null, name: 'No roles defined'});
                captureEmployeeDetails(cb, defaultValues);
            }                                
        }                
    });           
}

const initiateEmployeeDetailsCapture = (cb, defaultValues) => {  
        connection = doConnect();         
        connection.query(FETCH_ALL_EMPLOYEE_BASIC_SQL, (err, res) => {            
            if (err) {
                throw err;
            } else {
                if (res && res.length > 0) {
                    res.forEach(({ id, first_name, last_name }) => {
                        MANAGER_LIST.push({name: `${first_name} ${last_name}`, value: id});
                    });
                   getRoles(cb, defaultValues);
                } else {
                    MANAGER_LIST.push({name: 'No managers defined', value: null});
                   getRoles(cb, defaultValues);
                }                                
            }
        });
}

const doListEmployee = (cb) => {  
    connection = doConnect();         
    connection.query(FETCH_ALL_EMPLOYEE_EXTENDED_SQL, (err, res) => {
        result = [];
        res.forEach(({employee_id, manager_id, first_name, last_name, title, manager_first_name, manager_last_name, department_name, salary }) => {
            result.push({
                        "id": employee_id,
                        "first_name": first_name,
                        "last_name": last_name,
                        "title": title,
                        "department": department_name,
                        "salary": salary,
                        "manager": manager_id ? `${manager_first_name} ${manager_last_name}` : null
                    });
        });        
       connection.end();
       cb(res);
    });
};

const employee = {
    promptForDetails: (callBack, defaultValues) => {
        initiateEmployeeDetailsCapture(callBack, defaultValues);
    },
    createEmployee: (ans, callBack) => {
        doCreateEmployee(ans.firstName, ans.lastName, ans.role, ans.manager, callBack)
    },
    listEmployees: (callBack) => {
        doListEmployee(callBack);
    },
    selectEmployee: (list, message, callBack) => {        
        return inquirer.prompt([
             {
              type: 'list', choices: makeChoices(list),
              name: 'employee', 
              message: `${message}`
            }
        ]).then((answer) => callBack(answer));
    },
    updateExistingEmployee: (ans, id, callBack) => {
        doUpdateEmployee(ans.firstName, ans.lastName, ans.role, ans.manager, )
    }
}

function makeChoices(list) {
    ch = [];
    list.forEach((emp) => ch.push({"name": `${emp.first_name} ${emp.last_name}`, "value": emp}));
    return ch;
}


module.exports = employee;