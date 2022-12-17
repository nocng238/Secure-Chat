import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/ChatProvider';
import { MyChats, ChatBox, ProfileModal } from '../components';
import {
  Avatar,
  Box,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Tooltip,
} from '@chakra-ui/react';
import {
  api,
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
} from '../utils';
import { toast } from 'react-toastify';
import { AddIcon, ArrowForwardIcon, BellIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import GroupChatModal from '../components/GroupChatModal';
import { getSender } from '../config';

const Chat = () => {
  const [loggedUser, setLoggedUser] = useState();
  const [fetchAgain, setFetchAgain] = useState(false);

  const { setSelectedChat, user, setChats, notification, setNotification } =
    useAppContext();

  const navigate = useNavigate();

  const fetchChats = async () => {
    try {
      const { data } = await api.get('/api/v1/chat');
      setChats(data);
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    console.log('User from chat: ', getUserFromLocalStorage('user'));
    setLoggedUser(getUserFromLocalStorage('user'));
    fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAgain]);

  const logoutHandler = () => {
    removeUserFromLocalStorage('user');
    navigate('/register');
  };

  return (
    <HStack spacing={0} h='100vh' alignItems='inherit'>
      <Box w='360px' p={2} borderRight='1px solid #00000017'>
        <Stack direction={['column', 'row']} alignItems='center'>
          <Menu>
            <MenuButton>
              <Avatar
                size='sm'
                cursor='pointer'
                name={user?.username}
                src={user?.avatar}
              />
            </MenuButton>
            <MenuList border='1px solid #00000017'>
              <ProfileModal user={user}>My profile</ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler} icon={<ArrowForwardIcon />}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
          <Box flex={1} textAlign='center'>
            Chats
          </Box>
          <Box>
            <Menu>
              <MenuButton p={1}>
                {notification?.length > 0 ? (
                  <>{toast.info(`New Message`)}</>
                ) : null}
                <IconButton
                  borderRadius='50%'
                  bg='transparent'
                  fontSize='20px'
                  icon={<BellIcon />}
                />
              </MenuButton>
              <MenuList pl={2} border='1px solid #00000017'>
                {!notification?.length && 'No New Message'}
                {notification?.map((noti) => (
                  <MenuItem
                    key={noti._id}
                    onClick={() => {
                      setSelectedChat(noti.chat);
                      setNotification(notification.filter((n) => n !== noti));
                    }}
                  >
                    {noti?.chat?.isGroupChat
                      ? `New Message in ${noti?.chat?.chatName} `
                      : `New Message from ${getSender(
                          user,
                          noti?.chat?.users
                        )}`}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            <GroupChatModal>
              <Tooltip label='Create a new group'>
                <IconButton
                  borderRadius='50%'
                  bg='transparent'
                  fontSize='20px'
                  icon={<AddIcon />}
                />
              </Tooltip>
            </GroupChatModal>
          </Box>
        </Stack>
        {user && <MyChats loggedUser={loggedUser} />}
      </Box>
      <Box flex={1} p={2}>
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </HStack>
  );
};

export default Chat;
