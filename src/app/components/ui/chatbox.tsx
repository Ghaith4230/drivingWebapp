'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import ChatStyles from '../styles/chatStyles'
import { getContacts, getMessages } from '@/db/select'
import { addMessage } from '@/db/queries/insert'

type ChatMessage = {
  from: string
  to: string
  message: string
  date: string
}

type ChatHistory = {
  [username: string]: ChatMessage[]
}

let socket: Socket | null = null

export default function ChatPage() {
  const [username, setUsername] = useState('')
  const [allUsers, setAllUsers] = useState<string[]>([])
  const [selectedUser, setSelectedUser] = useState<string | null>("")
  const [chatHistory, setChatHistory] = useState<ChatHistory>({})
  const [input, setInput] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch('/api/userId', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        })
        const userResult = await userResponse.json()
        const userId = userResult.message
        setUsername(userId)
  
        const contact = await getContacts(parseInt(userId))

        for (const c of contact) {
          const messages = await getMessages(c.from, c.to)

          for (const msg of messages) {
          
            setChatHistory((prev) => ({
              ...prev,
              [c.to]: [...(prev[c.to] || []), msg],
            }))
          }
        }

        const filteredContacts = contact
          .filter((c: { to: any }) => Number.isInteger(c.to))
          .map((c: { to: number }) => c.to.toString());
        setAllUsers(filteredContacts);
        console.log('Contacts:', filteredContacts)
      } catch (err) {
        console.error('Error fetching data:', err)
      }
    }
  
    fetchData()
  }, [])

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

  const send = () => {
    if (!input.trim() || !socket || !selectedUser) return

    const msg: ChatMessage = {
      from: username,
      to: selectedUser,
      message: input,
      date: new Date().toISOString(),
    }

    addMessage({
      from: parseInt(username),
      to: parseInt(selectedUser),
      message: input, 
      date: new Date().toISOString(),
    })

    socket.emit('chat message', msg)

    setChatHistory((prev) => ({
      ...prev,
      [selectedUser]: [...(prev[selectedUser] || []), msg],
    }))

    console.log(chatHistory[selectedUser])
    setInput('')
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const hours = date.getHours() % 12 || 12
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM'
    return `${hours}:${minutes} ${ampm}`
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
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: msg.from === username ? 'flex-end' : 'flex-start',
                      marginBottom: '10px',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '60%',
                        padding: '10px',
                        backgroundColor: msg.from === username ? '#00bfff' : '#e0e0e0',
                        borderRadius: '20px',
                        color: msg.from === username ? 'white' : 'black',
                        wordWrap: 'break-word',
                        position: 'relative',
                      }}
                    >
                      {/* Timestamp Above the Bubble */}
                      <div
                        style={{
                          fontSize: '0.8em',
                          color: '#777',
                          marginBottom: '5px',
                          textAlign: msg.from === username ? 'right' : 'left',
                        }}
                      >
                        {formatTimestamp(msg.date)}
                      </div>
                      <b>{msg.from === username ? 'You' : msg.from}:</b> {msg.message}
                    </div>
                  </div>
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