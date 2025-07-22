import "@sendbird/uikit-react/dist/index.css";
import GroupChannel from "@sendbird/uikit-react/GroupChannel";
import { GroupChannelList } from "@sendbird/uikit-react/GroupChannelList";
import SendbirdProvider from "@sendbird/uikit-react/SendbirdProvider";
import React, { useState } from "react";

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

const MultipleChats: React.FC<MultipleChatsProps> = ({
  appId,
  userId,
  accessToken,
}) => {
  const [channels, setChannels] = useState<ChannelEntry[]>([]);

  const handleSelection = (url: string, name: string) => {
    setChannels((prev) => {
      if (prev.find((t) => t.url === url)) return prev;
      return [...prev, { url, name, key: `${url}-${Date.now()}` }];
    });
  };

  return (
    <div className="flex h-screen">
      <SendbirdProvider
        appId={appId}
        userId={userId}
        accessToken={accessToken}
        sdkInitParams={{
          appStateToggleEnabled: false,
        }}
      >
        <div className="w-80 border-r">
          <GroupChannelList
            disableAutoSelect
            onChannelCreated={() => {}}
            onChannelSelect={(c) => c && handleSelection(c.url, c.name)}
          />
        </div>
      </SendbirdProvider>

      <div className="flex-1 p-4 flex flex-wrap gap-4 overflow-auto">
        {channels.map((entry) => (
          <SendbirdProvider
            key={entry.key}
            appId={appId}
            userId={userId}
            accessToken={accessToken}
            sdkInitParams={{
              appStateToggleEnabled: false,
            }}
          >
            <div
              className="relative w-[450px] h-[600px] border"
              key={entry.key}
            >
              <GroupChannel key={entry.key} channelUrl={entry.url} />
            </div>
          </SendbirdProvider>
        ))}
      </div>
    </div>
  );
};

export default MultipleChats;
