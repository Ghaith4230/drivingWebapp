'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import ChatStyles from '../styles/chatStyles'

type ChatMessage = {
  from: string
  to: string
  message: string
}

type ChatHistory = {
  [username: string]: ChatMessage[]
}

let socket: Socket | null = null

export default function ChatPage() {
  const [username, setUsername] = useState('5074')
  const [allUsers, setAllUsers] = useState<string[]>([])
  const [selectedUser, setSelectedUser] = useState<string | null>("5074")
  const [chatHistory, setChatHistory] = useState<ChatHistory>({})
  const [input, setInput] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    socket = io()

    const handler = (msg: ChatMessage) => {
      
      const otherUser = msg.from === username ? msg.to : msg.from

      setChatHistory((prev) => ({
        ...prev,
        [otherUser]: [...(prev[otherUser] || []), msg],
      }))

      // update user list
      setAllUsers((prev) =>
        prev.includes(otherUser) ? prev : [...prev, otherUser]
      )
    }

    socket.on(username, handler)

    return () => {
      socket?.off('chat message', handler)
      socket?.disconnect()
    }
  }, [username]) // Make sure username is ready when handler runs

  useEffect(() => {
    const getUserId = async () => {
      try {
        const response = await fetch('/api/userId', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        })
        const result = await response.json()
        setUsername(result.message)
      } catch (err) {
        console.error('Failed to fetch userId:', err)
      }
    }

    getUserId()
  }, [])

  const send = () => {
    if (!input.trim() || !socket || !selectedUser) return

    const msg: ChatMessage = {
      from: username,
      to: selectedUser,
      message: input,
    }

    socket.emit('chat message', msg)

    setChatHistory((prev) => ({
      ...prev,
      [selectedUser]: [...(prev[selectedUser] || []), msg],
    }))

    setInput('')
  }

  return (
    <div>
      {/* Toggle Chat Button */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        style={ChatStyles.chatToggle}
      >
        💬
      </div>

      {/* Chat Window */}
      <div
        style={{
          ...ChatStyles.chatWindow,
          ...(isOpen ? {} : ChatStyles.chatWindowHidden),
        }}
      >
        {isOpen && (
          <>
            {/* User List */}
            <div style={ChatStyles.userList}>
              <h4 style={{ margin: '0 0 10px 0' }}>Users</h4>
              {allUsers
                .filter((user) => user !== username)
                .map((user) => (
                  <div
                    key={user}
                    onClick={() => setSelectedUser(user)}
                    style={{
                      ...ChatStyles.userItem,
                      ...(user === selectedUser
                        ? ChatStyles.userItemActive
                        : {}),
                    }}
                  >
                    {user}
                  </div>
                ))}
            </div>

            {/* Chat Panel */}
            <div style={ChatStyles.chatPanel}>
              <h3 style={{ margin: 0 }}>
                {selectedUser
                  ? `Chat with ${selectedUser}`
                  : 'Select a user to chat'}
              </h3>
              <div style={ChatStyles.chatMessages}>
                {(chatHistory[selectedUser || ''] || []).map((msg, i) => (
                  <p key={i} style={{ margin: 0, padding: '2px 0' }}>
                    <b>{msg.from === username ? 'You' : msg.from}:</b>{' '}
                    {msg.message}
                  </p>
                ))}
              </div>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message"
                onKeyDown={(e) => e.key === 'Enter' && send()}
                style={ChatStyles.chatInput}
              />
              <button onClick={send} style={ChatStyles.chatButton}>
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
