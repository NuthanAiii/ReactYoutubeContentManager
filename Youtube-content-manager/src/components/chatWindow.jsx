import React, { useState, useRef } from 'react'
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    TypingIndicator,
} from '@chatscope/chat-ui-kit-react'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import './chatWindow.css'
import * as apiCallSerive from '../services/apiCallSerive'

const ChatWindow = ({ onClose }) => {
    const windowRef = useRef(null)

    const [messages, setMessages] = useState([
        {
            message: "Hi! I'm your content assistant. Ask me anything about your YouTube content strategy.",
            sender: 'bot',
            direction: 'incoming',
        }
    ])
    const [isTyping, setIsTyping] = useState(false)

    const handleSend = async (text) => {
        const userMsg = { message: text, sender: 'user', direction: 'outgoing' }
        setMessages(prev => [...prev, userMsg])
        setIsTyping(true)
        try {
            const res = await apiCallSerive.getBotresponce('ask', { question: text })
            setMessages(prev => [...prev, { message: res.answer, sender: 'bot', direction: 'incoming' }])
        } catch (e) {
            setMessages(prev => [...prev, { message: 'Something went wrong. Please try again.', sender: 'bot', direction: 'incoming' }])
        } finally {
            setIsTyping(false)
        }
    }

    return (
        <div className="chat-window" ref={windowRef}>
            <div className="chat-window-header">
                <div className="chat-window-title">
                    <span className="chat-window-dot" />
                    Content Assistant
                </div>
                <button className="chat-window-close" onClick={onClose} aria-label="Close chat">✕</button>
            </div>

            <div className="chat-window-body">
                <MainContainer>
                    <ChatContainer>
                        <MessageList typingIndicator={isTyping ? <TypingIndicator content="Thinking…" /> : null}>
                            {messages.map((msg, i) => (
                                <Message key={i} model={msg} />
                            ))}
                        </MessageList>
                        <MessageInput
                            placeholder="Ask something…"
                            onSend={handleSend}
                            attachButton={false}
                        />
                    </ChatContainer>
                </MainContainer>
            </div>
        </div>
    )
}

export default ChatWindow
