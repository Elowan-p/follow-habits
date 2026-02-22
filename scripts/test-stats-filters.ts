
import axios from 'axios';
import { HabitCategory } from '../src/context/habits/enums/habit-category.enum';

const BASE_URL = 'http://localhost:4000';

async function testStatsFilters() {
  console.log('--- Testing Stats Filters ---');

  // 1. Register a new user
  const email = `test-stats-${Date.now()}@example.com`;
  const password = 'password123';
  const username = `stats-user-${Date.now()}`;

  console.log(`[Step 1] Registering user: ${email}`);
  let token;
  try {
    await axios.post(`${BASE_URL}/auth/register`, {
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

  // 3. Create Habits with different categories
  console.log(`[Step 3] Creating habits...`);
  try {
    // HEALTH Habit
    await axios.post(`${BASE_URL}/habits`, {
      name: 'Run 5km',
      description: 'Morning run',
      category: HabitCategory.HEALTH
    }, authHeader);
    console.log('Created HEALTH habit.');

    // WORK Habit
    await axios.post(`${BASE_URL}/habits`, {
      name: 'Code Review',
      description: 'Review PRs',
      category: HabitCategory.WORK
    }, authHeader);
    console.log('Created WORK habit.');
    
    // Create another HEALTH habit (to verify count > 1 if needed, but 1 is fine)
     await axios.post(`${BASE_URL}/habits`, {
      name: 'Drink Water',
      description: 'Stay hydrated',
      category: HabitCategory.HEALTH
    }, authHeader);
    console.log('Created another HEALTH habit.');

  } catch (error) {
    console.error('Create habit failed:', error.response?.data || error.message);
    process.exit(1);
  }

  // 4. Verify Stats - ALL
  console.log(`[Step 4] Verifying Global Stats (No Filter)...`);
  try {
    const response = await axios.get(`${BASE_URL}/stats`, authHeader);
    const stats = response.data;
    console.log('Global Stats:', stats);
    // We expect at least 3 habits (plus any from previous tests if DB wasn't cleared, but typically we check relative or just existence)
    // Actually, findAll returns ALL habits in DB, not just user's habits (based on current implementation of HabitsRepository.findAll).
    // So we just check if totalHabits >= 3.
    if (stats.totalHabits >= 3) {
         console.log('[PASS] Global stats return habits.');
    } else {
         console.error('[FAIL] Global stats count mismatch.');
    }
  } catch (error) {
    console.error('Get global stats failed:', error.message);
  }

  // 5. Verify Stats - HEALTH Filter
  console.log(`[Step 5] Verifying Stats with Filter (category=HEALTH)...`);
  try {
    const response = await axios.get(`${BASE_URL}/stats`, { 
        ...authHeader,
        params: { category: HabitCategory.HEALTH }
    });
    const stats = response.data;
    console.log('Health Stats:', stats);
    
    // We check if category in response is HEALTH (as per our service logic)
    // And ideally count should include our 2 health habits.
    if (stats.category === 'HEALTH' && stats.totalHabits >= 2) {
        console.log('[PASS] Filtered stats correctly returned HEALTH category.');
    } else {
        console.error('[FAIL] Filtered stats mismatch.');
    }

  } catch (error) {
    console.error('Get health stats failed:', error.message);
  }
  
    // 6. Verify Stats - WORK Filter
  console.log(`[Step 6] Verifying Stats with Filter (category=WORK)...`);
  try {
    const response = await axios.get(`${BASE_URL}/stats`, { 
        ...authHeader,
        params: { category: HabitCategory.WORK }
    });
    const stats = response.data;
    console.log('Work Stats:', stats);
    
    if (stats.category === 'WORK' && stats.totalHabits >= 1) {
        console.log('[PASS] Filtered stats correctly returned WORK category.');
    } else {
        console.error('[FAIL] Filtered stats mismatch.');
    }

  } catch (error) {
    console.error('Get work stats failed:', error.message);
  }

  console.log('--- Test Complete ---');
}

testStatsFilters();
