import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon } from 'lucide-react';

const SidePanel = ({ isOpen, onClose, messages, setMessages, initialQuestion }) => {
  const [newQuestion, setNewQuestion] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAsk = () => {
    if (newQuestion.trim()) {
      setMessages([...messages, { type: 'user', content: newQuestion }]);
      setNewQuestion('');
      // Simulate AI response (replace with actual API call in production)
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { type: 'ai', content: `Here's a response to "${newQuestion}"` }]);
      }, 1000);
    }
  };

  return (
    <div className={`fixed top-0 left-0 h-full w-[480px] bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out flex flex-col`}>
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">AI Conversation</h2>
        <Button variant="ghost" onClick={onClose}>Close</Button>
      </div>
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-lg max-w-[80%] ${message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        <div className="bg-white rounded-full shadow-lg p-2 flex items-center space-x-2 max-w-xl w-full">
          <Button size="icon" className="rounded-full flex-shrink-0 bg-[#594BFF1A] hover:bg-[#594BFF33]">
            <PlusIcon className="h-6 w-6 text-[#594BFF]" />
          </Button>
          <Input 
            type="text" 
            placeholder="Ask a follow-up question" 
            className="flex-grow text-lg border-none focus:ring-0 rounded-full"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
          />
          <Button 
            className="bg-[#594BFF] hover:bg-[#4B3FD9] text-white rounded-full px-6"
            onClick={handleAsk}
          >
            Ask
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;