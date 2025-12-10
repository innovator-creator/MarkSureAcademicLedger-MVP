/**
 * Test API connection to verify all endpoints work
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

function getApiUrl() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/NEXT_PUBLIC_API_URL=(.+)/);
    if (match) {
      return match[1].trim();
    }
  }
  return 'http://localhost:5000';
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, { timeout: 5000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function testEndpoints() {
  const baseUrl = getApiUrl();
  console.log(`\n🧪 Testing API endpoints on ${baseUrl}\n`);

  const tests = [
    {
      name: 'Health Check',
      url: `${baseUrl}/health`,
      expectedStatus: 200
    },
    {
      name: 'Verify Certificate (non-existent)',
      url: `${baseUrl}/api/verify/TEST-CODE-123`,
      expectedStatus: 200,
      note: 'Should return verified: false for non-existent code'
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}...`);
      const result = await makeRequest(test.url);
      
      if (result.status === test.expectedStatus) {
        console.log(`  ✅ PASSED - Status: ${result.status}`);
        if (test.note) {
          console.log(`     Note: ${test.note}`);
        }
        passed++;
      } else {
        console.log(`  ❌ FAILED - Expected ${test.expectedStatus}, got ${result.status}`);
        failed++;
      }
    } catch (error) {
      console.log(`  ❌ FAILED - ${error.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

  if (failed === 0) {
    console.log('✅ All API endpoints are working correctly!');
    return true;
  } else {
    console.log('⚠️  Some endpoints failed. Please check the backend server.');
    return false;
  }
}

if (require.main === module) {
  testEndpoints().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { testEndpoints, getApiUrl };

