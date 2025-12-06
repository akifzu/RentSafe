import { useState } from 'react';
import { ArrowLeft, MessageSquare, Send, Bot, User } from 'lucide-react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
};

type AskAIProps = {
  onBack: () => void;
};

export function AskAI({ onBack }: AskAIProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your SewaSecure AI assistant. I can help you with questions about the rental process, utilities tracking, lease agreements, and more. How can I help you today?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');

  // Mock AI responses
  const getAIResponse = (userQuestion: string): string => {
    const lowerQuestion = userQuestion.toLowerCase();

    if (lowerQuestion.includes('utility') || lowerQuestion.includes('utilities') || lowerQuestion.includes('water') || lowerQuestion.includes('electricity')) {
      return 'Utilities tracking helps you monitor your water, electricity, and rent payments. You can add readings regularly through the Utilities Tracker feature. This creates a transparent record of all utility usage and costs, which is helpful for budgeting and resolving any disputes.';
    }

    if (lowerQuestion.includes('report') || lowerQuestion.includes('move-in')) {
      return 'The move-in report is crucial for documenting the property condition when you first move in. Take detailed notes and photos of each room. This report protects both you and the landlord by providing a baseline for comparison during move-out, ensuring you\'re not charged for pre-existing damage.';
    }

    if (lowerQuestion.includes('agreement') || lowerQuestion.includes('lease') || lowerQuestion.includes('contract')) {
      return 'The rental agreement is a legally binding document that outlines the terms of your tenancy. Make sure to read it carefully before signing. Key points to review include rent amount, payment due dates, lease duration, maintenance responsibilities, and termination conditions.';
    }

    if (lowerQuestion.includes('ticket') || lowerQuestion.includes('start') || lowerQuestion.includes('begin')) {
      return 'To start the rental process, create a new ticket with the property details, your information, and upload your Letter of Offer (LOO) document. This initiates the secure rental workflow: 1) Create ticket with LOO, 2) Complete move-in report, 3) Sign agreement, and 4) Track utilities. Each step ensures transparency and documentation.';
    }

    if (lowerQuestion.includes('loo') || lowerQuestion.includes('letter of offer')) {
      return 'The Letter of Offer (LOO) is a required document when creating a rental ticket. It\'s an official document from the property owner offering you the tenancy. Make sure it includes the property address, rental terms, and both parties\' signatures. You\'ll need to upload this document (PDF, DOC, or image format) when creating your ticket.';
    }

    if (lowerQuestion.includes('security deposit') || lowerQuestion.includes('deposit')) {
      return 'Security deposits protect landlords against damage or unpaid rent. The move-in report you create is critical for getting your full deposit back. Document everything carefully at move-in, maintain the property well, and complete a move-out inspection to ensure a smooth return of your deposit.';
    }

    if (lowerQuestion.includes('maintenance') || lowerQuestion.includes('repair')) {
      return 'For maintenance issues, document the problem with photos and detailed notes. Contact your landlord promptly through official channels. Keep records of all communications. Emergency repairs (like water leaks or heating failures) should be reported immediately.';
    }

    if (lowerQuestion.includes('tenant rights') || lowerQuestion.includes('rights')) {
      return 'Tenant rights vary by location, but generally include the right to a habitable property, privacy, non-discrimination, and return of security deposit (minus legitimate deductions). Always document everything and know your local tenant laws. Consider consulting a local tenant advocacy group for specific advice.';
    }

    // Default response
    return 'That\'s a great question! For specific legal or financial advice, I recommend consulting with a professional. I can help you with general information about using the SewaSecure platform, understanding the rental process, utilities tracking, and documentation best practices. What would you like to know more about?';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, userMessage]);

    // Simulate AI thinking delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(input),
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    }, 800);

    setInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900">Ask AI</h1>
              <p className="text-sm text-gray-500">Get instant answers to your renting questions</p>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <main className="flex-1 overflow-hidden flex flex-col max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p
                  className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-indigo-200' : 'text-gray-500'
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3">Suggested questions:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'How do I track utilities?',
                'What should I include in a move-in report?',
                'How does the rental agreement work?',
                'What are my tenant rights?',
              ].map((question) => (
                <button
                  key={question}
                  onClick={() => setInput(question)}
                  className="text-left px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-sm text-gray-700"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about renting..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send
            </button>
          </div>
        </form>

        {/* Disclaimer */}
        <p className="text-xs text-gray-500 text-center mt-4">
          This AI provides general information only. For legal or financial advice, please consult a professional.
        </p>
      </main>
    </div>
  );
}