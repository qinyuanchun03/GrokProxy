/**
 * Local development server for testing the Grok API proxy
 * 
 * Run with: deno run --allow-net local-dev.ts
 */

import { serve } from "https://deno.land/std/http/server.ts";

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
console.log("Starting local development server on http://localhost:8000");
await serve((request) => {
  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }
  
  // Forward the request to our worker
  return worker.fetch(request, env, ctx as ExecutionContext);
}, { port: 8000 });
