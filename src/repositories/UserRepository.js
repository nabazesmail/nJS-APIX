const {
  User,Details
} = require('../models');

class UserRepository {

  async createUser(data) {
    return await User.create(data);
  }

  async getUserById(id) {
    try {
      // Fetch the user from the database
      const user = await User.findByPk(id);
      return user;
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
    try {
      // Delete associated records in the `details` table
      await Details.destroy({
        where: {
          userId: id
        }
      });

      // Delete the user
      await User.destroy({
        where: {
          id
        }
      });
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw new Error('Failed to delete user');
    }
  }

  async getUserByEmail(email) {
    return await User.findOne({
      where: {
        email
      }
    });
  }

  async updateUserProfilePicture(id, profileImage) {
    try {
      console.log('Update Profile Picture ID:', id);
      console.log('Profile Image:', profileImage);

      const updatedRows = await User.update({
        profile_image: profileImage
      }, {
        where: {
          id
        }
      });

      console.log('Updated Rows:', updatedRows);

      if (updatedRows > 0) {
        return true;
      } else {
        throw new Error('Failed to update profile picture');
      }
    } catch (error) {
      console.error('Failed to update profile picture:', error);
      throw new Error('Failed to update profile picture');
    }
  }


}

module.exports = UserRepository;