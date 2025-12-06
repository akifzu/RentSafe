import { useState } from 'react';
import { isClaudeConfigured } from '../services/claudeAI';

export function DiagnosticCheck() {
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runDiagnostic = async () => {
    setChecking(true);
    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      checks: {}
    };

    // Check 1: Environment variable
    const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
    diagnostics.checks.envVarExists = !!apiKey;
    diagnostics.checks.envVarValue = apiKey ? `${apiKey.slice(0, 10)}...` : 'NOT SET';
    diagnostics.checks.isConfigured = isClaudeConfigured();

    // Check 2: Try a simple API call
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey || '',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'test' }],
        }),
      });

      diagnostics.checks.apiCallStatus = response.status;
      diagnostics.checks.apiCallOk = response.ok;
      
      if (!response.ok) {
        const errorText = await response.text();
        diagnostics.checks.apiError = errorText;
      } else {
        diagnostics.checks.apiSuccess = true;
      }
    } catch (error: any) {
      diagnostics.checks.apiCallFailed = true;
      diagnostics.checks.errorMessage = error.message;
      diagnostics.checks.errorType = error.name;
    }

    setResult(diagnostics);
    setChecking(false);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4 max-w-md z-50">
      <h3 className="font-bold text-gray-900 mb-3">🔧 AI Diagnostic Tool</h3>
      
      <button
        onClick={runDiagnostic}
        disabled={checking}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 mb-3"
      >
        {checking ? 'Checking...' : 'Run Diagnostic'}
      </button>

      {result && (
        <div className="text-xs space-y-2">
          <div className="p-2 bg-gray-50 rounded">
            <p className="font-semibold">Environment Variable:</p>
            <p className={result.checks.envVarExists ? 'text-green-600' : 'text-red-600'}>
              {result.checks.envVarExists ? '✅ Set' : '❌ Not Set'}
            </p>
            <p className="text-gray-600 text-[10px] mt-1">{result.checks.envVarValue}</p>
          </div>

          <div className="p-2 bg-gray-50 rounded">
            <p className="font-semibold">API Call Test:</p>
            {result.checks.apiCallFailed ? (
              <>
                <p className="text-red-600">❌ Failed</p>
                <p className="text-gray-600 text-[10px] mt-1">
                  Error: {result.checks.errorMessage}
                </p>
                {result.checks.errorMessage?.includes('CORS') && (
                  <p className="text-orange-600 text-[10px] mt-2 font-semibold">
                    ⚠️ CORS ISSUE: Cannot call API from browser directly
                  </p>
                )}
              </>
            ) : result.checks.apiCallOk ? (
              <p className="text-green-600">✅ Success</p>
            ) : (
              <>
                <p className="text-orange-600">⚠️ API Error</p>
                <p className="text-gray-600 text-[10px] mt-1">
                  Status: {result.checks.apiCallStatus}
                </p>
                <p className="text-gray-600 text-[10px] break-all">
                  {result.checks.apiError}
                </p>
              </>
            )}
          </div>

          <div className="p-2 bg-blue-50 rounded border border-blue-200">
            <p className="font-semibold text-blue-900">Common Issues:</p>
            <ul className="text-[10px] text-blue-800 mt-1 space-y-1">
              <li>• API key still set to placeholder</li>
              <li>• CORS: Browser blocks direct API calls</li>
              <li>• Invalid API key format</li>
              <li>• Need to restart dev server</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

