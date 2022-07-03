import MsgList from '../components/MsgList';
import { fetcher } from '../queryClient';
import { GET_MESSAGES } from '../graphql/message';
import { Message } from '../types';

const Home = ({ sMessages }: { sMessages: Message[] }) => (
  <>
    <h1>Query TEST</h1>
    <MsgList sMessages={sMessages} />
  </>
);

export const getServerSideProps = async () => {
  const { messages: sMessages }: { messages: Message[] } = await fetcher(GET_MESSAGES);
  return {
    props: { sMessages },
  };
};

export default Home;
