import React, { useState, useRef } from 'react';
import axios from 'axios';

const ChatInput = ({ onSendMessage, disabled }) => {
    const [text, setText] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const audioFile = new File([audioBlob], `voice-recording-${Date.now()}.webm`, { type: 'audio/webm' });
                setSelectedFile(audioFile);

                // Stop all audio tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Could not access microphone. Please allow permissions.');
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (imageInputRef.current) imageInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if ((!text.trim() && !selectedFile) || disabled || isUploading) return;

        let messagePayload = text;

        if (selectedFile) {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:5004';
                const res = await axios.post(`${API_BASE}/api/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                // If a file was uploaded successfully, change the payload to an object
                messagePayload = {
                    text: text,
                    fileUri: res.data.fileUri,
                    fileUrl: res.data.fileUrl,
                    mimeType: res.data.mimeType
                };
            } catch (err) {
                console.error("Upload failed", err);
                setIsUploading(false);
                return; // Prevent sending message if upload fails
            }
        }

        onSendMessage(messagePayload);
        setText('');
        setSelectedFile(null);
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (imageInputRef.current) imageInputRef.current.value = '';
    };

    return (
        <div className="chat-input-container">
            <div className="input-outer-wrapper">
                {selectedFile && (
                    <div className="file-preview-bar">
                        <span className="file-name">{selectedFile.name}</span>
                        <button type="button" onClick={handleRemoveFile} className="remove-file-btn">
                            &times;
                        </button>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="input-wrapper">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                        accept=".pdf,.txt,.csv,.json,.md,.html,.js,.py"
                    />
                    <input
                        type="file"
                        ref={imageInputRef}
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                        accept="image/*"
                    />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="attachment-btn" title="Upload File" disabled={disabled || isUploading}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                    </button>
                    <button type="button" onClick={() => imageInputRef.current?.click()} className="attachment-btn" title="Add Image" disabled={disabled || isUploading}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    </button>
                    <button type="button" className="attachment-btn" title="Connect Drive" disabled={disabled || isUploading}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 22h20L12 2z"></path><path d="M12 2l10 20H2L12 2z"></path></svg>
                    </button>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={isUploading ? "Uploading file..." : "Message MyAssistant..."}
                        disabled={disabled || isUploading}
                        className="chat-input"
                    />
                    {!isRecording ? (
                        <button type="button" onClick={handleStartRecording} className="attachment-btn" title="Record Audio" disabled={disabled || isUploading}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                        </button>
                    ) : (
                        <button type="button" onClick={handleStopRecording} className="attachment-btn recording" title="Stop Recording">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2" ry="2"></rect></svg>
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={disabled || isUploading || (!text.trim() && !selectedFile)}
                        className="chat-send-btn"
                    >
                        {isUploading ? "..." : "\u2191"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatInput;
