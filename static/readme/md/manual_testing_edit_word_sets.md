# Manual Testing: Edit Word Sets

## Test Cases

### Test Case 1: Edit an Existing Word Set
- **Description:** Test editing an existing word set with valid data.
- **Steps:**
  1. Navigate to the user's word sets.
  2. Select a word set to edit (`Another six words`).
  3. Modify the word set name to `Another six words - Updated`, description, and remove words (`charisma`) and add word  (`opt`).
  4. Submit the form.
  5. Check if the changes are saved and reflected in the word set.
- **Expected Result:** Word set should be updated successfully.
- **Actual Result:** Word set updated successfully and changes reflected.
- **Status:** Pass

### Test Case 2: Edit Word Set with Invalid Data
- **Description:** Attempt to edit a word set with invalid data.
- **Steps:**
  1. Navigate to the user's word sets.
  2. Select a word set to edit.
  3. Leave the word set name blank.
  4. Submit the form.
  5. Check for validation error messages.
- **Expected Result:** Appropriate error messages should be displayed.
- **Actual Result:** Validation error messages displayed as expected.
- **Status:** Pass

## Summary
- Total Test Cases: 2
- Passed: 2
- Failed: 0
- Issues: None

[Back to Testing Section](/Readme.md#manual-testing)
