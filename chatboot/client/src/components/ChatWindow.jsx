import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Message from './Message';
import ChatInput from './ChatInput';

const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:5004';
const socket = io(API_BASE || '/');

const ChatWindow = ({ sessionId, onMessageSent, onMenuClick, onOpenCanvas }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeModel, setActiveModel] = useState('flash');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchMessages = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/chat/${sessionId}`);
            setMessages(res.data);
        } catch (err) {
            console.error('Error fetching messages:', err);
        }
    };

    useEffect(() => {
        setMessages([]); // Clear chat window logic
        setLoading(false);
        fetchMessages();

        const handleReceiveMessage = (message) => {
            if (message.sessionId === sessionId) {
                setMessages(prev => {
                    if (!prev.find(m => m._id === message._id)) {
                        return [...prev, message];
                    }
                    return prev;
                });
                if (message.sender === 'user') onMessageSent();
            }
        };

        const handleStreamChunk = ({ messageId, streamSessionId, text }) => {
            // Note: passing `sessionId` from backend triggers scope issues sometimes, payload has it as `sessionId`
            setMessages(prev => prev.map(msg => {
                if (msg._id === messageId) {
                    return { ...msg, text: msg.text + text };
                }
                return msg;
            }));
        };

        const handleStreamEnd = () => {
            setLoading(false);
            scrollToBottom();
        };

        socket.on('receiveMessage', handleReceiveMessage);
        socket.on('streamChunk', handleStreamChunk);
        socket.on('streamEnd', handleStreamEnd);

        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
            socket.off('streamChunk', handleStreamChunk);
            socket.off('streamEnd', handleStreamEnd);
        };
    }, [sessionId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (payload) => {
        setLoading(true);
        const textContent = typeof payload === 'string' ? payload : payload.text;

        // Optimistic UI update
        const userMsgId = Date.now().toString();
        const userMsg = {
            _id: userMsgId,
            text: textContent,
            sender: 'user',
            fileUri: typeof payload === 'object' ? payload.fileUri : null,
            fileUrl: typeof payload === 'object' ? payload.fileUrl : null,
            mimeType: typeof payload === 'object' ? payload.mimeType : null
        };
        setMessages((prev) => [...prev, userMsg]);

        // If Nano (On-Device) is selected, generate completely using local Chrome Resources
        if (activeModel === 'nano') {
            try {
                if (!window.ai || !window.ai.createTextSession) {
                    throw new Error("Gemini Nano is not supported or flag is not enabled in this browser.");
                }

                const nanoSession = await window.ai.createTextSession();
                const botMsgId = 'nano-' + Date.now();
                setMessages((prev) => [...prev, { _id: botMsgId, text: '', sender: 'bot' }]);

                const stream = await nanoSession.promptStreaming(textContent);
                let streamedText = "";

                for await (const chunk of stream) {
                    streamedText = chunk; // window.ai yields full accumulated stream text
                    setMessages((prev) =>
                        prev.map(msg => msg._id === botMsgId ? { ...msg, text: streamedText } : msg)
                    );
                }

                setLoading(false);
                return;
            } catch (err) {
                console.error("Local Nano Error:", err);
                const botMsgId = 'nano-err-' + Date.now();
                const nanoErrorGuide = `*Note: Gemini Nano is not enabled in your browser. Automatically falling back to Gemini 2.5 Flash (Cloud)...*\n\nTo use local processing in the future, please enable the **Prompt API for Gemini Nano** flag in \`chrome://flags\`.`;
                setMessages((prev) => [...prev, { _id: botMsgId, text: nanoErrorGuide, sender: 'bot' }]);

                // Fallback to Flash
                setActiveModel('flash');
                const messagePayload = typeof payload === 'string'
                    ? { text: payload, sessionId, targetModel: 'flash' }
                    : { ...payload, sessionId, targetModel: 'flash' };

                socket.emit('sendMessage', messagePayload);
                return;
            }
        }

        // Default to cloud generation (Flash/Pro relies on socket.emit)
        const messagePayload = typeof payload === 'string'
            ? { text: payload, sessionId, targetModel: activeModel }
            : { ...payload, sessionId, targetModel: activeModel };

        socket.emit('sendMessage', messagePayload);
    };

    return (
        <div className="chat-window">
            <div className="chat-header">
                <div className="header-left">
                    <button className="mobile-menu-btn" onClick={onMenuClick} title="Open Menu">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>
                    <h1 className="chat-title">
                        MyAssistant
                    </h1>
                </div>
                <div className="model-selector">
                    <select value={activeModel} onChange={(e) => setActiveModel(e.target.value)}>
                        <option value="flash">⚡ Gemini 2.5 Flash</option>
                        <option value="pro">🧠 Gemini 2.5 Pro</option>
                        <option value="nano">📱 Gemini Nano (Local)</option>
                    </select>
                </div>
            </div>

            <div className="chat-messages custom-scrollbar">
                {messages.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-logo">M</div>
                        <h2>How can I help you today?</h2>
                    </div>
                )}
                {messages.map((msg, index) => (
                    <Message key={msg._id || index} message={msg} onOpenCanvas={onOpenCanvas} />
                ))}
                {loading && (
                    <div className="loading-container">
                        <div className="message-inner">
                            <div className="bot-avatar">M</div>
                            <div className="loading-bubble">
                                <span className="loading-dot"></span>
                                <span className="loading-dot"></span>
                                <span className="loading-dot"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
        </div>
    );
};

export default ChatWindow;
