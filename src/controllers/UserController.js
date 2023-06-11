const UserService = require('../services/UserService');
const userService = new UserService();
const {getUserInfoFromToken} = require('../middleware/authenticate');
const path = require('path');

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
      id: user.id,
      role: user.role,
      fullName: user.full_name,
      email: user.email,
      profileImage: user.profile_image
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

  async getProfilePicture(req, res) {
    try {
      const userId = req.params.userId;
      const profilePicture = await userService.getProfilePicture(userId);

      if (!profilePicture) {
        return res.status(404).json({ message: 'Profile picture not found' });
      }

      const absolutePath = path.join(__dirname, '..', 'public', profilePicture);
      res.sendFile(absolutePath);
    } catch (error) {
      console.error('Error getting profile picture:', error);
      res.status(500).json({ error: 'Failed to get profile picture' });
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

  async getProfile(req, res) {
    const userInfo = getUserInfoFromToken(req.headers.authorization.split(' ')[1]);
    res.json(userInfo);
  }
}



module.exports = UserController;