const inquirer = require('inquirer');
const dbutil = require('./dbutil');

const FETCH_ALL_DEPARTMENT_SQL = 'select id, name from department';
const CREATE_DEPARTMENT_SQL = 'insert into department (name) values(?)';
const UPDATE_DEPARTMENT_SQL = 'update department set name = ? where id = ?';
const LIST_DEPARTMENT_SQL = 'select id, name from department';

const rolesDetailsQuestions = [
    {
        type: 'input',
        message: 'What is the department name',
        name: 'name'
    }
];

const captureDepartmentDetails = (cb) => {
    return inquirer.prompt(rolesDetailsQuestions).then((ans) =>  {
        cb(ans);
    });
};

const doCreateDepartment = (nameText) => {
  const connection = dbutil.connect();
  connection.query(CREATE_DEPARTMENT_SQL, [nameText], (err, results, fields) => {
    if (err) {
      return console.error(err.message);
    }   
    console.log('Department Created with id Id:' + results.insertId);
  });  
  connection.end();
};

const doListDepartments = (callBack) => {
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
                dbutil.close();
                callBack(result);
            }
            dbutil.close();
            callBack(result);
        }
        dbutil.close();
    });
    return result;
  };

const employee = {
    promptForDetails: (callBack) => {
        captureDepartmentDetails(callBack);
    },
    createDepartment: (ans) => {
        doCreateDepartment(ans.name);
    },
    listAllDepartments: (callBack) => {
        doListDepartments(callBack);        
    }
}
module.exports = employee;