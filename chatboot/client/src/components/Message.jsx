import React from 'react';
import ReactMarkdown from 'react-markdown';

const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:5004';

const Message = ({ message, onOpenCanvas }) => {
    const isUser = message.sender === 'user';
    const hasImage = message.mimeType && message.mimeType.startsWith('image/');
    const isAudio = message.mimeType && message.mimeType.startsWith('audio/');

    const mediaSrc = message.fileUrl ? `${API_BASE}${message.fileUrl}` : message.fileUri;

    // Custom renderer for markdown to intercept code blocks and add "Canvas" buttons
    const markdownComponents = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isBlock = !inline && match;
            const codeString = String(children).replace(/\\n$/, '');

            if (isBlock && codeString.length > 50 && onOpenCanvas) {
                // Return a compact card instead of a massive code block
                return (
                    <div className="artifact-pill">
                        <div className="artifact-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                        </div>
                        <div className="artifact-info">
                            <div className="artifact-type">{match[1].toUpperCase()} Artifact</div>
                            <div className="artifact-desc">Click to open in Canvas</div>
                        </div>
                        <button
                            className="artifact-open-btn"
                            onClick={() => onOpenCanvas({ language: match[1], content: codeString })}
                        >
                            View
                        </button>
                    </div>
                );
            }

            // Render normal code block for very short inline scripts
            return !inline ? (
                <pre className={className}>
                    <code className={className} {...props}>
                        {children}
                    </code>
                </pre>
            ) : (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        }
    };

    return (
        <div className={`message-row ${isUser ? 'user' : 'bot'}`}>
            <div className="message-inner">
                {!isUser && (
                    <div className="bot-avatar">M</div>
                )}
                {isUser ? (
                    <div className="user-bubble">
                        {hasImage && (
                            <img src={mediaSrc} alt="Uploaded attachment" className="uploaded-image-preview" />
                        )}
                        {isAudio && (
                            <audio controls src={mediaSrc} className="uploaded-audio-preview" />
                        )}
                        <div className="markdown-body">
                            <ReactMarkdown components={markdownComponents}>{message.text}</ReactMarkdown>
                        </div>
                    </div>
                ) : (
                    <div className="bot-content markdown-body">
                        {hasImage && (
                            <img src={mediaSrc} alt="Bot attachment" className="uploaded-image-preview" />
                        )}
                        {isAudio && (
                            <audio controls src={mediaSrc} className="uploaded-audio-preview" />
                        )}
                        <ReactMarkdown components={markdownComponents}>{message.text}</ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Message;
