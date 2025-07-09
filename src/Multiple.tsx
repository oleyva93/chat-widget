import "@sendbird/uikit-react/dist/index.css";

import ChannelSettings from "@sendbird/uikit-react/ChannelSettings";
import ChannelProfile from "@sendbird/uikit-react/ChannelSettings/components/ChannelProfile";
import ChannelSettingMenuList from "@sendbird/uikit-react/ChannelSettings/components/ChannelSettingMenuList";
import GroupChannel from "@sendbird/uikit-react/GroupChannel";
import GroupChannelList from "@sendbird/uikit-react/GroupChannelList";

import GroupChannelListHeader from "@sendbird/uikit-react/GroupChannelList/components/GroupChannelListHeader";
import SendbirdProvider from "@sendbird/uikit-react/SendbirdProvider";
import Header from "@sendbird/uikit-react/ui/Header";
import MessageContent from "@sendbird/uikit-react/ui/MessageContent";
import { MessageMenu } from "@sendbird/uikit-react/ui/MessageMenu";
import UserListItem from "@sendbird/uikit-react/ui/UserListItem";
import UserProfile from "@sendbird/uikit-react/ui/UserProfile";
import { useState } from "react";

const GroupChannelPage = ({ channelUrl }: { channelUrl: string }) => {
  const [showChannelSettings, setShowChannelSettings] =
    useState<boolean>(false);
  return (
    <div className="w-full h-full relative">
      <GroupChannel
        channelUrl={channelUrl}
        onChatHeaderActionClick={() => {
          setShowChannelSettings((prev) => !prev);
        }}
        renderMessageContent={(props) => (
          <MessageContent
            {...props}
            renderMessageMenu={(menuProps) => <MessageMenu {...menuProps} />}
          />
        )}
      />
      {showChannelSettings && (
        <div className="absolute top-0 right-0 w-full h-full bg-black/50 flex justify-end">
          <ChannelSettingsPage
            channelUrl={channelUrl}
            onClose={() => setShowChannelSettings(false)}
          />
        </div>
      )}
    </div>
  );
};

const ChannelListPage = ({
  onChannelSelect,
}: {
  onChannelSelect: (channel: typeof GroupChannel) => void;
}) => {
  return (
    <GroupChannelList
      disableAutoSelect
      onChannelSelect={(channel) => {
        if (!channel) return;
        console.log("channel", channel);
        onChannelSelect(channel);
      }}
      onChannelCreated={(channel) => {
        // handle on channel created
      }}
      renderHeader={(channel) => (
        <GroupChannelListHeader
          // Render nothing to hide the button.
          renderLeft={() => <></>}
          // Change the header text string.
          renderMiddle={() => <Header.Title title={"Chat"} />}
          // Change the right-top corner button.
        />
      )}
    />
  );
};

function Multiple({
  appId,
  userId,
  accessToken,
}: {
  appId: string;
  userId: string;
  accessToken: string;
}) {
  const [channels, setChannels] = useState<(typeof GroupChannel)[]>([]);

  function handleChannelSelect(channel: typeof GroupChannel) {
    if (channels.find((c) => c.url === channel.url)) return;
    setChannels((prev) => [...prev, channel]);
  }

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex" }}>
      <SendbirdProvider
        appId={appId}
        userId={userId}
        accessToken={accessToken} // Optional, but recommended
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
        <div className="flex ">
          <ChannelListPage onChannelSelect={handleChannelSelect} />
        </div>
        <div className="flex-1 flex flex-row flex-wrap gap-4">
          {channels.map((channel) => (
            <div className="w-[450px] h-[600px]" key={channel.url}>
              <GroupChannelPage channelUrl={channel.url} />
            </div>
          ))}
        </div>
      </SendbirdProvider>
    </div>
  );
}

export default Multiple;

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
      renderUserListItem={(props) => {
        return <UserListItem {...props} renderListItemMenu={() => <></>} />;
      }}
      renderModerationPanel={(props) => {
        return (
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
        );
      }}
      renderHeader={() => (
        <Header
          renderMiddle={() => <Header.Title title="Information" />}
          renderRight={() => (
            <Header.IconButton
              type="CLOSE"
              color="BACKGROUND_3"
              renderIcon={(props) => (
                <Header.Icon {...props} width="24px" height="24px" />
              )}
              onClick={onClose}
            />
          )}
        />
      )}
      renderChannelProfile={() => <ChannelProfile />}
    />
  );
};
