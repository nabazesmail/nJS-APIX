const {
  User
} = require('../models');

class UserRepository {

  async createUser(data) {
    return await User.create(data);
  }

  async getUserById(id) {
    try {
      return await User.findByPk(id);
    } catch (error) {
      console.error('Failed to get user by ID:', error);
      throw new Error('Failed to get user by ID');
    }
  }

  async getUsers() {
    return await User.findAll();
  }

  async updateUser(id, data) {
    await User.update(data, {
      where: {
        id
      }
    });
    return await User.findByPk(id);
  }

  async deleteUser(id) {
    await User.destroy({
      where: {
        id
      }
    });
  }

  async getUserByEmail(email) {
    return await User.findOne({
      where: {
        email
      }
    });
  }

  async updateUserProfilePicture(id, profileImage) {
    await User.update({
      profile_image: profileImage
    }, {
      where: {
        id
      }
    });
  }

}

module.exports = UserRepository;