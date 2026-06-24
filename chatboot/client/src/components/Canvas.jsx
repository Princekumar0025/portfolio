import React, { useState } from 'react';

const Canvas = ({ codeData, onClose }) => {
    const [viewMode, setViewMode] = useState('code'); // 'code' or 'preview'
    const isHtml = codeData.language === 'html' || codeData.language === 'xml';

    const getPreviewHtml = () => {
        if (!isHtml) return '';
        // Wrap in a basic document structure if it's just a fragment
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    body { font-family: system-ui, sans-serif; padding: 1rem; color: #333; background: #fff; }
                </style>
            </head>
            <body>
                ${codeData.content}
            </body>
            </html>
        `;
    };

    return (
        <div className="canvas-container">
            <div className="canvas-header">
                <div className="canvas-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                    Artifact Canvas
                </div>
                <div className="canvas-controls">
                    {isHtml && (
                        <div className="canvas-toggle">
                            <button
                                className={`toggle-btn ${viewMode === 'code' ? 'active' : ''}`}
                                onClick={() => setViewMode('code')}
                            >
                                Code
                            </button>
                            <button
                                className={`toggle-btn ${viewMode === 'preview' ? 'active' : ''}`}
                                onClick={() => setViewMode('preview')}
                            >
                                Preview
                            </button>
                        </div>
                    )}
                    <button className="canvas-close-btn" onClick={onClose} title="Close Canvas">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
            </div>

            <div className="canvas-content custom-scrollbar">
                {viewMode === 'code' ? (
                    <pre className="canvas-code-block">
                        <code className={`language-${codeData.language}`}>
                            {codeData.content}
                        </code>
                    </pre>
                ) : (
                    <iframe
                        title="HTML Preview"
                        className="canvas-iframe"
                        srcDoc={getPreviewHtml()}
                        sandbox="allow-scripts allow-modals"
                    />
                )}
            </div>
        </div>
    );
};

export default Canvas;
