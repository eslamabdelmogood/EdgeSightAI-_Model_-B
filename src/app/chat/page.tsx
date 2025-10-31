'use client';

import { useState } from 'react';
import { Bot, Send, User } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { chat, type ChatInput } from '@/ai/flows/chat';
import { Skeleton } from '@/components/ui/skeleton';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatInput: ChatInput = {
        history: messages,
        message: input,
      };
      const response = await chat(chatInput);
      const assistantMessage: ChatMessage = { role: 'assistant', content: response.reply };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex h-[calc(100vh-8rem)] flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot />
          AI Technical Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pr-2">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn('flex items-start gap-3', {
                'justify-end': message.role === 'user',
              })}
            >
              {message.role === 'assistant' && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Bot size={20} />
                </div>
              )}
              <div
                className={cn('max-w-xs rounded-lg p-3 text-sm lg:max-w-md', {
                  'bg-primary/10': message.role === 'assistant',
                  'bg-secondary text-secondary-foreground': message.role === 'user',
                })}
              >
                {message.content}
              </div>
              {message.role === 'user' && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <User size={20} />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Bot size={20} />
              </div>
              <div className="max-w-xs rounded-lg p-3 text-sm lg:max-w-md bg-primary/10">
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
          <Input
            type="text"
            placeholder="Ask about a technical problem..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send size={16} />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
