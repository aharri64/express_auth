'use strict';
const bcrypt = require('bcrypt')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  user.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        len[1, 99],
        msg: 'Name must be between 1 and 99 characters'
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: { //? this part is a validation, it has to check this first
          msg: 'Invalide email'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: [8, 99],
        msg: 'Password must be between 8 and 99 characters'
      }
    }
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};

//* Before a user is created, we are encrypting the password and using hash in its place
user.addHook('beforeCreate', (pendingUser) => { //? pedingUser is object that gets passed to DB
  //? bcrypt is going to hash the password
  let hash = bcrypt.hashSync(pendingUser.password, 12); //?what does pass mean? 
  pendingUser.password = hash; //* this will go to the DB
})

//* checking the password on sign-in and comparing to the hashed password in the db
user.prototype.validPassword = function (typedPassword) {
  let isCorrectPassword = bcrypt.compareSync(typedPassword, this.password); //* check to see if password is correct
  return is isCorrectPassword
}

//* return an object from the database pf the iser without the encrypted password
user.prototype.toJSON = function () {
  let userData = this.get(); //
  delete userData.password; //* this does not delete from the database, only removes it
  return userData;
}


return user; //above here