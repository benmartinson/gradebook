import { useState } from "react";
import { useConvexAuth } from "convex/react";

const BedrockTest = () => {
  const { isAuthenticated } = useConvexAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testBedrock = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const convexUrl = import.meta.env.VITE_CONVEX_URL;
      // Convert convex.cloud URL to convex.site for HTTP endpoints
      const httpUrl = convexUrl.replace('.convex.cloud', '.convex.site');
      const response = await fetch(`${httpUrl}/bedrock/test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || "Failed to connect to Bedrock");
      }
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-md">
        <h3 className="text-lg font-semibold mb-2">AWS Bedrock Test</h3>
        
        <button
          onClick={testBedrock}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-md transition-colors mb-3"
        >
          {loading ? "Testing..." : "Test Bedrock Connection"}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-3">
            <p className="font-semibold">Error:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md">
            <p className="font-semibold">{result.message}</p>
            {result.response && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm">View Response</summary>
                <pre className="text-xs mt-2 overflow-auto">
                  {JSON.stringify(result.response, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BedrockTest;