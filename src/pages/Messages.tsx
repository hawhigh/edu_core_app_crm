import { Search, Edit, MoreVertical, Send, Paperclip, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

export default function Messages() {
  const [activeChat, setActiveChat] = useState(1);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, sender: "Mr. Smith", text: "Hello John, how are you preparing for the math test?", time: "10:30 AM", isMe: false },
    { id: 2, sender: "Me", text: "Hi Mr. Smith! I'm reviewing chapter 4 right now.", time: "10:35 AM", isMe: true },
    { id: 3, sender: "Mr. Smith", text: "Great. Make sure to focus on quadratic equations.", time: "10:40 AM", isMe: false },
    { id: 4, sender: "Mr. Smith", text: "Don't forget the upcoming math test on Friday.", time: "10:42 AM", isMe: false },
  ]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const newId = messages.length + 1;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMessages([...messages, {
      id: newId,
      sender: "Me",
      text: newMessage,
      time: time,
      isMe: true
    }]);
    setNewMessage("");
  };

  const chats = [
    { id: 1, name: "Mr. Smith", role: "Math Teacher", lastMessage: "Don't forget the upcoming math test on Friday.", time: "10:42 AM", unread: 3, avatar: "MS", color: "bg-primary/10 text-primary" },
    { id: 2, name: "Dr. Jones", role: "Physics Teacher", lastMessage: "The lab report looks good, but please check the conclusion.", time: "Yesterday", unread: 0, avatar: "DJ", color: "bg-accent/10 text-accent" },
    { id: 3, name: "Ms. Davis", role: "Literature", lastMessage: "Please read chapters 4 and 5 for tomorrow.", time: "Mon", unread: 0, avatar: "MD", color: "bg-lime-100 text-lime-700" },
    { id: 4, name: "Class 10-A Parents", role: "Group", lastMessage: "Parent-teacher meeting scheduled for next week.", time: "Last Week", unread: 0, avatar: "10A", color: "bg-orange-100 text-orange-700" },
  ];

  return (
    <div 
      className="h-[calc(100vh-10rem)] flex gap-6"
    >
      {/* Chat List Sidebar */}
      <div className="w-full md:w-80 lg:w-96 bg-card border border-border rounded-3xl flex flex-col overflow-hidden shrink-0">
        <div className="p-6 border-b border-border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-text-dark">Messages</h2>
            <button className="w-10 h-10 rounded-full bg-bg flex items-center justify-center text-text-dark hover:bg-primary/10 hover:text-primary transition-colors">
              <Edit className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {chats.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all ${
                activeChat === chat.id ? "bg-primary/5 border border-primary/20" : "hover:bg-bg border border-transparent"
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shrink-0 ${chat.color}`}>
                {chat.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-sm text-text-dark truncate">{chat.name}</h3>
                  <span className="text-xs text-text-muted shrink-0">{chat.time}</span>
                </div>
                <p className="text-xs text-text-muted truncate">{chat.lastMessage}</p>
              </div>
              {chat.unread > 0 && (
                <div className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {chat.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Active Chat Area */}
      <div className="hidden md:flex flex-1 bg-card border border-border rounded-3xl flex-col overflow-hidden relative">
        {/* Chat Header */}
        <div className="h-20 border-b border-border px-6 flex items-center justify-between bg-card/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
              {chats.find(c => c.id === activeChat)?.avatar || "MS"}
            </div>
            <div>
              <h2 className="font-bold text-text-dark">{chats.find(c => c.id === activeChat)?.name || "Mr. Smith"}</h2>
              <p className="text-xs text-text-muted">{chats.find(c => c.id === activeChat)?.role || "Teacher"} • Online</p>
            </div>
          </div>
          <button className="p-2 text-text-muted hover:bg-bg rounded-xl transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-bg/30">
          <div className="text-center text-xs text-text-muted my-4">Today</div>
          
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col max-w-[75%] ${msg.isMe ? "self-end items-end" : "self-start items-start"}`}>
              <div className={`px-5 py-3 rounded-2xl ${
                msg.isMe 
                  ? "bg-primary text-white rounded-tr-sm shadow-md shadow-primary/10" 
                  : "bg-card border border-border text-text-dark rounded-tl-sm shadow-sm"
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
              <span className="text-[10px] text-text-muted mt-1.5 px-1">{msg.time}</span>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-card border-t border-border">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 bg-bg border border-border rounded-2xl p-2 focus-within:ring-2 focus-within:ring-primary/50 transition-all"
          >
            <button type="button" className="p-2 text-text-muted hover:text-primary transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            <button type="button" className="p-2 text-text-muted hover:text-primary transition-colors">
              <ImageIcon className="w-5 h-5" />
            </button>
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..." 
              className="flex-1 bg-transparent border-none focus:outline-none text-sm px-2"
            />
            <button 
              type="submit"
              className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
