const UserService = require('../services/UserService');
const userService = new UserService();

const {
  generateToken
} = require('../utils/tokenUtils');

class UserController {

  async createUser(req, res) {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  }

  async getUserById(req, res) {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  }

  async getUsers(req, res) {
    const users = await userService.getUsers();
    res.json(users);
  }

  async updateUser(req, res) {
    const updatedUser = await userService.updateUser(req.params.userId, req.body);
    res.json(updatedUser);
  }

  async deleteUser(req, res) {
    await userService.deleteUser(req.params.userId);
    res.sendStatus(204);
  }

  async login(req, res) {
    const user = await userService.login(req.body.email, req.body.password);
    if (!user) {
      res.sendStatus(401);
      return;
    }

    const token = generateToken({
      role: user.role
    });

    res.json({
      token
    });
  }

  async uploadProfilePicture(req, res) {
    try {
      const userId = req.params.userId; // retrieve user ID from route parameter
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          message: 'No file uploaded'
        });
      }

      await userService.uploadProfilePicture(userId, file);

      res.send('Profile Image Uploaded');
    } catch (err) {
      console.error('Error: ' + err);
      res.send('Error: ' + err);
    }
  }


  async removeProfilePicture(req, res) {
    try {
      const userId = req.params.userId;

      // Update the user's profile image to null or an empty string
      await userService.updateUserProfilePicture(userId, null); // Assuming null represents the absence of a profile picture

      res.send('Profile Picture Removed');
    } catch (err) {
      console.error('Error: ' + err);
      res.send('Error: ' + err);
    }
  }

}



module.exports = UserController;