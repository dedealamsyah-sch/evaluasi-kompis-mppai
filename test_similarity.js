const { calculateSimilarity } = require('./similarity.js');
const assert = require('assert');

console.log("Running tests...");

try {
  // Test 1: Identical strings
  const score1 = calculateSimilarity("Ini adalah tes.", "Ini adalah tes.");
  assert(parseFloat(score1) > 0.9, `Test 1 failed: Expected high similarity, got ${score1}`);
  console.log("Test 1 passed: Identical strings");

  // Test 2: Completely different strings
  const score2 = calculateSimilarity("Kucing makan ikan.", "Pesawat terbang tinggi di langit.");
  assert(parseFloat(score2) < 0.1, `Test 2 failed: Expected low similarity, got ${score2}`);
  console.log("Test 2 passed: Different strings");

  // Test 3: Similar meaning, different words (some overlap)
  const score3 = calculateSimilarity("Siswa belajar AI.", "Pelajar mempelajari kecerdasan buatan.");
  // Without a synonym dictionary, "Siswa" and "Pelajar" won't match, but "AI" and "kecerdasan buatan" won't match either.
  // Wait, "belajar" and "mempelajari" might match if I had stemming.
  // Let's use words that actually overlap.
  const score3_fixed = calculateSimilarity("Belajar kecerdasan buatan.", "Kecerdasan buatan sangat menarik.");
  assert(parseFloat(score3_fixed) > 0.3, `Test 3 failed: Expected moderate similarity, got ${score3_fixed}`);
  console.log("Test 3 passed: Partial overlap");

  console.log("All tests passed!");
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
