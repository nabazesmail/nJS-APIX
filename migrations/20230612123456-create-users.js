
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      full_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      profile_image: {
        type: Sequelize.STRING,
      },
      role: {
        type: Sequelize.ENUM('admin', 'user'),
        defaultValue: 'user',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    const users = await queryInterface.sequelize.query('SELECT id, password FROM Users');
    if (users[0].length > 0) {
      const updatedUsers = users[0].map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return queryInterface.sequelize.query(`UPDATE Users SET password = '${hashedPassword}' WHERE id = ${user.id}`);
      });
      await Promise.all(updatedUsers);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  },
};
