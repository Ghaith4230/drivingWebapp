// ChatStyles.ts

import { CSSProperties } from 'react'

const ChatStyles: { [key: string]: CSSProperties } = {
  chatToggle: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    background: '#007bff',
    color: 'white',
    borderRadius: '50%',
    width: 60,
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: 24,
    zIndex: 1000,
  },

  chatWindow: {
    position: 'fixed',
    bottom: 90,
    right: 20,
    width: 400,
    height: 500,
    overflow: 'hidden',
    transition: 'all 0.3s ease-in-out',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    borderRadius: 10,
    background: 'white',
    display: 'flex',
    flexDirection: 'row',
    zIndex: 999,
  },

  chatWindowHidden: {
    height: 0,
    boxShadow: 'none',
  },

  userList: {
    width: 120,
    borderRight: '1px solid #ccc',
    padding: 10,
    overflowY: 'auto',
  },

  userItem: {
    padding: 5,
    cursor: 'pointer',
    borderRadius: 4,
  },

  userItemActive: {
    background: '#eee',
  },

  chatPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
  },

  chatMessages: {
    flex: 1,
    overflowY: 'auto',
    border: '1px solid #ccc',
    borderRadius: 5,
    padding: 5,
    margin: '10px 0',
    maxHeight: 300,
  },

  chatInput: {
    marginBottom: 5,
    padding: 5,
  },

  chatButton: {
    padding: 5,
  },
}

export default ChatStyles
