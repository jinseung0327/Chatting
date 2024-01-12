import styled from '@emotion/styled';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { socket } from '../App';
import Exit from '../assets/back.png'
import Logo from '../assets/Logo_white_light.png'

const LeaveButton = styled.button`
  display: inline-flex;
  justify-content: space-between;
  border: none;
  padding: 20px;
  background-color: #FFE500;
  font-weight: bold;
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #000;
  padding: 1rem;

  min-height: 720px;
  max-height: 800px;
  overflow: auto;

  background: #FFF8B5;
`;

const MessageBox = styled.div`
  display: flex;
  flex-direction: column;

  &.my_message {
    align-self: flex-end;

    .message {
      background: #FFFFFF;
      align-self: flex-end;
    }
  }

  &.alarm {
    align-self: center;
  }
`;

const Message = styled.span`
  margin-top: 10px;
  margin-bottom: 0.5rem;
  background: #fff;
  width: fit-content;
  padding-left: 30px;
  padding-right: 30px;
  padding-top: 20px;
  padding-bottom: 20px;
  font-size: 1.2rem;
  box-shadow: 2px 3.4px 5px grey;
  border-radius: 100px 100px 0px 100px;
`;

const MessageForm = styled.form`
  display: flex;
  margin-top: 25px;

  button {
    background: white;
    border-radius: 20px;  
    border: none;
    box-shadow: 0px 0px 4px grey;
    font-weight: bold;
    font-size: 1.2rem;
  }

  input {
    padding: 15px 5px;
    margin-left: 1rem;
    width: 90%;
    padding-left: 10px;
    background-color: #D9D9D9;
    border: none;
    border-radius: 20px;
  }
`;

const ChatRoom = () => {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');
  const chatContainerEl = useRef(null);

  const { roomName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!chatContainerEl.current) return;

    const chatContainer = chatContainerEl.current;
    const { scrollHeight, clientHeight } = chatContainer;

    if (scrollHeight > clientHeight) {
      chatContainer.scrollTop = scrollHeight - clientHeight;
    }
  }, [chats.length]);

  useEffect(() => {
    const messageHandler = (chat) =>
      setChats((prevChats) => [...prevChats, chat]);

    socket.on('message', messageHandler);

    return () => {
      socket.off('message', messageHandler);
    };
  }, []);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  const onSendMessage = (e) => {
    e.preventDefault();
    if (!message) return alert('메시지를 입력해 주세요.');

    socket.emit('message', { roomName, message }, (chat) => {
      setChats((prevChats) => [...prevChats, chat]);
      setMessage('');
    });
  };

  const onLeaveRoom = () => {
    socket.emit('leave-room', roomName, () => {
      navigate('/');
    });
  };

  return (
    <>
      <div style={{ background: '#FFE500'}}>
        <LeaveButton onClick={onLeaveRoom}><img style={{ width: '65px', height: '55px', marginLeft: '15px', marginTop: '3px'}} src={Exit} alt='Exit'></img></LeaveButton>
        <img style={{ width: '170px', height: '55px', marginLeft: '800px', marginBottom: '0.5rem'}} src={Logo} alt='Logo'></img>
      </div>
      <ChatContainer ref={chatContainerEl}>
        {chats.map((chat, index) => (
          <MessageBox
            key={index}
            className={classNames({
              my_message: socket.id === chat.username,
              alarm: !chat.username,
            })}
          >
            <span>
              {chat.username
                ? socket.id === chat.username
                  ? ''
                  : chat.username
                : ''}
            </span>
            <Message className="message">{chat.message}</Message>
          </MessageBox>
        ))}
      </ChatContainer>
      <MessageForm onSubmit={onSendMessage}>
        <input style={{ backgroundColor: 'whitesmoke', border: '1.3px solid black'}} type="text" onChange={onChange} value={message} />
        <button style={{ marginLeft: '15px', width: '120px', height: '45px'}}>전송</button>
      </MessageForm>
    </>
  );
};

export default ChatRoom;