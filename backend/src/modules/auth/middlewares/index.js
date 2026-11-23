const authenticateUser = require('./authenticateUser');
const authorizeSelfOrAdmin = require('./authorizeSelfOrAdmin');

module.exports = {
  ...authenticateUser,
  authorizeSelfOrAdmin,
};
