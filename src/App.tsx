// --- Part 1: New Constants (e.g., in a separate constants.ts file) ---
// The URL of your deployed hydro-ai-gemini-proxy Cloud Run Service
export const AI_PROXY_URL = 'https://hydro-ai-gemini-proxy-20700184149.us-central1.run.app/chat'; 

// --- Part 2: Improved App.tsx Logic (Core Changes) ---
import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { SendHorizontal } from 'lucide-react';
import Viewer from './Viewer';
// Note: We remove GoogleGenAI and Chat imports from the client side 
// for security and move to a standard fetch to the backend proxy.

interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'diagram_placeholder';
  text: string;
}

const App: React.FC = () => {
    // Removed: useState<GoogleGenAI | null>(null); and useState<Chat | null>(null);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // --- NEW: Function to send a message via streaming fetch to our Cloud Run Proxy ---
    const sendStreamedMessage = async (message: string) => {
        let fullResponse = '';
        const currentMessageId = crypto.randomUUID();
        
        // 1. Create a placeholder message to stream into
        setChatHistory(prev => [...prev, { id: currentMessageId, role: 'model', text: '' }]);

        try {
            const response = await fetch(AI_PROXY_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Assuming the proxy handles auth, but can add auth token here if needed
                },
                body: JSON.stringify({ 
                    message: message, 
                    history: chatHistory.filter(m => m.role !== 'diagram_placeholder') 
                }), 
            });

            if (!response.ok || !response.body) {
                throw new Error(`Proxy error: ${response.statusText}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                // Assuming chunk contains one or more message tokens/parts
                
                // Append the new chunk to the visible message text
                setChatHistory(prev => 
                    prev.map(msg => 
                        msg.id === currentMessageId 
                            ? { ...msg, text: msg.text + chunk } 
                            : msg
                    )
                );
                
                fullResponse += chunk;
            }
            
} catch (e: any) {
            console.error("Stream Error:", e);
            setError(`API Proxy Error: ${e.message}`);
            // If it fails, remove the empty message placeholder or replace it with an error.
            setChatHistory(prev => prev.filter(msg => msg.id !== currentMessageId)); 
        } finally {
            setIsLoading(false);
        }
    };

    const sendMessage = (message: string) => {
      if (!message.trim() || isLoading) return;

      const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', text: message };
      setChatHistory((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);
      sendStreamedMessage(message);
      setUserInput(''); // Clear input after sending
    };
    
    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault();
        sendMessage(userInput);
    };

    const handleButtonClick = (command: string) => {
      sendMessage(command);
    };

    useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    return (
        <main className="container mx-auto p-4 md:p-8">
            <Viewer />
            <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-700 rounded-lg mb-4">
              <button onClick={() => handleButtonClick('Analyze')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Analyze</button>
              <button onClick={() => handleButtonClick('Investigate')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Investigate</button>
              <button onClick={() => handleButtonClick('Save')} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Save</button>
              <button onClick={() => handleButtonClick('Render')} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">Render</button>
              <button onClick={() => handleButtonClick('Generate')} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">Generate</button>
              <div className="border-l border-gray-500 h-8 mx-2"></div>
              <button onClick={() => handleButtonClick('CFD Simulator')} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">CFD Simulator</button>
              <a href="https://console.cloud.google.com/storage/browser/cfd-simulation-results" target="_blank" rel="noopener noreferrer" className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded inline-block">Simulation Results</a>
              <button onClick={() => handleButtonClick('AppHub')} className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">AppHub</button>
            </div>

            <div className="flex flex-col space-y-4 p-4 bg-gray-900 rounded-lg h-96 overflow-y-auto">
              {chatHistory.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-lg ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="flex space-x-3 p-4 bg-gray-800 rounded-lg shadow-lg mt-8">
                 <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="flex-1 bg-transparent p-3 text-white placeholder-gray-500 focus:outline-none"
                    disabled={isLoading} 
                    aria-label="Chat input"
                />
                 <button 
                    type="submit" 
                    disabled={isLoading || !userInput.trim()} 
                    className="p-3 bg-blue-600 rounded-lg text-white disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500" 
                    aria-label="Send message" 
                >
                    <SendHorizontal className="w-6 h-6" />
                </button>
            </form>
        </main>
    );
};
export default App;