import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../../App';
import styles from './WatingRoom.module.css';

const WaitingRoom = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const roomListHandler = (rooms) => {
      setRooms(rooms);
    };
    const createRoomHandler = (newRoom) => {
      setRooms((prevRooms) => [...prevRooms, newRoom]);
    };
    const deleteRoomHandler = (roomName) => {
      setRooms((prevRooms) => prevRooms.filter((room) => room !== roomName));
    };

    socket.emit('room-list', roomListHandler);
    socket.on('create-room', createRoomHandler);
    socket.on('delete-room', deleteRoomHandler);

    return () => {
      socket.off('room-list', roomListHandler);
      socket.off('create-room', createRoomHandler);
      socket.off('delete-room', deleteRoomHandler);
    };
  }, []);

  const onCreateRoom = useCallback(() => {
    const roomName = prompt('방 이름을 입력해 주세요.');
    if (!roomName) return alert('방 이름은 반드시 입력해야 합니다.');

    socket.emit('create-room', roomName, (response) => {
      if (!response.success) return alert(response.payload);

      navigate(`/room/${response.payload}`);
    });
  }, [navigate]);

  const onJoinRoom = useCallback(
    (roomName) => () => {
      socket.emit('join-room', roomName, () => {
        navigate(`/room/${roomName}`);
      });
    },
    [navigate]
  );

  return (
    <div>
      <div className={styles['head']}>
        <div className={styles['title']}>채팅방 목록</div>
        <button className={styles['create-room-button']} onClick={onCreateRoom}>채팅방 생성</button>
      </div>
      <table className={styles['table']}>
        <thead>
          <tr>
            <th>방번호</th>
            <th>방이름</th>
            <th>입장</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room, index) => (
            <tr key={room}>
              <td>{index + 1}</td>
              <td>{room}</td>
              <td><button className={styles['join-room-button']} onClick={onJoinRoom(room)}>입장하기</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WaitingRoom;
