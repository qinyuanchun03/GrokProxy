/**
 * Local development server for testing the Grok API proxy
 *
 * Run with: deno run --allow-net --allow-env local-dev.ts
 */

// Import the serve function from the latest Deno standard library
import { serve } from "https://deno.land/std@0.220.1/http/server.ts";

// Import the worker handler
import worker from "./grok-api-proxy.ts";

// Create a mock environment and context
const env = {};
const ctx = {
  waitUntil(promise: Promise<any>) {
    return promise;
  },
  passThroughOnException() {},
};

// Start the server
const port = 8000;
console.log(`Starting local development server on http://localhost:${port}`);
console.log(`This proxy will forward requests to https://api.xai.com/v1/chat/completions`);
console.log(`Press Ctrl+C to stop the server`);

serve(async (request) => {
  console.log(`\n${new Date().toISOString()} - ${request.method} ${request.url}`);

  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  try {
    // Forward the request to our worker
    return await worker.fetch(request, env, ctx);
  } catch (error) {
    console.error("Error in local server:", error);
    return new Response(JSON.stringify({
      error: "Local server error",
      message: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}, { port });
