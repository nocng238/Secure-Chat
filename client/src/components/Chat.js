import { Avatar, Box, Text } from "@chakra-ui/react";

const Chat = ({ user }) => {
  return (
    <Box display="flex" alignItems="center" w="100%" h="100%">
      <Avatar mr={8} src={user.avatar} />
      <Text>{user.username}</Text>
    </Box>
  );
};

export default Chat;
