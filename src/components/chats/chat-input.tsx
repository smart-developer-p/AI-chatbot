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
import { Button, Input, Popover, PopoverContent, PopoverTrigger, Tab, Tabs, Textarea } from "@nextui-org/react";
import moment from "moment";
import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import { BsMic } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { MdOutlineAttachFile } from "react-icons/md";
import { RiBook2Line } from "react-icons/ri";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CustomModal from "../customModal";
import { AiOutlineArrowRight, AiOutlinePlus } from "react-icons/ai";

export default function ChatInput() {
  const { botResponseLoading, currentTypingMessageId } = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [modalVisible,setModalVisible]=useState(false)

  const [currentTab,setCurrentTab]=useState(1)


  const [TooltipOpen,setTooltipOpen]=useState('')

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
    console.log({
      currentTypingMessageId,
      botResponseLoading
    })
    if (currentTypingMessageId || botResponseLoading ) {
      setTooltipOpen('Cerina is typing, please wait')
      return
    }else if( form.query === ''){
      setTooltipOpen('Please input text')
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


    if (form.query.toLowerCase().includes('search')) {

      dispatch(setBotResponseLoading('Searching'));
    } else {
      dispatch(setBotResponseLoading('Analyzing'));

    }

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

  // Start New chat
  const handleNewChat = (formdata: FormData) => {
    newChat(formdata)
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
        <Button isIconOnly variant="light" onClick={()=>setModalVisible(true)}>
          <RiBook2Line className="h-6 w-6" />
        </Button>
        <Button isIconOnly variant="light">
          <BsMic className="h-6 w-6" />
        </Button>
        <div className="flex flex-grow items-end gap-1 bg-default-100 rounded-md">
       
          
          <Textarea
            minRows={1}
            autoFocus
            maxRows={9}
            placeholder="Press / Input"
            
            value={form.query}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
          />
       
          <Popover onClose={()=>setTooltipOpen('')} placement='top-end' isOpen={(!!TooltipOpen)} >
            <PopoverTrigger >
            <Button
              isIconOnly
              variant="light"
              className="rounded-l-none"
              // isDisabled={form.query.trim() === "" || !!currentTypingMessageId || (!!botResponseLoading)}
              onClick={sendMessage}
            >
              <IoMdSend className="h-6 w-6" />
            </Button>
            </PopoverTrigger>
            <PopoverContent  >
              <div className="px-1 py-2">
                {TooltipOpen}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <Button
          isIconOnly
          variant="light"
          onClick={() => fileRef.current?.click()}
        >
          <MdOutlineAttachFile className="h-6 w-6" />
        </Button>
      </div>
      <CustomModal isOpen={modalVisible}  onClose={()=>setModalVisible(false)} >
        <div className=" text-center">
        <h2 className="text-2xl font-bold"> Prompt Library</h2>
        Prompts are message templates that you can quickly fill in the chat input. Some prompts come with variables.
        </div>
        <Tabs 
        aria-label="Options" 
        color="primary" 
        variant="underlined"
        className="w-full px-8 "
        onSelectionChange={(key)=> {
          setCurrentTab(key as number)}}
        classNames={{
          tabList: "gap-6 w-full flex justify-between relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-[#3CFF00]",
          tab: "max-w-fit px-8 h-12 w-1/2",
          tabContent: "group-data-[selected=true]:text-[#3CFF00]"
        }}
      >
        <Tab
          key={1}
          
          title={
            <div className="flex items-center space-x-2">
              <span>Your Prompts</span>
            </div>
          }
        />
        <Tab
        
          key={2}
          title={
            <div className="flex items-center space-x-2">
              <span>Community Prompts</span>
            </div>
          }
        />
        
      </Tabs>
      { currentTab==1? <div><div className="flex flex-grow gap-0 rounded-md items-center mt-6">
        <Input placeholder="Search your Prompts" autoFocus/>
        <div className="flex whitespace-nowrap items-center px-2 text-sm" ><AiOutlinePlus/> Add Prompts</div>
      </div>
      <div className="flex flex-grow gap-0 rounded-md items-center mt-6">

      <Input placeholder="Search your Propmts"/>
      </div>
      <div className="flex flex-grow gap-0 rounded-md items-center mt-6">
      <div className="p-4 border-dashed border-2 w-full text-center dark:border-gray-200 border-gray-800 ">You have no saved prompts. Tap “Add Prompt” to add new Prompts </div>
      </div>      </div>:
      <div>
        <div className=" rounded-md items-center mt-6">
        <Input placeholder="Search your Prompts" autoFocus />
        <div>

         {[...Array(5)].map((v,i)=><div key={i} className="max-sm:block flex my-4 p-4 border-2 items-center border-gray-500 dark:border-white rounded-lg  gap-2  justify-between ">

            <div>
              <div className=" text-2xl font-bold">
              Fix Grammar Errors
              </div>
              <div className="text-sm w-3/4  whitespace-break-spaces break-words">
              Fix grammar errors in the text
              Source: Tony Dinh
              </div>
            </div>
            <div className=" md:block   flex gap-1 mt-2" >
              <Button className="font-bold m-1 "    >
                Use <AiOutlineArrowRight/>
              </Button>
              <Button className="font-bold m-1">
                Add <AiOutlinePlus/>
              </Button>
            </div>
         </div>)}
        </div>
        </div>
      </div>

      }
      
      </CustomModal>
    </div>
  );
}
