require('dotenv').config();
const { analyzeRequest, verifyImage, chatWithAI } = require('./controllers/aiController');

async function runTests() {
  console.log("=== Testing Controller Functions ===================");
  
  // Mock Express Req/Res
  const mockRes = () => {
    const res = {};
    res.status = (code) => { res.statusCode = code; return res; };
    res.json = (data) => { res.data = data; return res; };
    return res;
  };

  // Test 1: Analyze Request
  console.log("\\n--- 1. Testing analysisRequest ---");
  const req1 = {
    body: {
      description: "A huge fire just started in the apartment building on 5th street, we need immediate medical and shelter help!"
    }
  };
  const res1 = mockRes();
  await analyzeRequest(req1, res1);
  console.log(`Status: ${res1.statusCode}`);
  console.log("Data:", res1.data);

  // Test 2: Verify Image (Mocking with a 1x1 pixel white JPEG base64)
  console.log("\\n--- 2. Testing verifyImage ---");
  const req2 = {
    body: {
      imageBase64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
      mimeType: "image/jpeg",
      helpType: "medical"
    }
  };
  const res2 = mockRes();
  await verifyImage(req2, res2);
  console.log(`Status: ${res2.statusCode}`);
  console.log("Data:", res2.data);

  // Test 3: Chat With AI
  console.log("\\n--- 3. Testing chatWithAI ---");
  const req3 = {
    body: {
      message: "Hello, I am a citizen looking to register.",
      role: "citizen"
    }
  };
  const res3 = mockRes();
  await chatWithAI(req3, res3);
  console.log(`Status: ${res3.statusCode}`);
  console.log("Data:", res3.data);

}

runTests();
