import bcrypt from 'bcrypt';

/**
 * Remove all chars but a-z, A-Z, 0-9, '.', '-', '_'
 * @param username
 * @returns {string}
 */
export const pruneUsername = (username) => {
  return String(username).replace(/[^a-zA-Z0-9\.\-\_]+/i, '');
};

export const specialChars = String('.,-_<>?!@$;:()&%+-*/\\');

export const hasOneSpecialChar = (str) => {
  const pattern = specialChars.split('')// convert to char array
                              .map(c => ('\\'+c))// add escape before each char
                              .concat('|'); // join by pipe so the test will look for one of the sub-patterns
  const re = new RegExp(pattern);
  return re.exec(str) !== null;
};

/**
 * Check password
 * 1. has length over 9
 * 2. has 1 of a-z
 * 3. has 1 of A-Z
 * 4. has 1 of 0-9
 * 5. has 1 of special characters
 * @param password
 * @returns {boolean}
 */
export const isStrongPassword = (password) => {
  let s = String(password);
  return 10 <= s.length
    && s.match(/[a-z]/)
    && s.match(/[A-Z]/)
    && s.match(/[0-9]/)
    && hasOneSpecialChar(s);
};

/**
 * Create hash for plain password
 * @param plainPassword
 * @param saltRounds
 * @returns {Promise<void>}
 */
export const hashPassword = async (plainPassword, saltRounds = 10) => {
  // store hash in your db
  return await bcrypt.hash(plainPassword, saltRounds);
};

/**
 * Verify password
 * @param plainPassword
 * @param password_hash
 * @returns {Promise<Boolean>}
 */
export const verifyPassword = async (plainPassword, password_hash) => {
  // result == true/false
  return await bcrypt.compare(plainPassword, password_hash);
};
