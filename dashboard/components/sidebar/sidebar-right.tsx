"use client";

import * as React from "react";
import { X, Send, Sparkles, FileText, Trash2 } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTableContext } from "@/components/provider/table-provider";

// Mock chat messages for demo
const mockMessages = [
  {
    id: 1,
    type: "bot" as const,
    content: "Hello! I'm your AI assistant. How can I help you today?",
    timestamp: new Date(),
  },
  {
    id: 2,
    type: "user" as const,
    content: "Can you help me with my React component?",
    timestamp: new Date(),
  },
  {
    id: 3,
    type: "bot" as const,
    content:
      "Of course! I'd be happy to help you with your React component. Could you please share the specific issue you're facing or the component code you'd like me to review?",
    timestamp: new Date(),
  },
];

interface SidebarRightProps extends React.ComponentProps<typeof Sidebar> {
  isOpen?: boolean;
  onClose?: () => void;
  appId?: string;
}

export function SidebarRight({
  isOpen = true,
  onClose,
  appId,
  ...props
}: SidebarRightProps) {
  const [messages, setMessages] = React.useState(mockMessages);
  const [inputValue, setInputValue] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const { selectedRows, clearSelectedRows } = useTableContext();

  // Keyboard shortcut handler
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === "i") {
        event.preventDefault();
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Auto scroll to bottom when new messages arrive
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Create message content with context if rows are selected
    let messageContent = inputValue;
    if (selectedRows.length > 0) {
      const contextInfo = selectedRows
        .map((row) => `- ${row.header} (${row.type}, ${row.status})`)
        .join("\n");
      messageContent = `Context (${selectedRows.length} selected rows):\n${contextInfo}\n\nQuestion: ${inputValue}`;
    }

    const newMessage = {
      id: messages.length + 1,
      type: "user" as const,
      content: messageContent,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: "bot" as const,
        content:
          selectedRows.length > 0
            ? `I can see you've selected ${selectedRows.length} row(s) from your table. Based on this context, let me help you with that...`
            : "I understand your request. Let me help you with that...",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <Sidebar
      collapsible='none'
      className='sticky top-0 flex h-svh border-l bg-background'
      style={{ width: "380px" }}
      {...props}
    >
      {/* Header */}
      <SidebarHeader className='border-sidebar-border h-14 border-b bg-background'>
        <div className='flex items-center justify-between px-4 h-full'>
          <div className='flex items-center gap-2'>
            <Sparkles className='h-4 w-4 text-primary' />
            <span className='font-medium text-sm'>
              {appId?.replace(/-/g, " ")}
            </span>
          </div>
          <Button
            variant='ghost'
            size='icon'
            onClick={onClose}
            className='h-7 w-7 text-muted-foreground hover:text-foreground'
          >
            <X className='h-4 w-4' />
            <span className='sr-only'>Close chat</span>
          </Button>
        </div>
      </SidebarHeader>

      {/* Context Section */}
      {selectedRows.length > 0 && (
        <div className='border-sidebar-border border-b bg-muted/30 p-3'>
          <div className='flex items-center justify-between mb-2'>
            <div className='flex items-center gap-2'>
              <FileText className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm font-medium'>
                Context ({selectedRows.length} rows)
              </span>
            </div>
            <Button
              variant='ghost'
              size='icon'
              onClick={clearSelectedRows}
              className='h-6 w-6 text-muted-foreground hover:text-foreground'
            >
              <Trash2 className='h-3 w-3' />
              <span className='sr-only'>Clear context</span>
            </Button>
          </div>
          <div className='space-y-2 max-h-32 overflow-y-auto'>
            {selectedRows.map((row) => (
              <div
                key={row.id}
                className='bg-background rounded border p-2 text-xs'
              >
                <div className='font-medium truncate'>{row.header}</div>
                <div className='flex gap-2 mt-1'>
                  <Badge variant='outline' className='text-xs'>
                    {row.type}
                  </Badge>
                  <Badge variant='outline' className='text-xs'>
                    {row.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <SidebarContent className='flex flex-col overflow-hidden p-0'>
        <div className='flex-1 overflow-y-auto px-3 py-4 space-y-4'>
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex w-full",
                message.type === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                  message.type === "user"
                    ? "bg-primary text-primary-foreground ml-12"
                    : "bg-muted text-foreground mr-12"
                )}
              >
                <div className='whitespace-pre-wrap leading-relaxed'>
                  {message.content}
                </div>
                <div
                  className={cn(
                    "text-xs mt-1 opacity-70",
                    message.type === "user"
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  )}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className='flex justify-start w-full'>
              <div className='bg-muted text-foreground rounded-lg px-3 py-2 mr-12'>
                <div className='flex items-center gap-1'>
                  <div className='flex gap-1'>
                    <div className='h-1.5 w-1.5 bg-muted-foreground/60 rounded-full animate-bounce' />
                    <div className='h-1.5 w-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:0.1s]' />
                    <div className='h-1.5 w-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:0.2s]' />
                  </div>
                  <span className='text-xs text-muted-foreground ml-2'>
                    AI is typing...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </SidebarContent>

      {/* Input Footer */}
      <SidebarFooter className='border-sidebar-border border-t bg-background p-3'>
        <div className='flex gap-2'>
          <div className='flex-1 relative'>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                selectedRows.length > 0
                  ? `Ask about ${selectedRows.length} selected row(s)...`
                  : "Message AI..."
              }
              className='pr-12 h-9 text-sm border-input bg-background focus-visible:ring-1'
            />
            <div className='absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground/60'>
              ⌘⏎
            </div>
          </div>
          <Button
            onClick={handleSendMessage}
            size='icon'
            disabled={!inputValue.trim() || isTyping}
            className='h-9 w-9 shrink-0'
          >
            <Send className='h-4 w-4' />
            <span className='sr-only'>Send message</span>
          </Button>
        </div>
        <div className='text-xs text-muted-foreground/60 text-center pt-1'>
          Press <kbd className='px-1 py-0.5 bg-muted/50 rounded text-xs'>⌘</kbd>{" "}
          + <kbd className='px-1 py-0.5 bg-muted/50 rounded text-xs'>I</kbd> to
          toggle
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
