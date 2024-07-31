# Manual Testing: Subscription Management

## Test Cases

### Test Case 1: Subscribe to a Plan
- **Description:** Test subscribing.
- **Steps:**
  1. Navigate to the user profile page.
  2. Click in profile page subscription button.
  3. Select a subscription plan.
  4. Enter payment details using the test card number `4242 4242 4242 4242`.
  5. Submit the subscription (payment) form.
  6. Check if the user profile reflects the active subscription.
- **Expected Result:** Subscription should be processed successfully, and user profile should reflect the active subscription.
- **Actual Result:** Subscription processed successfully, and user profile shows active subscription.
- **Status:** Pass

### Test Case 2: Cancel Subscription
- **Description:** Test cancelling the active subscription.
- **Steps:**
  1. Navigate to the user profile page.
  2. Go to the subscription management section.
  3. Click the cancel subscription button.
  4. Verify that the subscription status is updated to cancelled.
- **Expected Result:** Subscription should be cancelled successfully, and user profile should reflect the cancellation.
- **Actual Result:** Subscription cancelled successfully, and user profile shows the cancelled status.
- **Status:** Pass

## Summary
- Total Test Cases: 2
- Passed: 2
- Failed: 0
- Issues: None

[Back to Manual Testing](../Readme.md#manual-testing)
