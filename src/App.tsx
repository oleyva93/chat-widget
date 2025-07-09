import "@sendbird/uikit-react/dist/index.css";
import Chat from "./Chat";

function App() {
  const params = new URLSearchParams(window.location.search);
  const appId = params.get("appId");
  const userId = params.get("userId");
  const accessToken = params.get("accessToken");

  if (appId && userId && accessToken) {
    return <Chat appId={appId} userId={userId} accessToken={accessToken} />;
  }

  return (
    <div className="flex w-screen h-screen">
      <form
        className="flex w-full h-full flex-col gap-2 items-center justify-center"
        autoSave="on"
        unselectable="on"
      >
        <div className="bg-zinc-600 p-5 rounded-md">
          <div className="flex flex-col gap-2">
            <label htmlFor="appId">App ID</label>
            <input
              type="text"
              name="appId"
              className="border border-gray-300 rounded-md p-2 w-[385px]"
              autoComplete="on"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="accessToken">Access Token</label>
            <input
              type="text"
              name="accessToken"
              className="border border-gray-300 rounded-md p-2 w-[385px]"
              autoComplete="on"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="userId">User ID</label>
            <input
              type="text"
              name="userId"
              className="border border-gray-300 rounded-md p-2 w-[385px]"
              autoComplete="on"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md p-2 w-[385px] mt-5"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
