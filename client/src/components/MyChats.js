import React, { useState, useCallback } from 'react';
import { useAppContext } from '../context/ChatProvider';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Stack,
} from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import ChatLoading from './ChatLoading';
import GroupChatModal from './GroupChatModal';
import { toast } from 'react-toastify';
import { getSenderFull } from '../config';
import { api } from '../utils';
import { debounce } from 'lodash';
import UserListItem from './UserListItem';
import Chat from './Chat';

const MyChats = ({ loggedUser }) => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { selectedChat, setSelectedChat, chats, setChats } = useAppContext();

  const fetchResults = async (search) => {
    setLoading(true);
    const { data } = await api.get(`/api/v1/auth/users?search=${search}`);
    setLoading(false);
    setSearchResult(data);
  };

  const debounceSearch = useCallback(
    debounce((nextValue) => fetchResults(nextValue), 800),
    []
  );

  const onInputBlur = () => {
    setOpen(false);
    setSearchResult([]);
    setSearch('');
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setSearch(value);
    debounceSearch(value);
  };

  const handleBlur = useCallback(
    debounce(() => onInputBlur(), 100),
    []
  );

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const { data } = await api.post(`/api/v1/chat`, { userId });

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <Box
      display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDirection='column'
      alignItems='center'
      p={3}
      bg='white'
      borderRadius='lg'
      borderWidth='1px'
    >
      <Box
        pb={3}
        fontSize={{ base: '28px', md: '30px' }}
        fontFamily='Poppins'
        w='100%'
      >
        <Box p={2}>
          <InputGroup>
            <InputLeftElement pointerEvents='none' children={<SearchIcon />} />
            <Input
              placeholder='Search User'
              focusBorderColor='none'
              borderRadius={50}
              border='none'
              bg='rgba(0, 0, 0, 0.04)'
              value={search}
              onChange={handleChange}
              onFocus={() => setOpen(true)}
              onBlur={handleBlur}
            />
          </InputGroup>
        </Box>
      </Box>
      <Box
        display='flex'
        flexDirection='column'
        w='100%'
        h='100%'
        borderRadius='lg'
        overflowY='hidden'
      >
        {open ? (
          <Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml='auto' d='flex' />}
          </Box>
        ) : (
          <Box>
            {chats ? (
              <Stack overflowY='scroll' spacing={0}>
                {chats?.map((chat) => (
                  <Box
                    onClick={() => setSelectedChat(chat)}
                    cursor='pointer'
                    bg={selectedChat === chat && 'rgba(0, 0, 0, 0.04)'}
                    color='#65676B'
                    px={3}
                    py={2}
                    borderRadius='lg'
                    _hover={{
                      background: 'rgba(0, 0, 0, 0.04)',
                      transition: 0.3,
                    }}
                    key={chat?._id}
                  >
                    <Box>
                      {!chat?.isGroupChat ? (
                        <Chat user={getSenderFull(loggedUser, chat?.users)} />
                      ) : (
                        chat?.chatName
                      )}
                    </Box>
                  </Box>
                ))}
              </Stack>
            ) : (
              <ChatLoading />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
