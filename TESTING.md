# Discord Bot Testing Guide

## Setup

The project uses Jest for testing with the following configuration:

- Unit tests for commands and utilities
- Mocked Discord.js components
- 100% code coverage tracking
- Automated test running

### Test File Patterns

Only files matching these patterns are treated as test files:

- `**/__tests__/**/*.test.[jt]s?(x)`
- `**/__tests__/**/*.spec.[jt]s?(x)`
- `**/?(*.)+(spec|test).[jt]s?(x)`

Helper files (like testUtils.js) should not use these patterns to avoid being treated as test files.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

### Test Utilities (`__tests__/utils/testUtils.js`)

- `createMockInteraction()`: Creates mock Discord.js interactions for testing commands
- `createMockClient()`: Creates mock Discord.js client instances

### Command Tests (`__tests__/commands/`)

Each command has its own test file that verifies:

- Command structure (name, description, options)
- Command execution
- Error handling
- Edge cases

## Writing New Tests

1. Create test files in the `__tests__` directory following the naming convention `*.test.js`
2. Use the provided test utilities to mock Discord.js components
3. Structure tests using describe/it blocks for clarity
4. Test both success and error cases
5. Ensure proper cleanup in beforeEach/afterEach blocks if needed

### Example Test Structure

```javascript
const { createMockInteraction } = require('../utils/testUtils');

describe('Command Name', () => {
  describe('Command Structure', () => {
    // Test command properties
  });

  describe('Command Execution', () => {
    let interaction;

    beforeEach(() => {
      interaction = createMockInteraction({
        // Custom options
      });
    });

    it('should handle successful execution', async () => {
      // Test success case
    });

    it('should handle errors', async () => {
      // Test error case
    });
  });
});
```

## Best Practices

1. Mock external dependencies
2. Test edge cases and error conditions
3. Keep tests focused and isolated
4. Use descriptive test names
5. Maintain test coverage above 90%
6. Clean up resources after tests
7. Use appropriate assertions
8. Test asynchronous code properly
9. Keep utility files separate from test files
10. Follow proper naming conventions for test files

## Coverage Reports

Coverage reports are generated in the `coverage` directory after running:

```bash
npm run test:coverage
```

The report includes:

- Statement coverage
- Branch coverage
- Function coverage
- Line coverage
