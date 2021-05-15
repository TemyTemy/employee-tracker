const inquirer = require('inquirer');
const FETCH_ALL_ROLES_SQL = 'select r.id as id, r.title as title, r.salary as salary, r.department_id as department_id, d.name as department_name from role r, department d where r.department_id = d.id';


const rolesDetailsQuestions = [
    {
        type: 'input',
        message: 'What is the role title',
        name: 'title'
    },
    {
        type: 'input',
        message: 'What is the salary',
        name: 'lastName'
    },
    {
        type: 'list',
        message: 'What department is the role in',
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





const captureEmployeeDetails = (cb) => {
    return inquirer.prompt(rolesDetailsQuestions).then((ans) =>  {
        cb(ans);
        connection.end();
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
               return captureEmployeeDetails(cb); 
            } else {
                ROLES_LIST.push({value: -1, name: 'No roles defined'});
                return captureEmployeeDetails(cb);
            }                                
        }                
    });           
}

const initiateEmployeeDetailsCapture = (cb) => {           
        connection.query(FETCH_ALL_EMPLOYEE_SQL, (err, res) => {            
            if (err) {
                throw err;
            } else {
                if (res && res.length > 0) {
                    res.forEach(({ id, first_name, last_name }) => {
                        MANAGER_LIST.push({name: `${first_name} ${last_name}`, value: id});
                    });
                   return getRoles(cb);
                } else {
                    MANAGER_LIST.push({name: 'No managers defined', value: -1});
                   return getRoles(cb);
                }                                
            }
        });
}

const employee = {
    promptForDetails: (callBack) => {
        return initiateEmployeeDetailsCapture(callBack);
    }
}


module.exports = employee;