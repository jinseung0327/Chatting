import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';
import ChatRoom from './pages/chatroom';
import WaitingRoom from './pages/wating-room/wating-room';

// 웹소켓 연결 및 소켓 인스턴스 생성
export const socket = io('http://localhost:3030/chat');

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<WaitingRoom />} />
        <Route path='/room/:roomName' element={<ChatRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
