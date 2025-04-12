/**
 * Test script for the Grok API proxy
 * 
 * Run with: deno run --allow-net test-proxy.ts YOUR_XAI_API_KEY
 */

// Check if API key is provided
if (Deno.args.length < 1) {
  console.error("Please provide your Xai API key as a command line argument");
  console.error("Usage: deno run --allow-net test-proxy.ts YOUR_XAI_API_KEY");
  Deno.exit(1);
}

const API_KEY = Deno.args[0];
const PROXY_URL = "http://localhost:8000";
const DIRECT_URL = "https://api.xai.com/v1/chat/completions";

// Test data
const testData = {
  model: "grok-1",
  messages: [
    {
      role: "user",
      content: "Hello, how are you today?"
    }
  ]
};

// Function to test the API
async function testAPI(url: string, name: string) {
  console.log(`\nTesting ${name} at ${url}...`);
  
  try {
    const startTime = Date.now();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify(testData)
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Response time: ${responseTime}ms`);
    
    // Log headers
    console.log("Response headers:");
    for (const [key, value] of response.headers.entries()) {
      console.log(`  ${key}: ${value}`);
    }
    
    // Parse and log the response body
    const data = await response.json();
    console.log("Response body:");
    console.log(JSON.stringify(data, null, 2));
    
    return { success: response.ok, data };
  } catch (error) {
    console.error(`Error testing ${name}:`, error);
    return { success: false, error };
  }
}

// Main function
async function main() {
  console.log("Starting API tests...");
  
  // Test the proxy
  const proxyResult = await testAPI(PROXY_URL, "Proxy");
  
  // Test direct API if proxy fails
  if (!proxyResult.success) {
    console.log("\nProxy test failed, testing direct API to verify credentials...");
    await testAPI(DIRECT_URL, "Direct API");
  }
  
  console.log("\nTests completed.");
}

// Run the main function
main().catch(console.error);
