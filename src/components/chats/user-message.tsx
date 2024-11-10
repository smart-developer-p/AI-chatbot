import { chatWithExistingConversation } from "@/services/dispatch/chat-dispatch";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addBotMessage, addUserMessage, Message, setBotResponseLoading } from "@/store/slices/chatSlice";
import { Button, Textarea } from "@nextui-org/react";
import moment from "moment";
import { ChangeEvent, useState, KeyboardEvent } from "react";
import { MdModeEditOutline } from "react-icons/md";
import { useParams } from "react-router-dom";

type P = {
  message: Message;
};
export default function UserMessage(props: P) {
  const { message } = props;
  const [buttonVis, setButtonVis] = useState(false)
  const [editing, setEditing] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const { botResponseLoading, currentTypingMessageId } = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();

  const { id } = useParams();


  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  };


  // Input key event
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        return;
      } else {
        // sendMessage();
      }
    }
  };


  const handleSend = () => { 
    setEditing(false)
    setButtonVis(false)
      if (currentTypingMessageId || botResponseLoading) {
        console.log('Cerina is typing, please wait');
        return;
      } else if (inputValue === '') {
        console.log('Please input text');
        return;
      }
  
      dispatch(
        addUserMessage({
          role: "user",
          text: inputValue,
          timestamp: moment().toISOString(),
        })
      );
  
  
      // Call chat API here
      const formdata = new FormData();
      formdata.append("query", inputValue);
      formdata.append("file", (null as File|null) as Blob);
  
      if (inputValue.toLowerCase().includes('search')) {
        dispatch(setBotResponseLoading('Searching'));
      } else {
        dispatch(setBotResponseLoading('Analyzing'));
      }
          handleExistingChat(formdata);
   }

   const handleExistingChat = (formdata: FormData) => {
    chatWithExistingConversation({ conversationId: id!, formdata })
      .then((res) => {
        console.log(res)
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
        dispatch(setBotResponseLoading(''));
      })
      .catch((err) => {
        console.log(err);
        dispatch(setBotResponseLoading(''));
      });
  };

  return (
    <>
      {editing ? <div
      className="  h-auto"
        >
        <Textarea

          minRows={1}
          autoFocus
          maxRows={9}
          placeholder="Press / Input"
          className="w-full  "
          value={inputValue}
          color='default'

          classNames={{
            'inputWrapper': 'bg-default-400 focus:outline-none ',
            input: 'focus:bg-default-400 focus:outline-none'
          }}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}

        />
        <div className="flex mt-4 gap-2  float-right" >

          <Button size="sm" onClick={() => {
          setEditing(false)
          setButtonVis(false)
        }}   >Cancel</Button>
          <Button size="sm" onClick={handleSend}   >Send</Button>
        </div>
      </div> : <div onMouseEnter={() => setButtonVis(true)} onMouseLeave={() => setButtonVis(false)} className=" relative text-right max-w-full   py-2 px-3 bg-default w-fit self-end rounded-lg break-words">

        <p className=" text-left   break-words" dangerouslySetInnerHTML={{ __html: message.text.replace(/\n/g, '<br/>') }} >
        </p>
        <Button onClick={() => {
          setEditing(true)
          setInputValue(message.text)
        }} size="sm" isIconOnly className={`${buttonVis ? '  visible ' : ' invisible'} absolute bg-default-400  right-0 bottom-0`} >

          <MdModeEditOutline className={`  w-5 h-5`} />
        </Button>

      </div>}
    </>
  );
}
