const { User } = require('../models');

class UserRepository {

  async createUser(data) {
    return await User.create(data);
  }

  async getUserById(id) {
    return await User.findByPk(id);
  }

  async getUsers() {
    return await User.findAll();
  }

  async updateUser(id, data) {
    await User.update(data, { where: { id } });
    return await User.findByPk(id);
  }

  async deleteUser(id) {
    await User.destroy({ where: { id } });
  }

  async getUserByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async updateUserProfilePicture(id, profileImage) {
    await User.update({ profile_image: profileImage }, { where: { id } });
  }

}

module.exports = UserRepository;
