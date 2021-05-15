const inquirer = require('inquirer');
const dbutil = require('./dbutil');

const FETCH_ALL_DEPARTMENT_SQL = 'select id, name from department';
const CREATE_DEPARTMENT_SQL = 'insert into department (name) values(?)';
const UPDATE_DEPARTMENT_SQL = 'update department set name = ? where id = ?';
const LIST_DEPARTMENT_SQL = 'select id, name from department';

const departmentDetailsQuestions = [
    {
        type: 'input',
        message: 'What is the department name',
        name: 'name'
    }
];

const captureDepartmentDetails = (cb) => {
    return inquirer.prompt(departmentDetailsQuestions).then((ans) =>  {
        cb(ans);
    });
};

const doCreateDepartment = (nameText, callBack) => {
  const connection = dbutil.connect();
  connection.query(CREATE_DEPARTMENT_SQL, [nameText], (err, results, fields) => {
    if (err) {
      return console.error(err.message);
    }   
    console.log('Department Created with id Id:' + results.insertId);
  });  
  connection.end();
  callBack();
};

const doUpdateDepartment = (nameText, id) => {
    const connection = dbutil.connect();
    connection.query(UPDATE_DEPARTMENT_SQL, [nameText, id], (err, results, fields) => {
      if (err) {
        return console.error(err.message);
      }   
      console.log('Department Update Successfully');
    });  
    connection.end();
  };
  

const doListDepartments = (callBack, originalCallBack) => {
    const connection = dbutil.connect();
    const result = [];
    connection.query(LIST_DEPARTMENT_SQL, (err, res) => {            
        if (err) {
            throw err;
        } else {
            if (res && res.length > 0) {
                res.forEach(({ id, name }) => {
                    result.push({"id": id, "name": name});
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

const department = {
    promptForDetails: (callBack) => {
        captureDepartmentDetails(callBack);
    },
    createDepartment: (ans, callBack) => {
        doCreateDepartment(ans.name, callBack);
    },
    listAllDepartments: (callBack, originalCallBack) => {
        doListDepartments(callBack, originalCallBack);        
    },
    updateDepartment: (ans, id) => {
        doUpdateDepartment(ans.name, id)
    },
    createDepartmentChoices: (list, callBack) => {
        ch = [];
        list.forEach((dept) => ch.push({"name": dept.name, "value": dept}));
        callBack(ch);
    },
    selectDepartment: (list, callBack) => {        
        return inquirer.prompt([
             {
              type: 'list', choices: makeChoices(list),
              name: 'department', 
              message: 'Select a department'
            }
        ]).then((answer) => callBack(answer));
    }
}

function makeChoices(list) {
    ch = [];
    list.forEach((dept) => ch.push({"name": dept.name, "value": dept}));
    return ch;
}
module.exports = department;