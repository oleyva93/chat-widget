import "@sendbird/uikit-react/dist/index.css";
import SendbirdProvider from "@sendbird/uikit-react/SendbirdProvider";
import GroupChannel from "@sendbird/uikit-react/GroupChannel";
import GroupChannelList from "@sendbird/uikit-react/GroupChannelList";

import Header from "@sendbird/uikit-react/ui/Header";
import GroupChannelListHeader from "@sendbird/uikit-react/GroupChannelList/components/GroupChannelListHeader";
import MessageContent from "@sendbird/uikit-react/ui/MessageContent";
import { MessageMenu } from "@sendbird/uikit-react/ui/MessageMenu";
import ChannelSettings from "@sendbird/uikit-react/ChannelSettings";
import ChannelSettingMenuList from "@sendbird/uikit-react/ChannelSettings/components/ChannelSettingMenuList";
import ChannelProfile from "@sendbird/uikit-react/ChannelSettings/components/ChannelProfile";
import UserListItem from "@sendbird/uikit-react/ui/UserListItem";
import UserProfile from "@sendbird/uikit-react/ui/UserProfile";

import { useState } from "react";
import type { GroupChannel as GroupChannelType } from "@sendbird/chat/groupChannel";

// const APP_ID = "3CCEC8CF-D8FD-447B-88E2-91294429F5D2";
// const USER_ID = "raul.alvarez@lighthousetech.io";
// const ACCESS_TOKEN = "17988c71572759d0e917446c48c8517b3eb8a5ef";

function Tabs({
  appId,
  userId,
  accessToken,
}: {
  appId: string;
  userId: string;
  accessToken: string;
}) {
  const [openChannels, setOpenChannels] = useState<GroupChannelType[]>([]);
  const [activeChannelUrl, setActiveChannelUrl] = useState<string | null>(null);

  function handleChannelSelect(channel: GroupChannelType) {
    if (!openChannels.find((c) => c.url === channel.url)) {
      setOpenChannels((prev) => [...prev, channel]);
    }
    setActiveChannelUrl(channel.url);
  }

  function handleCloseTab(channelUrl: string) {
    setOpenChannels((prev) => prev.filter((c) => c.url !== channelUrl));
    if (activeChannelUrl === channelUrl) {
      const remaining = openChannels.filter((c) => c.url !== channelUrl);
      setActiveChannelUrl(remaining[0]?.url ?? null);
    }
  }

  const activeChannel = openChannels.find((c) => c.url === activeChannelUrl);

  return (
    <SendbirdProvider
      appId={appId}
      userId={userId}
      accessToken={accessToken}
      uikitOptions={{
        groupChannelList: {
          enableMessageReceiptStatus: true,
          enableTypingIndicator: true,
        },
        groupChannel: {
          enableMention: true,
        },
      }}
    >
      <GroupChannelList
        disableAutoSelect
        selectedChannelUrl={activeChannelUrl ?? undefined}
        onChannelSelect={handleChannelSelect}
        onChannelCreated={() => {
          console.log("channel created");
        }}
        renderHeader={() => (
          <GroupChannelListHeader
            renderLeft={() => <></>}
            renderMiddle={() => <Header.Title title="Chats" />}
          />
        )}
      />

      <div className="flex-1 flex flex-col">
        {/* Tabs de canales abiertos */}
        <div className="flex gap-1 bg-white border-l border-gray-200">
          {openChannels.map((channel) => (
            <div
              key={channel.url}
              className={`px-4 py-[19.4px] cursor-pointer border-l flex items-center gap-2 ${
                channel.url !== activeChannelUrl ? "bg-white" : "bg-gray-200"
              }`}
              onClick={() => setActiveChannelUrl(channel.url)}
            >
              <div className="text-black truncate overflow-hidden w-48">
                {channel.name || "Channel"}
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseTab(channel.url);
                }}
                className="bg-gray-400 rounded-full w-4 h-4 flex items-center justify-center p-2 text-xs"
              >
                X
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 relative">
          {activeChannel && (
            <GroupChannelPage
              key={activeChannel.url}
              channelUrl={activeChannel.url}
            />
          )}
        </div>
      </div>
    </SendbirdProvider>
  );
}

export default Tabs;

const GroupChannelPage = ({ channelUrl }: { channelUrl: string }) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="w-full h-full relative">
      <GroupChannel
        channelUrl={channelUrl}
        key={channelUrl}
        onChatHeaderActionClick={() => setShowSettings(true)}
        renderMessageContent={(props) => (
          <MessageContent
            {...props}
            renderMessageMenu={(menuProps) => <MessageMenu {...menuProps} />}
          />
        )}
      />
      {showSettings && (
        <div className="absolute top-0 right-0 w-full h-full bg-black/50 flex justify-end">
          <ChannelSettingsPage
            channelUrl={channelUrl}
            onClose={() => setShowSettings(false)}
          />
        </div>
      )}
    </div>
  );
};

const ChannelSettingsPage = ({
  channelUrl,
  onClose,
}: {
  channelUrl: string;
  onClose: () => void;
}) => {
  return (
    <ChannelSettings
      channelUrl={channelUrl}
      renderUserProfile={(props) => <UserProfile {...props} disableMessaging />}
      renderLeaveChannel={() => <></>}
      renderUserListItem={(props) => (
        <UserListItem {...props} renderListItemMenu={() => <></>} />
      )}
      renderModerationPanel={(props) => (
        <ChannelSettingMenuList
          {...props}
          menuItems={{
            ...props.menuItems,
            operator: {
              ...props.menuItems.operator,
              bannedUsers: {
                ...props.menuItems.operator.bannedUsers,
                hideMenu: true,
              },
              mutedUsers: {
                ...props.menuItems.operator.mutedUsers,
                hideMenu: true,
              },
              freezeChannel: {
                ...props.menuItems.operator.freezeChannel,
                hideMenu: true,
              },
            },
          }}
        />
      )}
      renderHeader={() => (
        <Header
          renderMiddle={() => <Header.Title title="Settings" />}
          renderRight={() => (
            <Header.IconButton
              type="CLOSE"
              onClick={onClose}
              renderIcon={(props) => (
                <Header.Icon {...props} width="24px" height="24px" />
              )}
            />
          )}
        />
      )}
      renderChannelProfile={() => <ChannelProfile />}
    />
  );
};
