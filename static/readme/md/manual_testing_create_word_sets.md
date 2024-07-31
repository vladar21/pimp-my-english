# Manual Testing: Create Word Sets

## Test Cases

### Test Case 1: Create a New Word Set
- **Description:** Test creating a new word set with valid data.
- **Steps:**
  1. Navigate to the 'Quiz Maker' page.
  2. Enter a valid word set name (`Another six words`) and description (`another six words`).
  3. Add words to the set (e.g., `humanity` `charisma` `blunt` `cynical` `smooth` `survey`).
  4. Submit the form.
  5. Check if the word set is created and displayed in the user's word sets.
- **Expected Result:** Word set should be created successfully.
- **Actual Result:** Word set created successfully and displayed in the user's word sets.
- **Status:** Pass

### Test Case 2: Create Word Set with Missing Data
- **Description:** Attempt to create a word set with missing required fields.
- **Steps:**
  1. Navigate to the 'Quiz Maker' page.
  2. Leave required fields blank (e.g., do not enter a word set name).
  3. Submit the form.
  4. Check for validation error messages.
- **Expected Result:** Appropriate error messages should be displayed.
- **Actual Result:** Validation error messages displayed as expected.
- **Status:** Pass

## Summary
- Total Test Cases: 2
- Passed: 2
- Failed: 0
- Issues: None


[Back to Main README](/Readme.md#manual-testing)
