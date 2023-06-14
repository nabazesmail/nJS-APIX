const bcrypt = require('bcrypt');

module.exports = (Sequelize, DataTypes) => {
  const User = Sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Email address must be unique',
      },
      validate: {
        isEmail: {
          msg: 'Email address must be valid',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 15],
          msg: 'Password must have between 8 and 15 characters',
        },
      },
    },
    profile_image: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'user',
    },
  });

  User.beforeCreate(async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  });

  User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
    }
  });

  return User;
};
