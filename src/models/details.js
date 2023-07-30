module.exports = (sequelize, DataTypes) => {
  const Details = sequelize.define('Details', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active', // Set the default value to 'active'
    },
  });

  Details.associate = (models) => {
    Details.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Details;
};
