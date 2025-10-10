import React from 'react';
import { ReactionTypes } from '../constant/reactions';
import {
  FrownIcon,
  LaughIcon,
  MessageCircleHeartIcon,
  ThumbsUpIcon,
} from 'lucide-react';

export const renderReaction = (reaction: ReactionTypes) => {
  switch (reaction) {
    case ReactionTypes.THUMBS_UP:
      return React.createElement(ThumbsUpIcon);
    case ReactionTypes.MESSAGE_CIRCLE_HEART:
      return React.createElement(MessageCircleHeartIcon);
    case ReactionTypes.LAUGH:
      return React.createElement(LaughIcon);
    case ReactionTypes.FROWN:
      return React.createElement(FrownIcon);
  }
};
