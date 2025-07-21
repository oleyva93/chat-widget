import "@sendbird/uikit-react/dist/index.css";
import React, { useState } from "react";
import SendbirdProvider from "@sendbird/uikit-react/SendbirdProvider";
import { GroupChannelList } from "@sendbird/uikit-react/GroupChannelList";
import GroupChannel from "@sendbird/uikit-react/GroupChannel";
import ChannelSettings from "@sendbird/uikit-react/ChannelSettings";
import Header from "@sendbird/uikit-react/ui/Header";
import UserProfile from "@sendbird/uikit-react/ui/UserProfile";
import UserListItem from "@sendbird/uikit-react/ui/UserListItem";
import ChannelSettingMenuList from "@sendbird/uikit-react/ChannelSettings/components/ChannelSettingMenuList";
import GroupChannelListHeader from "@sendbird/uikit-react/GroupChannelList/components/GroupChannelListHeader";
import { ChannelProvider } from "@sendbird/uikit-react/Channel/context";
import { GroupChannelProvider } from "@sendbird/uikit-react/GroupChannel/context";

interface MultipleChatsProps {
  appId: string;
  userId: string;
  accessToken?: string;
}
interface ChannelEntry {
  url: string;
  name: string;
  key: string;
}

const ChannelListPage: React.FC<{
  channelSelected: string | null;
  onChannelSelect: (url: string, name: string) => void;
}> = ({ channelSelected, onChannelSelect }) => (
  <GroupChannelProvider channelUrl={channelSelected}>
    <GroupChannelList
      disableAutoSelect
      onChannelCreated={() => {}}
      onChannelSelect={(c) => c && onChannelSelect(c.url, c.name)}
      renderHeader={() => (
        <GroupChannelListHeader
          renderLeft={() => <></>}
          renderMiddle={() => <Header.Title title="Chats" />}
        />
      )}
    />
  </GroupChannelProvider>
);

const ChatWindow: React.FC<{ entry: ChannelEntry }> = ({ entry }) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="relative w-[450px] h-[600px] border">
      <GroupChannelProvider channelUrl={entry.url} key={entry.key}>
        <GroupChannel
          key={entry.key}
          channelUrl={entry.url}
          onChatHeaderActionClick={() => setShowSettings((prev) => !prev)}
        />
        {showSettings && (
          <div className="absolute inset-0 bg-black/50 flex justify-end">
            <ChannelSettings
              channelUrl={entry.url}
              renderHeader={() => (
                <Header
                  renderMiddle={() => <Header.Title title="Settings" />}
                  renderRight={() => (
                    <Header.IconButton
                      type="CLOSE"
                      color="BACKGROUND_3"
                      onClick={() => setShowSettings(false)}
                      renderIcon={(p) => (
                        <Header.Icon {...p} width="24px" height="24px" />
                      )}
                    />
                  )}
                />
              )}
              renderUserProfile={(p) => <UserProfile {...p} disableMessaging />}
              renderUserListItem={(p) => (
                <UserListItem {...p} renderListItemMenu={() => <></>} />
              )}
              renderModerationPanel={(p) => (
                <ChannelSettingMenuList
                  {...p}
                  menuItems={{
                    ...p.menuItems,
                    operator: {
                      ...p.menuItems.operator,
                      bannedUsers: {
                        ...p.menuItems.operator.bannedUsers,
                        hideMenu: true,
                      },
                      mutedUsers: {
                        ...p.menuItems.operator.mutedUsers,
                        hideMenu: true,
                      },
                      freezeChannel: {
                        ...p.menuItems.operator.freezeChannel,
                        hideMenu: true,
                      },
                    },
                  }}
                />
              )}
            />
          </div>
        )}
      </GroupChannelProvider>
    </div>
  );
};

const MultipleChats: React.FC<MultipleChatsProps> = ({
  appId,
  userId,
  accessToken,
}) => {
  const [channelSelected, setChannelSelected] = useState<string | null>(null);
  const [channels, setChannels] = useState<ChannelEntry[]>([]);

  const addTab = (url: string, name: string) => {
    setChannelSelected(url);
    setChannels((prev) => {
      if (prev.find((t) => t.url === url)) return prev;
      return [...prev, { url, name, key: `${url}-${Date.now()}` }];
    });
  };

  return (
    <SendbirdProvider
      appId={appId}
      userId={userId}
      accessToken={accessToken}
      sdkInitParams={{
        appStateToggleEnabled: true,
      }}
      uikitOptions={{
        groupChannelList: {
          enableMessageReceiptStatus: true,
          enableTypingIndicator: true,
        },
        groupChannel: { enableMention: true },
      }}
    >
      <div className="flex h-screen">
        <div className="w-80 border-r">
          <ChannelListPage
            onChannelSelect={addTab}
            channelSelected={channelSelected}
          />
        </div>
        <div className="flex-1 p-4 flex flex-wrap gap-4 overflow-auto">
          {channels.map((entry) => (
            <ChatWindow key={entry.key} entry={entry} />
          ))}
        </div>
      </div>
    </SendbirdProvider>
  );
};

export default MultipleChats;
