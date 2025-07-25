const { randomUUID } = require('crypto');

const User = require('../models/User.js');
const { generatePasswordHash, validatePassword } = require('../utils/password.js');

class UserService {
  static async list() {
    try {
      return User.find();
    } catch (err) {
      throw new Error(`Database error while listing users: ${err}`);
    }
  }

  static async get(id) {
    try {
      return User.findOne({ _id: id }).exec();
    } catch (err) {
      throw new Error(`Database error while getting the user by their ID: ${err}`);
    }
  }

  static async getByEmail(email) {
    try {
      return User.findOne({ email }).exec();
    } catch (err) {
      throw new Error(`Database error while getting the user by their email: ${err}`);
    }
  }

  static async update(id, data) {
    try {
      return User.findOneAndUpdate({ _id: id }, data, { new: true, upsert: false });
    } catch (err) {
      throw new Error(`Database error while updating user ${id}: ${err}`);
    }
  }

  static async delete(id) {
    try {
      const result = await User.deleteOne({ _id: id }).exec();
      return (result.deletedCount === 1);
    } catch (err) {
      throw new Error(`Database error while deleting user ${id}: ${err}`);
    }
  }

  static async authenticateWithPassword(email, password) {
    if (!email) throw new Error('Email is required');
    if (!password) throw new Error('Password is required');

    try {
      console.log('Looking for user with email:', email);
      const user = await User.findOne({email}).exec();
      console.log('User found:', user ? 'YES' : 'NO');
      
      if (!user) {
        console.log('User not found in database');
        return null;
      }

      console.log('Validating password...');
      console.log('Stored password hash:', user.password);
      console.log('Provided password:', password);
      
      const passwordValid = await validatePassword(password, user.password);
      console.log('Password validation result:', passwordValid);
      
      if (!passwordValid) {
        console.log('Password validation failed');
        return null;
      }

      console.log('Password validated successfully, updating lastLoginAt');
      user.lastLoginAt = Date.now();
      const updatedUser = await user.save();
      console.log('User login timestamp updated');
      return updatedUser;
    } catch (err) {
      console.error(`Database error while authenticating user ${email} with password:`, err);
      throw new Error(`Database error while authenticating user ${email} with password: ${err}`);
    }
  }

  static async create({ email, password, name = '' }) {
    if (!email) throw new Error('Email is required');
    if (!password) throw new Error('Password is required');

    console.log('Creating user with email:', email);
    console.log('Password provided for registration:', password);

    const existingUser = await UserService.getByEmail(email);
    if (existingUser) {
      console.log('User already exists with email:', email);
      throw new Error('User with this email already exists');
    }

    console.log('Generating password hash...');
    const hash = await generatePasswordHash(password);
    console.log('Password hash generated:', hash);

    try {
      const user = new User({
        email,
        password: hash,
        name,
      });

      console.log('Saving user to database...');
      await user.save();
      console.log('User saved successfully');
      return user;
    } catch (err) {
      console.error('Database error while creating new user:', err);
      throw new Error(`Database error while creating new user: ${err}`);
    }
  }

  static async setPassword(user, password) {
    if (!password) throw new Error('Password is required');
    user.password = await generatePasswordHash(password); // eslint-disable-line

    try {
      if (!user.isNew) {
        await user.save();
      }

      return user;
    } catch (err) {
      throw new Error(`Database error while setting user password: ${err}`);
    }
  }
}

module.exports = UserService;