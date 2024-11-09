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
import { Button, Input, Popover, PopoverContent, PopoverTrigger, Tab, Tabs, Textarea, Tooltip } from "@nextui-org/react";
import moment from "moment";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { BsMic, BsStopFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { MdDeleteOutline, MdOutlineAttachFile } from "react-icons/md";
import { RiBook2Line } from "react-icons/ri";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CustomModal from "../customModal";
import { AiOutlineArrowRight,  AiOutlinePlus } from "react-icons/ai";
import { TiArrowRightOutline } from "react-icons/ti";
import { useSpeechToText } from "@/hooks/use-speech2text";

export default function ChatInput() {
  const { botResponseLoading, currentTypingMessageId } = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false)

  const [currentTab, setCurrentTab] = useState(1)


  const [TooltipOpen, setTooltipOpen] = useState('')

  const {  transcript, isListening, isLoading, toggleListening  }= useSpeechToText()



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


  const sendMessage = (messageToSend: string = form.query) => {
    console.log({
      currentTypingMessageId,
      botResponseLoading
    });

    if (currentTypingMessageId || botResponseLoading) {
      setTooltipOpen('Cerina is typing, please wait');
      return;
    } else if (messageToSend === '') {
      setTooltipOpen('Please input text');
      return;
    }

    dispatch(
      addUserMessage({
        role: "user",
        text: messageToSend,
        timestamp: moment().toISOString(),
      })
    );

    setForm({ query: "", file: null });

    // Call chat API here
    const formdata = new FormData();
    formdata.append("query", messageToSend);
    formdata.append("file", form.file as Blob);

    if (messageToSend.toLowerCase().includes('search')) {
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


  const [promptValue, setPromptValue] = useState('')
  const [prompts, setPrompts] = useState<string[]>([])
  const [promptSearchKey, setPromptSearchKey] = useState('')
  const [Community_prompts, setCommunity_Prompts] = useState([
    {
      name: 'Fix grammar Error',
      content: 'Fix grammar errors in the text. Source: Tony Dinh'
    },
    {
      name: 'Fix grammar Error',
      content: 'Fix grammar errors in the text. Source:Alpha Star'
    },
    {
      name: 'Fix grammar Error',
      content: 'Fix grammar errors in the text. Source:Ahammed Danish'
    }
  ])
  const [Community_promptSearchKey, setCommunity_PromptSearchKey] = useState('')
  const handlePromptAdd = (value:string=promptValue) => {
    if (prompts.includes(value) || value === '') {
      setPromptValue('')
      return
    }
    setPrompts([value, ...prompts])
    setPromptValue('')
    localStorage.setItem('prompts', JSON.stringify([value, ...prompts]))
  }
  const handlePromptDelete = (value: string) => {
    const tt = prompts.filter(val => val !== value)
    setPrompts(tt)
    localStorage.setItem('prompts', JSON.stringify(tt))
  }

  useEffect(() => {
    const prompts = localStorage.getItem('prompts')

    if (prompts) {
      setPrompts(JSON.parse(prompts))
    }

  }, [])

  const handleUsePrompt = (value: string) => {
    if (value) {
      const newMessage = `I am sharing a prompt template with you! You need to act according to it.\n\n Here is the template.\n\n ${value}`;
      setModalVisible(false);

      // Update the form state and pass newMessage to sendMessage directly
      setForm((prev) => ({
        ...prev,
        query: newMessage,
      }));
      sendMessage(newMessage);
    }
  };

  useEffect(()=>{
    console.log(transcript)
    setForm((prev) => ({ ...prev, query:transcript }));
  },[transcript])

  return (
    <div className="w-full px-4 pb-4">
      <div className="flex gap-1 items-end ">
        <input
          type="file"
          ref={fileRef}
          className="hidden"
          onChange={handleFileSelect}
        />
        <Button isIconOnly   variant="light" onClick={() => setModalVisible(true)}>
          <RiBook2Line className="h-6 w-6" />
        </Button>
        <Button isLoading={isLoading} onClick={toggleListening} className={`${isListening?' animate-[pulse_1s_ease-in-out_infinite]  rounded-full bg-success-500  hover:bg-success-500 active:bg-success-500  ':' '}`} isIconOnly variant={isListening?undefined:"light"}>
          {isListening?<BsStopFill  className="h-6 w-6"/>: <BsMic className="h-6 w-6" />}
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

          <Popover onClose={() => setTooltipOpen('')} placement='top-end' isOpen={(!!TooltipOpen)} >
            <PopoverTrigger >
              <Button
                isIconOnly
                variant="light"
                className="rounded-l-none"
                // isDisabled={form.query.trim() === "" || !!currentTypingMessageId || (!!botResponseLoading)}
                onClick={() => sendMessage()}
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
      <CustomModal isOpen={modalVisible} height="max-h-[450px] top-1/4" onClose={() => setModalVisible(false)} >
        <div className=" text-center">
          <h2 className="text-2xl font-bold"> Prompt Library</h2>
          Prompts are message templates that you can quickly fill in the chat input. Some prompts come with variables.
        </div>
        <Tabs
          aria-label="Options"
          color="primary"
          variant="underlined"
          className="w-full px-8 "
          onSelectionChange={(key) => {
            setCurrentTab(key as number)
          }}
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
        {currentTab == 1 ? <div>
          <div className="flex flex-grow gap-0 rounded-md items-center mt-6">
            <Input placeholder="Input new Prompts" value={promptValue} onChange={e => setPromptValue(e.target.value)} classNames={{
              inputWrapper: 'bg-default focus:bg-default'
            }} autoFocus color="default" />
            <Button onClick={()=>handlePromptAdd()} className="flex whitespace-nowrap bg-transparent items-center px-2 text-sm" ><AiOutlinePlus /> Add Prompts</Button>
          </div>
          <div className="flex flex-grow gap-0 rounded-md items-center mt-6">

            <Input placeholder="Search your Prompts" onChange={e => setPromptSearchKey(e.target.value)} classNames={{
              inputWrapper: 'bg-default focus:bg-default'
            }} />
          </div>
          <div className="flex flex-grow gap-0 rounded-md items-center mt-4">
            {prompts.length ? <div className="w-full" >
              {
                prompts.filter(val => val.toLocaleLowerCase().includes(promptSearchKey)).map((val: string, id) => <div key={id} className=" relative max-sm:block h-18 flex my-4 p-4 border-2 items-center border-gray-500 dark:border-white rounded-lg  gap-2  justify-between ">
                  <div className="w-[80%]  truncate " >{val}</div>

                  <div className="flex gap-2" >
                    <Tooltip showArrow placement='top-end' color='success' content='Use' className="capitalize">
                      <div onClick={() => handleUsePrompt(val)} >
                        <TiArrowRightOutline color="#2EDB9A" className="border-2  rounded-full p-1 w-6 h-6 border-success-500  active:scale-85 hover:scale-105  " />
                      </div>
                    </Tooltip>
                    <Tooltip showArrow placement='top-end' color='danger' content='Delete' className="capitalize">
                      <div onClick={() => handlePromptDelete(val)} >
                        <MdDeleteOutline color="#FC506D" className="border-2  rounded-full p-1 w-6 h-6 border-danger-500  active:scale-85 hover:scale-105  " />
                      </div>
                    </Tooltip>
                  </div>


                </div>)
              }
            </div> :
              <div className="p-4 border-dashed border-2 w-full text-center dark:border-gray-200 border-gray-800 ">
                You have no saved prompts. Tap “Add Prompt” to add new Prompts </div>}
          </div>
        </div> :
          <div>
            <div className=" rounded-md items-center mt-6">
              <Input placeholder="Search your Prompts" onChange={e => setCommunity_PromptSearchKey(e.target.value)} autoFocus />
              <div>

                {Community_prompts
                  .filter(value => value.content.toLocaleLowerCase().includes(Community_promptSearchKey))
                  .map((v, i) => <div key={i} className="max-sm:block flex my-4 p-4 border-2 items-center border-gray-500 dark:border-white rounded-lg  gap-2  justify-between ">

                    <div>
                      <div className=" text-2xl font-bold">
                        {v.name}
                      </div>
                      <div className="text-sm w-3/4  whitespace-break-spaces break-words">
                        {v.content}
                      </div>
                    </div>
                    <div className=" md:block   flex gap-1 mt-2" >
                      <Button onClick={()=>handleUsePrompt(v.content)} className="font-bold m-1 "    >
                        Use <AiOutlineArrowRight />
                      </Button>
                       { prompts.includes(v.content)?<Button onClick={()=>handlePromptDelete(v.content)} className="font-bold m-1">
                        Added 
                       </Button>:<Button onClick={()=>handlePromptAdd(v.content)} className="font-bold m-1">
                        Add <AiOutlinePlus />
                      </Button>}
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
