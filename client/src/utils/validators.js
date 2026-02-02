/**
 * Validate email format
 */
export const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

/**
 * Validate password strength
 */
export const isValidPassword = (password) => {
    return password.length >= 6;
};

/**
 * Validate username
 */
export const isValidUsername = (username) => {
    return username.length >= 3 && username.length <= 30;
};

/**
 * Get validation error message
 */
export const getValidationError = (field, value) => {
    switch (field) {
        case 'email':
            if (!value) return 'Email is required';
            if (!isValidEmail(value)) return 'Invalid email format';
            return null;

        case 'password':
            if (!value) return 'Password is required';
            if (!isValidPassword(value)) return 'Password must be at least 6 characters';
            return null;

        case 'username':
            if (!value) return 'Username is required';
            if (!isValidUsername(value)) return 'Username must be 3-30 characters';
            return null;

        default:
            return null;
    }
};
