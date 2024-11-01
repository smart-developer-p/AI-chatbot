import {
  chatWithExistingConversation,
  newChat,
} from "@/services/dispatch/chat-dispatch";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addBotMessage,
  addUserMessage,
  setBotResponseLoading,
} from "@/store/slices/chatSlice";
import { Button, Textarea } from "@nextui-org/react";
import moment from "moment";
import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import { BsMic } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { MdOutlineAttachFile } from "react-icons/md";
import { RiBook2Line } from "react-icons/ri";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function ChatInput() {
  const { botResponseLoading ,currentTypingMessageId } = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    query: "",
    file: null as File | null,
  });
  const fileRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, query: e.target.value }));
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setForm((prev) => ({ ...prev, file }));
  };

  // Input key event
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        // Allow shift+enter to insert a new line (default behavior)
        return;
      } else {
        // Prevent default behavior and trigger custom function
        event.preventDefault();
        sendMessage();
      }
    }
  };

  const sendMessage = () => {
    if(currentTypingMessageId||botResponseLoading){
      return
    }
    dispatch(
      addUserMessage({
        role: "user",
        text: form.query,
        timestamp: moment().toISOString(),
      })
    );
    setForm({ query: "", file: null });

    // call chat api here
    const formdata = new FormData();
    formdata.append("query", form.query);
    formdata.append("file", form.file as Blob);

    dispatch(setBotResponseLoading(true));
    if (location.pathname === "/") {
      handleNewChat(formdata);
    } else {
      if (id) {
        handleExistingChat(formdata);
      }
    }
  };

  // message with existing chat
  const handleExistingChat = (formdata: FormData) => {
    chatWithExistingConversation({ conversationId: id!, formdata })
      .then((res) => {
        dispatch(
          addBotMessage({
            conversation_id: res?.conversation_id,
            message: {
              role: "model",
              text: res?.model_response,
              timestamp: moment().toISOString(),
            },
          })
        );
        dispatch(setBotResponseLoading(false));
      })
      .catch((err) => {
        console.log(err);
        dispatch(setBotResponseLoading(false));
      });
  };

  // Start New chat
  const handleNewChat = (formdata: FormData) => {
    newChat(formdata)
      .then((res) => {
        dispatch(
          addBotMessage({
            conversation_id: res?.conversation_id,
            message: {
              role: "model",
              text: res?.model_response,
              timestamp: moment().toISOString(),
            },
          })
        );
        navigate("/c/" + res?.conversation_id);
      })
      .catch((err) => {
        console.log(err);
        dispatch(setBotResponseLoading(false));
      });
  };

  return (
    <div className="w-full px-4 pb-4">
      <div className="flex gap-1 items-end ">
        <input
          type="file"
          ref={fileRef}
          className="hidden"
          onChange={handleFileSelect}
        />
        <Button isIconOnly variant="light">
          <RiBook2Line className="h-6 w-6" />
        </Button>
        <Button isIconOnly variant="light">
          <BsMic className="h-6 w-6" />
        </Button>
        <div className="flex flex-grow items-end gap-1 bg-default-100 rounded-md">
          <Textarea
            minRows={1}
            maxRows={9}
            placeholder="Press / Input"
            radius="sm"
            value={form.query}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
          />
          <Button
            isIconOnly
            variant="light"
            isDisabled={form.query.trim() === "" || !!currentTypingMessageId||botResponseLoading }
            onClick={sendMessage}
          >
            <IoMdSend className="h-6 w-6" />
          </Button>
        </div>
        <Button
          isIconOnly
          variant="light"
          onClick={() => fileRef.current?.click()}
        >
          <MdOutlineAttachFile className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
