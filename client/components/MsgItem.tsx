import { Mutate, User } from '../types';
import MsgInput from './MsgInput';

const MsgItem = ({
  id,
  timestamp,
  text,
  onUpdate,
  onDelete,
  isEditing,
  startEdit,
  myId,
  user,
}: {
  id: string;
  timestamp: number;
  text: string;
  myId: string;
  user: User;
  isEditing: boolean;
  onUpdate: Mutate;
  startEdit: () => void;
  onDelete: () => void;
}) => (
  <li>
    <h3>
      {user.nickname}{' '}
      <sub>
        {new Date(timestamp).toLocaleString('ko-KR', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })}
      </sub>
    </h3>

    {isEditing ? (
      <>
        <MsgInput mutate={onUpdate} text={text} id={id} />
      </>
    ) : (
      text
    )}

    {myId === user.id && (
      <div>
        <button type="button" onClick={startEdit}>
          수정
        </button>
        <button type="button" onClick={onDelete}>
          삭제
        </button>
      </div>
    )}
  </li>
);

export default MsgItem;
