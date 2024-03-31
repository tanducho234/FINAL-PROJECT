// repositories/userRepository.js
const User = require("../models/user");

class UserRepository {
  async createUser(data) {
    return await User.create(data);
  }

  async getUserByUsername(username) {
    return await User.findOne({ username });
  }
async getUserById(id) {
    return await User.findById(id);
  }
  async getUserByEmail(email) {
    return await User.findOne({ email });
  }

  async updateUserEmailVerificationStatus(username, verified = true) {
    try {
      const user = await User.findOneAndUpdate(
        { username },
        { $set: { emailVerified: verified } },
        { new: true }
      );

      if (!user) {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = new UserRepository();