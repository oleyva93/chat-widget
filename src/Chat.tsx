import "@sendbird/uikit-react/dist/index.css";

import { useState } from "react";
import Tabs from "./Tabs";
import Multiple from "./Multiple";
import MultipleChatsLegacy from "./Multiple-Legacy";

function Chat({
  appId,
  userId,
  accessToken,
}: {
  appId: string;
  userId: string;
  accessToken: string;
}) {
  const [activeTab, setActiveTab] = useState<"tabs" | "multiple" | "legacy">(
    "tabs"
  );

  return (
    <div className="flex w-screen h-screen">
      <div className="h-full bg-white border-r border-gray-200">
        <div
          className={`flex-1 flex flex-col text-black p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 ${
            activeTab === "tabs" ? "bg-gray-100" : ""
          }`}
          onClick={() => setActiveTab("tabs")}
        >
          Tabs
        </div>
        <div
          className={`flex-1 flex flex-col text-black p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 ${
            activeTab === "multiple" ? "bg-gray-100" : ""
          }`}
          onClick={() => {
            setActiveTab("multiple");
          }}
        >
          Multiple
        </div>
        <div
          className={`flex-1 flex flex-col text-black p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 ${
            activeTab === "legacy" ? "bg-gray-100" : ""
          }`}
          onClick={() => {
            setActiveTab("legacy");
          }}
        >
          Multiple
          <span className="text-xs text-gray-500">Legacy</span>
        </div>
        <div
          className={`flex-1 flex flex-col text-black p-2  cursor-pointer bg-red-500 text-white`}
          onClick={() => {
            window.location.href = "/";
          }}
        >
          Close
        </div>
      </div>

      {activeTab === "tabs" && (
        <Tabs appId={appId} userId={userId} accessToken={accessToken} />
      )}
      {activeTab === "multiple" && (
        <Multiple appId={appId} userId={userId} accessToken={accessToken} />
      )}
      {activeTab === "legacy" && (
        <MultipleChatsLegacy
          appId={appId}
          userId={userId}
          accessToken={accessToken}
        />
      )}
    </div>
  );
}

export default Chat;
