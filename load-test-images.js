/**
 * Load test for the image resizing route
 *
 * Usage:
 *   node load-test-images.js [test-type]
 *
 * Test types:
 *   light    - 10 connections, 10 seconds (default)
 *   medium   - 25 connections, 30 seconds
 *   heavy    - 50 connections, 60 seconds
 *   stress   - 100 connections, 60 seconds
 */

const autocannon = require('autocannon');
const path = require('path');
const fs = require('fs');

// Configuration
const BASE_URL = 'http://localhost:3000';
const IMAGE_DIR = 'images/official/2023/ALL_HR_-_Bruiloft_Kaylee_&_Lody_-_momenttom';

// Get a list of test images
const getTestImages = () => {
  const fullPath = path.join(__dirname, IMAGE_DIR);
  const files = fs.readdirSync(fullPath);
  // Get first 10 images for testing
  return files.filter(f => f.endsWith('.jpg')).slice(0, 10);
};

// Different image size configurations that match your actual srcset
const IMAGE_SIZES = [
  { w: 400, h: null, name: 'small' },
  { w: 800, h: null, name: 'medium' },
  { w: 1200, h: null, name: 'large' },
  { w: 1600, h: null, name: 'xlarge' },
  { w: 2000, h: null, name: 'xxlarge' },
];

// Test configurations
const TEST_CONFIGS = {
  light: {
    connections: 10,
    duration: 10,
    pipelining: 1,
  },
  medium: {
    connections: 25,
    duration: 30,
    pipelining: 1,
  },
  heavy: {
    connections: 50,
    duration: 60,
    pipelining: 1,
  },
  stress: {
    connections: 100,
    duration: 60,
    pipelining: 1,
  },
};

// Build request URLs
const buildRequests = () => {
  const images = getTestImages();
  const requests = [];

  // Simulate real-world usage: test both the /foto/ page route and direct /image/ calls
  images.forEach(image => {
    // Test the actual image resizing route (used by browser srcset)
    IMAGE_SIZES.forEach(size => {
      const imagePath = `official/2023/ALL_HR_-_Bruiloft_Kaylee_&_Lody_-_momenttom/${image}`;
      const url = `/image/${imagePath}?w=${size.w}${size.h ? `&h=${size.h}` : ''}&fit=cover`;
      requests.push({
        method: 'GET',
        path: url,
      });
    });
  });

  return requests;
};

// Monitor memory usage
const monitorMemory = () => {
  const used = process.memoryUsage();
  console.log('\n📊 Memory Usage:');
  for (let key in used) {
    console.log(`   ${key}: ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
  }
};

// Run the load test
const runTest = async (testType = 'light') => {
  const config = TEST_CONFIGS[testType];

  if (!config) {
    console.error(`Unknown test type: ${testType}`);
    console.log(`Available types: ${Object.keys(TEST_CONFIGS).join(', ')}`);
    process.exit(1);
  }

  console.log('\n🚀 Starting Image Load Test');
  console.log('═══════════════════════════════════════');
  console.log(`Test Type: ${testType.toUpperCase()}`);
  console.log(`Connections: ${config.connections}`);
  console.log(`Duration: ${config.duration}s`);
  console.log(`Target: ${BASE_URL}`);
  console.log('═══════════════════════════════════════\n');

  console.log('⚠️  Make sure your dev server is running first!');
  console.log('   Run: npm run dev\n');

  // Wait a moment for the user to read
  await new Promise(resolve => setTimeout(resolve, 2000));

  const requests = buildRequests();
  console.log(`📸 Testing with ${requests.length} different image/size combinations\n`);

  const instance = autocannon({
    url: BASE_URL,
    connections: config.connections,
    duration: config.duration,
    pipelining: config.pipelining,
    requests: requests,
    setupClient: (client) => {
      // Track progress
      client.on('response', () => {
        // Optional: could add custom response handling here
      });
    },
  });

  // Track progress
  autocannon.track(instance, {
    renderProgressBar: true,
    renderResultsTable: true,
  });

  // Monitor memory periodically
  const memInterval = setInterval(monitorMemory, 5000);

  // Handle results
  instance.on('done', (results) => {
    clearInterval(memInterval);

    console.log('\n\n═══════════════════════════════════════');
    console.log('📈 LOAD TEST RESULTS');
    console.log('═══════════════════════════════════════\n');

    console.log(`Requests: ${results.requests.total}`);
    console.log(`Duration: ${results.duration}s`);
    console.log(`Throughput: ${results.throughput.mean} requests/sec`);
    console.log(`Latency (avg): ${results.latency.mean}ms`);
    console.log(`Latency (p99): ${results.latency.p99}ms`);
    console.log(`Errors: ${results.errors}`);
    console.log(`Timeouts: ${results.timeouts}`);

    if (results['2xx']) {
      console.log(`\n✅ Successful responses (2xx): ${results['2xx']}`);
    }
    if (results['4xx']) {
      console.log(`⚠️  Client errors (4xx): ${results['4xx']}`);
    }
    if (results['5xx']) {
      console.log(`❌ Server errors (5xx): ${results['5xx']}`);
    }

    monitorMemory();

    console.log('\n═══════════════════════════════════════');

    // Provide feedback
    if (results.errors > 0 || results['5xx'] > 0) {
      console.log('\n⚠️  Issues detected! Check your server logs.');
    } else if (results.latency.p99 > 3000) {
      console.log('\n⚠️  High latency detected. Images may be taking too long to process.');
    } else {
      console.log('\n✅ Test completed successfully!');
    }
  });
};

// Parse command line arguments
const testType = process.argv[2] || 'light';
runTest(testType);