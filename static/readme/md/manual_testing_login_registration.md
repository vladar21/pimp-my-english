# Manual Testing: Login and Registration

## Test Cases

### Test Case 1: User Registration
- **Description:** Test the registration process with valid and invalid data.
- **Steps:**
  1. Navigate to the registration page.
  2. Enter valid user details (username: `testuser`, email: `test@example.com`, password: `password123`).
  3. Submit the form.
  4. Check for a confirmation message and email.
- **Expected Result:** User should be registered successfully, and a confirmation email should be sent.
- **Actual Result:** User registered successfully, and confirmation email received.
- **Status:** Pass

### Test Case 2: User Login
- **Description:** Test the login process with valid credentials.
- **Steps:**
  1. Navigate to the login page.
  2. Enter valid user credentials (username: `testuser`, password: `password123`).
  3. Submit the form.
  4. Check if the user is redirected to the dashboard.
- **Expected Result:** User should be logged in successfully and redirected to the dashboard.
- **Actual Result:** User logged in successfully and redirected to the dashboard.
- **Status:** Pass

### Test Case 3: Login with Invalid Credentials
- **Description:** Attempt to login with invalid credentials.
- **Steps:**
  1. Navigate to the login page.
  2. Enter invalid user credentials (username: `wronguser`, password: `wrongpassword`).
  3. Submit the form.
  4. Check for error messages.
- **Expected Result:** Error message should be displayed.
- **Actual Result:** Error message displayed as expected.
- **Status:** Pass

## Summary
- Total Test Cases: 3
- Passed: 3
- Failed: 0
- Issues: None


[Back to Main README](/Readme.md#manual-testing)