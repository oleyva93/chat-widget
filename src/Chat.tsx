import "@sendbird/uikit-react/dist/index.css";

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
  const params = new URLSearchParams(window.location.search);
  const tab = params.get("tab") || "tabs";

  return (
    <div className="flex w-screen h-screen">
      <div className="h-full bg-white border-r border-gray-200">
        <div
          className={`flex-1 flex flex-col text-black p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 ${
            tab === "tabs" ? "bg-gray-100" : ""
          }`}
          onClick={() => {
            window.location.href =
              "/?tab=tabs&appId=" +
              appId +
              "&userId=" +
              userId +
              "&accessToken=" +
              accessToken;
          }}
        >
          Tabs
        </div>
        <div
          className={`flex-1 flex flex-col text-black p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 ${
            tab === "multiple" ? "bg-gray-100" : ""
          }`}
          onClick={() => {
            window.location.href =
              "/?tab=multiple&appId=" +
              appId +
              "&userId=" +
              userId +
              "&accessToken=" +
              accessToken;
          }}
        >
          Multiple
        </div>
        <div
          className={`flex-1 flex flex-col text-black p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 ${
            tab === "legacy" ? "bg-gray-100" : ""
          }`}
          onClick={() => {
            window.location.href =
              "/?tab=legacy&appId=" +
              appId +
              "&userId=" +
              userId +
              "&accessToken=" +
              accessToken;
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

      {tab === "tabs" && (
        <Tabs appId={appId} userId={userId} accessToken={accessToken} />
      )}
      {tab === "multiple" && (
        <Multiple appId={appId} userId={userId} accessToken={accessToken} />
      )}
      {tab === "legacy" && (
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
