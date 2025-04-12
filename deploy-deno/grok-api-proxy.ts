/**
 * Grok API Proxy for CloudFlare Workers
 * 
 * This script forwards requests from a custom domain to the Xai API endpoint
 * at https://api.xai.com/v1/chat/completions
 * 
 * It preserves all headers and request body, allowing the client to configure
 * model parameters directly rather than enforcing them in the proxy.
 */

interface Env {
  // Define any environment variables here if needed
  // API_KEY?: string; // Not required as we're passing through client auth
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // The target API endpoint
    const targetUrl = "https://api.xai.com/v1/chat/completions";
    
    try {
      // Clone the request to modify it
      const requestInit: RequestInit = {
        method: request.method,
        headers: new Headers(request.headers),
        body: request.body,
        redirect: 'follow',
      };

      // Create a new request to the target API
      const apiRequest = new Request(targetUrl, requestInit);
      
      // Forward the request to the Xai API
      const response = await fetch(apiRequest);
      
      // Clone the response to modify it if needed
      const responseInit: ResponseInit = {
        status: response.status,
        statusText: response.statusText,
        headers: new Headers(response.headers),
      };
      
      // Create a new response with the same body and modified headers if needed
      const newResponse = new Response(response.body, responseInit);
      
      // Add CORS headers if needed
      newResponse.headers.set('Access-Control-Allow-Origin', '*');
      newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      return newResponse;
    } catch (error) {
      // Handle any errors
      console.error('Error forwarding request:', error);
      return new Response(JSON.stringify({ error: 'Failed to forward request' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};
