const bcrypt = require('bcrypt');

/**
 * Hashes the password using bcrypt algorithm
 * @param {string} password - The password to hash
 * @return {string} Password hash
 */
const generatePasswordHash = async (password) => {
  console.log('generatePasswordHash called with password:', password);
  const salt = await bcrypt.genSalt();
  console.log('Generated salt:', salt);
  const hash = await bcrypt.hash(password, salt);
  console.log('Generated hash:', hash);
  return hash;
};

/**
 * Validates the password against the hash
 * @param {string} password - The password to verify
 * @param {string} hash - Password hash to verify against
 * @return {boolean} True if the password matches the hash, false otherwise
 */
const validatePassword = async (password, hash) => {
  console.log('validatePassword called with:');
  console.log('  password:', password);
  console.log('  hash:', hash);
  
  try {
    const result = await bcrypt.compare(password, hash);
    console.log('bcrypt.compare result:', result);
    return result;
  } catch (error) {
    console.error('Error in validatePassword:', error);
    return false;
  }
};

/**
 * Checks that the hash has a valid format
 * @param {string} hash - Hash to check format for
 * @return {boolean} True if passed string seems like valid hash, false otherwise
 */
const isPasswordHash = (hash) => {
  if (!hash || hash.length !== 60) return false;
  try {
    bcrypt.getRounds(hash);
    return true;
  } catch {
    return false;
  }
};

module.exports = {
  generatePasswordHash,
  validatePassword,
  isPasswordHash,
}