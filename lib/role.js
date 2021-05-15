const inquirer = require('inquirer');
const department = require('./department');
const dbutil = require('./dbutil');
const FETCH_ALL_ROLES_SQL = 'select r.id as id, r.title as title, r.salary as salary, r.department_id as department_id, d.name as department_name from role r, department d where r.department_id = d.id';
const CREATE_ROLE_SQL = 'insert into role (title, salary, department_id) values(?, ?, ?)';
const UPDATE_ROLE_SQL = 'update role set title = ?, salary = ?, department_id = ? where id = ?';
const DELETE_ROLE_SQL = 'delete FROM role where id = ?';



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

const doListRoles = (callBack, originalCallBack) => {
    const connection = dbutil.connect();
    const result = [];
    connection.query(FETCH_ALL_ROLES_SQL, (err, res) => {            
        if (err) {
            throw err;
        } else {
            if (res && res.length > 0) {
                res.forEach(({ id, title, salary, department_id, department_name }) => {
                    result.push({"id": id, "title": title, "salary": salary, "departmentId": department_id, "departmentName": department_name});
                });
                connection.end();
                callBack(result, originalCallBack);
            } else {
                connection.end();
                callBack(result, originalCallBack);
            }
            
        }
    });
    return result;
  };

  const doCreateRole = (title, salary, departmentId, callBack) => {
    const connection = dbutil.connect();
    connection.query(CREATE_ROLE_SQL, [title, salary, departmentId], (err, results, fields) => {
      if (err) {
        return console.error(err.message);
      }   
      console.log('Role Created with id Id:' + results.insertId);
    });  
    connection.end();
    callBack();
  };
  
const doUpdateRole = (title, salary, department, id) => {
      const connection = dbutil.connect();
      connection.query(UPDATE_ROLE_SQL, [title, salary, department, id], (err, results, fields) => {
        if (err) {
          return console.error(err.message);
        }   
        console.log('Role Updated Successfully');
      });  
      connection.end();
};

const doDeleteRole = (id, callBack) => {
    const connection = dbutil.connect();
    connection.query(DELETE_ROLE_SQL, [id], (err, results, fields) => {
      if (err) {
        return console.error(err.message);
      }   
      console.log('Role Deleted Successfully');
    });  
    connection.end();
    callBack();
};

const role = {
    promptForDetails: (callBack) => {
        initiateCaptureDetails(callBack);
    },
    listAllRoles: (callBack, originalCallBack) => {
        doListRoles(callBack, originalCallBack);        
    },
    createRole: (ans, callBack) => {
        doCreateRole(ans.title, ans.salary, ans.department, callBack);
    },
    updateRole: (ans, id) => {
        doUpdateDepartment(ans.title, ans.salary, ans.department, id)
    },
    deleteRole: (id, callBack) => {
        doDeleteRole(id, callBack);
    },
    selectRole: (list, callBack) => {        
        return inquirer.prompt([
             {
              type: 'list', choices: makeChoices(list),
              name: 'role', 
              message: 'Select a role'
            }
        ]).then((answer) => callBack(answer));
    },
}

function makeChoices(list) {
    ch = [];
    list.forEach((role) => ch.push({"name": role.title, "value": role}));
    return ch;
}

module.exports = role;