import assert from 'assert';

const BASE = 'http://localhost:5001/api';

async function runTests() {
  console.log('--- STARTING ORBIT API VERIFICATION SUITE ---');

  // 1. Health check
  console.log('1. Testing GET /api/health...');
  const healthRes = await fetch(`${BASE}/health`);
  const health = await healthRes.json();
  assert.strictEqual(health.status, 'healthy');
  assert.strictEqual(health.database.connected, true);
  console.log('   ✓ Health check passed. DB status:', health.database.status);

  // 2. Planets list
  console.log('2. Testing GET /api/planets...');
  const planetsRes = await fetch(`${BASE}/planets`);
  const planets = await planetsRes.json();
  assert.strictEqual(planets.success, true);
  assert.strictEqual(planets.count, 8);
  console.log(`   ✓ Retrieved ${planets.count} planets successfully.`);

  // 3. Single planet detail
  console.log('3. Testing GET /api/planets/mars...');
  const marsRes = await fetch(`${BASE}/planets/mars`);
  const mars = await marsRes.json();
  assert.strictEqual(mars.success, true);
  assert.strictEqual(mars.planet.name, 'Mars');
  assert.strictEqual(mars.planet.orderFromSun, 4);
  assert.ok(mars.navigation.previous && mars.navigation.next);
  console.log(`   ✓ Planet detail for Mars verified. Adjacent: ${mars.navigation.previous.name} <- Mars -> ${mars.navigation.next.name}`);

  // 4. Registration
  console.log('4. Testing POST /api/auth/register...');
  const testEmail = `test_explorer_${Date.now()}@orbit.edu`;
  const regRes = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      displayName: 'Commander Nova',
      email: testEmail,
      password: 'password123',
      confirmPassword: 'password123',
    }),
  });
  const regData = await regRes.json();
  assert.strictEqual(regRes.status, 201);
  assert.strictEqual(regData.success, true);
  const token = regData.token;
  assert.ok(token);
  console.log('   ✓ Registered user:', regData.user.displayName, regData.user.email);

  // 5. Auth /me
  console.log('5. Testing GET /api/auth/me...');
  const meRes = await fetch(`${BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const meData = await meRes.json();
  assert.strictEqual(meData.success, true);
  assert.strictEqual(meData.user.email, testEmail);
  console.log('   ✓ Authenticated profile verified:', meData.user.displayName);

  // 6. Save planet to observatory
  console.log('6. Testing POST /api/saved-discoveries...');
  const saveRes = await fetch(`${BASE}/saved-discoveries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ planetSlug: 'jupiter' }),
  });
  const saveData = await saveRes.json();
  assert.strictEqual(saveRes.status, 201);
  assert.strictEqual(saveData.savedDiscovery.planetSlug, 'jupiter');
  console.log('   ✓ Saved planet to Observatory: Jupiter');

  // 7. Get saved discoveries
  console.log('7. Testing GET /api/saved-discoveries...');
  const getSavedRes = await fetch(`${BASE}/saved-discoveries`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const getSavedData = await getSavedRes.json();
  assert.strictEqual(getSavedData.success, true);
  assert.strictEqual(getSavedData.count, 1);
  assert.strictEqual(getSavedData.savedDiscoveries[0].planet.name, 'Jupiter');
  console.log('   ✓ Retrieved saved discoveries. Planet:', getSavedData.savedDiscoveries[0].planet.name);

  // 8. Quiz evaluation and attempt submission
  console.log('8. Testing POST /api/quiz-attempts...');
  // Provide correct answers for questions 1, 2, 3
  const quizAttemptRes = await fetch(`${BASE}/quiz-attempts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      answers: {
        '1': 1, // Venus
        '2': 2, // Jupiter
        '3': 1, // Olympus Mons
        '4': 0, // Wrong answer to test scoring
      },
    }),
  });
  const quizAttemptData = await quizAttemptRes.json();
  assert.strictEqual(quizAttemptRes.status, 201);
  assert.strictEqual(quizAttemptData.attempt.score, 3);
  assert.strictEqual(quizAttemptData.attempt.totalQuestions, 10);
  assert.strictEqual(quizAttemptData.attempt.percentage, 30);
  console.log(`   ✓ Server verified quiz score: ${quizAttemptData.attempt.score}/${quizAttemptData.attempt.totalQuestions} (${quizAttemptData.attempt.percentage}%)`);

  // 9. Get quiz history
  console.log('9. Testing GET /api/quiz-attempts...');
  const quizHistoryRes = await fetch(`${BASE}/quiz-attempts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const quizHistory = await quizHistoryRes.json();
  assert.strictEqual(quizHistory.success, true);
  assert.strictEqual(quizHistory.totalAttempts, 1);
  assert.strictEqual(quizHistory.bestScore, 3);
  console.log('   ✓ Quiz history verified. Best score:', quizHistory.bestScore);

  // 10. Delete saved planet
  console.log('10. Testing DELETE /api/saved-discoveries/jupiter...');
  const delRes = await fetch(`${BASE}/saved-discoveries/jupiter`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const delData = await delRes.json();
  assert.strictEqual(delData.success, true);
  console.log('   ✓ Removed saved planet jupiter successfully.');

  // 11. NASA Image Proxy
  console.log('11. Testing GET /api/nasa/search?q=mars...');
  const nasaRes = await fetch(`${BASE}/nasa/search?q=mars`);
  const nasaData = await nasaRes.json();
  assert.strictEqual(nasaData.success, true);
  assert.ok(nasaData.count > 0);
  assert.ok(nasaData.items[0].thumbnailUrl);
  console.log(`   ✓ NASA Image Proxy returned ${nasaData.count} items. Sample title: "${nasaData.items[0].title}"`);

  console.log('\n========================================');
  console.log('ALL 11 BACKEND API VERIFICATION TESTS PASSED!');
  console.log('========================================');
}

runTests().catch((err) => {
  console.error('API Verification Test Failed:', err);
  process.exit(1);
});
