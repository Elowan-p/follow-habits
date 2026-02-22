
import axios from 'axios';

const BASE_URL = 'http://localhost:4000';

async function testRightsDefaults() {
  console.log('--- Testing Rights Defaults & Enforcement ---');

  // 1. Register a new user (Should get updated ROLE_USER without USER_READ)
  const email = `test-rights-${Date.now()}@example.com`;
  const password = 'password123';
  const username = `rights-user-${Date.now()}`;

  console.log(`[Step 1] Registering user: ${email}`);
  let token;
  let userId;
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      email,
      password,
      username,
    });
    console.log('User registered successfully.');
  } catch (error) {
    console.error('Registration failed:', error.message);
    process.exit(1);
  }

  // 2. Login
  console.log(`[Step 2] Logging in...`);
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password,
    });
    token = response.data.access_token;
    console.log('Login successful.');
  } catch (error) {
    console.error('Login failed:', error.message);
    process.exit(1);
  }

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  // 3. Verify Access to Habits (Should be ALLOWED: HABITS_CREATE/READ)
  console.log(`[Step 3] Verifying Habit Access (Allowed)...`);
  try {
    await axios.post(`${BASE_URL}/habits`, {
      name: 'Allowed Habit',
      description: 'I should be able to create this'
    }, authHeader);
    console.log('[PASS] Habit creation allowed.');
    
    await axios.get(`${BASE_URL}/habits`, authHeader);
    console.log('[PASS] Habit reading allowed.');

  } catch (error) {
    console.error('[FAIL] Habit access denied:', error.message);
  }

  // 4. Verify Access to Stats (Should be ALLOWED: STATS_READ)
  console.log(`[Step 4] Verifying Stats Access (Allowed)...`);
  try {
    await axios.get(`${BASE_URL}/stats`, authHeader);
    console.log('[PASS] Stats reading allowed.');
  } catch (error) {
    console.error('[FAIL] Stats access denied:', error.message);
  }

  // 5. Verify Access to Users List (Should be DENIED: No USER_READ)
  // Assuming GET /users requires USER_READ
  console.log(`[Step 5] Verifying Users List Access (Denied)...`);
  try {
    await axios.get(`${BASE_URL}/users`, authHeader);
    console.error('[FAIL] Users list access was ALLOWED (Should be DENIED).');
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log('[PASS] Users list access correctly DENIED (403 Forbidden).');
    } else {
      console.error(`[FAIL] Users list access failed with unexpected error: ${error.message} (${error.response?.status})`);
    }
  }

  console.log('--- Test Complete ---');
}

testRightsDefaults();
