import styled from 'styled-components';
import {
  PenLine,
  Eye,
  BarChart3,
  MessagesSquare,
  Heart,
  UserPlus,
  Tags,
  Search,
  Image,
  Moon,
  ShieldCheck,
  KeyRound,
  Bell,
  Bookmark,
  Mail,
  Globe2,
} from 'lucide-react';
import { text, label as labelStyle, media } from '../../styles/theme/mixins';

/**
 * The complete capability list.
 *
 * A landing page that only shows the strong parts is a landing page nobody trusts on the
 * second visit. Everything the platform does is listed here, and anything not finished is
 * labelled `soon` rather than quietly omitted — which also doubles as a public roadmap.
 */

const FEATURES = [
  {
    group: 'Writing',
    items: [
      {
        icon: PenLine,
        name: 'Markdown editor',
        text: 'Live side-by-side preview, code blocks, headings, lists.',
      },
      {
        icon: Image,
        name: 'Cover images',
        text: 'A hero image per post, shown across the feed and article.',
      },
      {
        icon: Eye,
        name: 'Draft, private, public',
        text: 'Three visibility states you can move between at any time.',
      },
      {
        icon: Tags,
        name: 'Categories and tags',
        text: 'A post can sit in several topics at once.',
      },
    ],
  },
  {
    group: 'Analytics',
    items: [
      {
        icon: Eye,
        name: 'Views and reads',
        text: 'Counted separately, because opening is not reading.',
      },
      {
        icon: BarChart3,
        name: 'Read-through rate',
        text: 'The share of openers who actually finished the piece.',
      },
      {
        icon: BarChart3,
        name: 'Top performers',
        text: 'Your posts ranked, so you can see what is working.',
      },
      {
        icon: Globe2,
        name: 'Site-wide totals',
        text: 'Administrators get the same picture across every author.',
      },
    ],
  },
  {
    group: 'Community',
    items: [
      {
        icon: MessagesSquare,
        name: 'Threaded replies',
        text: 'Readers answer each other, not only the author.',
      },
      { icon: Heart, name: 'Likes', text: 'One per reader per post, and it survives a reload.' },
      {
        icon: UserPlus,
        name: 'Follow authors',
        text: 'Follower and following counts on every profile.',
      },
      { icon: Search, name: 'Search and browse', text: 'Find posts by title, or browse by topic.' },
    ],
  },
  {
    group: 'Account and platform',
    items: [
      {
        icon: KeyRound,
        name: 'Secure sign-in',
        text: 'Hashed passwords, short-lived tokens, silent refresh.',
      },
      {
        icon: ShieldCheck,
        name: 'Admin console',
        text: 'Moderate posts, manage topics, review the user list.',
      },
      {
        icon: Moon,
        name: 'Light and dark',
        text: 'Follows your system, or pick one and it is remembered.',
      },
      {
        icon: Bell,
        name: 'Notifications',
        text: 'Alerts for replies, likes and new followers.',
        soon: true,
      },
      { icon: Bookmark, name: 'Bookmarks', text: 'Save a post to finish later.', soon: true },
      {
        icon: Mail,
        name: 'Email digests',
        text: 'A weekly summary from the writers you follow.',
        soon: true,
      },
    ],
  },
];

const Groups = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['2xl']};
`;

const Group = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: ${({ theme }) => theme.spacing['2xl']};
  padding-top: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.lineSubtle};

  ${media.down('md')`
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  `}
`;

const GroupName = styled.h3`
  ${labelStyle('md')}
  color: ${({ theme }) => theme.colors.accentText};
  position: sticky;
  top: 96px;
  align-self: start;

  ${media.down('md')`position: static;`}
`;

const Items = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.xl};

  ${media.down('sm')`grid-template-columns: 1fr;`}
`;

const Item = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: flex-start;
`;

const Icon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme, $soon }) =>
    $soon ? theme.colors.surfaceContainer : theme.colors.accentContainer};
  color: ${({ theme, $soon }) => ($soon ? theme.colors.textMuted : theme.colors.accentText)};

  svg {
    width: 17px;
    height: 17px;
  }
`;

const Name = styled.p`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  ${text('md', 'semibold')}
  color: ${({ theme, $soon }) => ($soon ? theme.colors.textSecondary : theme.colors.textPrimary)};
`;

const Soon = styled.span`
  padding: 2px ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.surfaceContainerHigh};
  color: ${({ theme }) => theme.colors.textMuted};
  ${text('xs', 'medium')}
`;

const Text = styled.p`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 2px;
`;

export function FeatureGrid() {
  return (
    <Groups>
      {FEATURES.map((group) => (
        <Group key={group.group}>
          <GroupName>{group.group}</GroupName>
          <Items>
            {group.items.map(({ icon: ItemIcon, name, text: body, soon }) => (
              <Item key={name}>
                <Icon $soon={soon}>
                  <ItemIcon />
                </Icon>
                <div>
                  <Name $soon={soon}>
                    {name}
                    {soon && <Soon>Soon</Soon>}
                  </Name>
                  <Text>{body}</Text>
                </div>
              </Item>
            ))}
          </Items>
        </Group>
      ))}
    </Groups>
  );
}
