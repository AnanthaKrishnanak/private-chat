import { Message } from "@/schema";

interface MessageDisplayProps {
  messages: Message[] | undefined;
  currentUserName: string | null;
  isLoading: boolean;
}

const MessageDisplay = ({
  messages,
  currentUserName,
  isLoading,
}: MessageDisplayProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <div className="text-6xl">💬</div>
          <p className="text-zinc-400 text-lg">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (!messages?.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <div className="text-6xl">💬</div>
          <p className="text-zinc-400 text-lg">No messages yet</p>
          <p className="text-zinc-500 text-sm">Start the conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      {messages.map((message) => {
        const isCurrentUser = message.sender === currentUserName;

        return (
          <div
            key={message.id}
            className={`flex ${
              isCurrentUser ? "justify-end" : "justify-start"
            } animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div
              className={`flex flex-col max-w-[70%] ${
                isCurrentUser ? "items-end" : "items-start"
              }`}
            >
              <span className="text-xs text-zinc-500 mb-1.5 px-1 font-medium">
                {isCurrentUser ? "You" : message.sender}
              </span>

              <div
                className={`px-4 py-2.5 rounded-2xl shadow-sm ${
                  isCurrentUser
                    ? "bg-linear-to-br from-green-600 to-green-700 text-white rounded-br-md"
                    : "bg-zinc-800 text-zinc-100 rounded-bl-md border border-zinc-700/50"
                }`}
              >
                <p className="text-sm leading-relaxed wrap-break-word">
                  {message.text}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageDisplay;
