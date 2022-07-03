import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useQueryClient, useMutation, useInfiniteQuery } from 'react-query';
import MsgItem from './MsgItem';
import MsgInput from './MsgInput';
import { QueryKeys, fetcher, findTargetMsgIndex, getNewMessages } from '../queryClient';
import { GET_MESSAGES, CREATE_MESSAGE, UPDATE_MESSAGE, DELETE_MESSAGE } from '../graphql/message';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { Message, MsgQueryData } from '../types';

const MsgList = ({ sMessages }: { sMessages: Message[] }) => {
  const client = useQueryClient();
  const { query } = useRouter();
  console.log(query);
  const userId = (query.userId || query.userid || '') as string;
  const [userMessages, setUserMessages] = useState([{ messages: sMessages }]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const doneEdit = () => setEditingId(null);
  const fetchMoreEl = useRef<HTMLDivElement>(null);
  const intersecting = useInfiniteScroll(fetchMoreEl);

  const { mutate: onCreate } = useMutation(
    ({ text }: { text: string }) => fetcher(CREATE_MESSAGE, { text, userId }),
    {
      onSuccess: ({ createMessage }) => {
        client.setQueryData<MsgQueryData>(QueryKeys.MESSAGES, (old) => {
          if (!old) return { pages: [{ messages: [createMessage] }], pageParams: '' };
          return {
            pageParams: old.pageParams,
            pages: [{ messages: [createMessage, ...old.pages[0].messages] }, ...old.pages.slice(1)],
          };
        });
      },
    },
  );

  const { mutate: onUpdate } = useMutation(
    ({ text, id }: { text: string; id?: string }) => fetcher(UPDATE_MESSAGE, { text, id, userId }),
    {
      onSuccess: ({ updateMessage }) => {
        doneEdit();
        client.setQueryData<MsgQueryData>(QueryKeys.MESSAGES, (old) => {
          if (!old) return { pages: [{ messages: [] }], pageParams: '' };

          const { pageIndex, msgIndex } = findTargetMsgIndex(old.pages, updateMessage.id);
          if (pageIndex < 0 || msgIndex < 0) return old;
          const newMessages = getNewMessages(old);
          newMessages.pages[pageIndex].messages.splice(msgIndex, 1, updateMessage);
          return newMessages;
        });
      },
    },
  );

  const { mutate: onDelete } = useMutation(
    (id: string) => fetcher(DELETE_MESSAGE, { id, userId }),
    {
      onSuccess: ({ deleteMessage: deletedId }) => {
        client.setQueryData<MsgQueryData>(QueryKeys.MESSAGES, (old) => {
          if (!old) return { pages: [{ messages: [] }], pageParams: '' };
          const { pageIndex, msgIndex } = findTargetMsgIndex(old.pages, deletedId);
          if (pageIndex < 0 || msgIndex < 0) return old;

          const newMessages = getNewMessages(old);
          newMessages.pages[pageIndex].messages.splice(msgIndex, 1);
          return newMessages;
        });
      },
    },
  );

  const { data, error, isError, fetchNextPage, hasNextPage } = useInfiniteQuery(
    QueryKeys.MESSAGES,
    ({ pageParam = '' }) => fetcher(GET_MESSAGES, { cursor: pageParam }),
    {
      getNextPageParam: ({ messages: message }) => message?.[message.length - 1]?.id,
    },
  );

  useEffect(() => {
    if (!data?.pages) return;
    setUserMessages(data.pages);
  }, [data?.pages]);

  useEffect(() => {
    if (intersecting && hasNextPage) void fetchNextPage();
  }, [intersecting, hasNextPage]);

  if (isError) {
    console.error(error);
    return null;
  }

  console.log(userId);

  return (
    <>
      {userId && <MsgInput mutate={onCreate} />}
      <ul>
        {userMessages.map(({ messages }, pageIndex) =>
          messages.map((x) => {
            const $key = `${pageIndex}${x.id}`;
            return (
              <MsgItem
                key={$key}
                {...x}
                onUpdate={onUpdate}
                onDelete={() => onDelete(x.id)}
                startEdit={() => setEditingId(x.id)}
                isEditing={editingId === x.id}
                myId={userId}
              />
            );
          }),
        )}
      </ul>
      <div ref={fetchMoreEl} />
    </>
  );
};

export default MsgList;
