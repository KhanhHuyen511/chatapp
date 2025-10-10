import React, { FC } from 'react';
import { Button } from '../ui/button';
import {
  MessageCircleHeartIcon,
  ThumbsUpIcon,
  LaughIcon,
  FrownIcon,
} from 'lucide-react';
import { ReactionTypes } from '@/lib/constant/reactions';
import { useChat } from '@/contexts/chatContext';
import { Message } from '@/lib/types/message';

type Props = {
  message: Message;
  reaction?: ReactionTypes;
};

const ReactionButtons = [
  {
    icon: ThumbsUpIcon,
    reaction: ReactionTypes.THUMBS_UP,
  },
  {
    icon: MessageCircleHeartIcon,
    reaction: ReactionTypes.MESSAGE_CIRCLE_HEART,
  },
  {
    icon: LaughIcon,
    reaction: ReactionTypes.LAUGH,
  },
  {
    icon: FrownIcon,
    reaction: ReactionTypes.FROWN,
  },
];

const Reactions: FC<Props> = ({ message, reaction }) => {
  const { addReaction } = useChat();

  return (
    <div className="flex items-center gap-1">
      {ReactionButtons.map((item) => (
        <Button
          variant={reaction && reaction === item.reaction ? 'default' : 'ghost'}
          size="icon-sm"
          key={item.reaction}
          onClick={() =>
            addReaction(
              message,
              reaction === item.reaction ? undefined : item.reaction
            )
          }
        >
          <item.icon />
        </Button>
      ))}
    </div>
  );
};

export default Reactions;
