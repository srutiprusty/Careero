import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon } from "lucide-react";
import { motion } from "framer-motion";
import { CHAT_API_END_POINT } from "@/utils/constant";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const messagesRef = useRef(null);
  const [unread, setUnread] = useState(false);

  const [role, setRole] = useState(null); // "student" | "recruiter"
  const [initialized, setInitialized] = useState(false);

  /* ------------------ SEND MESSAGE ------------------ */
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");

    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);

    // Detect role from first response
    let detectedRole = role;
    if (!role) {
      if (userMessage.toLowerCase().includes("student"))
        detectedRole = "student";
      if (userMessage.toLowerCase().includes("recruiter"))
        detectedRole = "recruiter";
      if (detectedRole) setRole(detectedRole);
    }

    const res = await fetch(CHAT_API_END_POINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMessage,
        role: detectedRole,
      }),
    });

    const data = await res.json();
    setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
  };

  /* ------------------ INITIAL GREETING ------------------ */
  useEffect(() => {
    if (open && !initialized) {
      fetch(CHAT_API_END_POINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFirstMessage: true }),
      })
        .then((res) => res.json())
        .then((data) => {
          setMessages([{ role: "bot", text: data.reply }]);
          setInitialized(true);
        });
    }
  }, [open, initialized]);

  /* ------------------ AUTO SCROLL ------------------ */
  useEffect(() => {
    if (!open) return;
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, open]);

  /* ------------------ UNREAD DOT ------------------ */
  useEffect(() => {
    if (!open && messages.length > 0) setUnread(true);
  }, [messages, open]);

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end ">
      {/* Chat Button */}

      {!open &&(

      <div className="relative">
        <div
          className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-700 to-purple-900 text-white flex items-center justify-center shadow-lg cursor-pointer"
          onClick={() => {
            setOpen((v) => {
              const nv = !v;
              if (nv) setUnread(false);
              return nv;
            });
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
          >
            <rect x="5" y="6" width="14" height="14" rx="3" fill="white" />
            <circle cx="12" cy="3" r="1.5" fill="white" />
            <line
              x1="12"
              y1="4.5"
              x2="12"
              y2="6"
              stroke="white"
              strokeWidth="2"
            />
            <circle cx="9" cy="11" r="1.5" fill="#7C3AED" />
            <circle cx="15" cy="11" r="1.5" fill="#7C3AED" />
            <path
              d="M8 15h8"
              stroke="#7C3AED"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <rect x="2" y="12" width="2" height="3" rx="1" fill="white" />
            <rect x="20" y="12" width="2" height="3" rx="1" fill="white" />
          </svg>
        </div>
        {unread && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full ring-2 ring-white" />
        )}
      </div>
      )}

      {/* Chat Window */}
      {open && (
        <div className="mt-2 w-80 max-w-[92vw] h-[420px] rounded-xl shadow-xl flex flex-col overflow-hidden bg-gradient-to-r from-purple-700 to-purple-900 ">
          {/* Header */}
          <div className="px-4 py-2 bg-gradient-to-r from-purple-700 to-purple-900 text-white font-semibold flex justify-between">
            <div>careero Assistant</div>
            <button onClick={() => setOpen(false)}>×</button>
          </div>

          {/* Messages */}
          <div
            ref={messagesRef}
            className="px-3 py-2 flex-1 overflow-y-auto color-scrollbar bg-purple-950 "
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`mb-2 flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-2 rounded-lg max-w-[80%] text-sm ${
                    m.role === "user"
                      ? "bg-purple-100 text-purple-900"
                      : "bg-white border text-gray-900"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="px-3 py-2 border-t flex gap-2 bg-purple">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about jobs, resumes, interviews..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 px-3 py-2 border rounded-full text-sm"
            />
            <button
              onClick={sendMessage}
              className="  font-bold rounded-full text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="color-purple ml-1 rotate-45" // Tailwind rotate class
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                initial={{ x: 0 }}
                animate={{ x: 5 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 0.8,
                  ease: "easeInOut",
                }}
              >
                <path
                  d="M14.2199 21.9352C13.0399 21.9352 11.3699 21.1052 10.0499 17.1352L9.32988 14.9752L7.16988 14.2552C3.20988 12.9352 2.37988 11.2652 2.37988 10.0852C2.37988 8.91525 3.20988 7.23525 7.16988 5.90525L15.6599 3.07525C17.7799 2.36525 19.5499 2.57525 20.6399 3.65525C21.7299 4.73525 21.9399 6.51525 21.2299 8.63525L18.3999 17.1252C17.0699 21.1052 15.3999 21.9352 14.2199 21.9352Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
