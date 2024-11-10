/* eslint-disable @typescript-eslint/no-explicit-any */
import { useArchive } from "@/hooks/use-archive";
import { useAuth } from "@/hooks/use-auth";
import { deleteChatHistory, getChatHistory } from "@/services/dispatch/chat-dispatch";
import {  setItem } from "@/services/session";
import { useAppDispatch } from "@/store/hooks";
import { setMessages } from "@/store/slices/chatSlice";
import { downloadHistory } from "@/utils";
import { Dropdown, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, DropdownTrigger, DropdownMenu, DropdownItem, Button, Listbox, ListboxItem } from "@nextui-org/react";
import {  useState } from "react";
import { BsThreeDots, BsTrash } from "react-icons/bs";
import { IoArchiveOutline, IoSaveOutline } from "react-icons/io5";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";

export interface ArchivedChat{
  name:string;
  id:string;
  created:Date
}

export default function ChatList() {
  const { isLoggedIn } = useAuth();
  const { isLoading, data } = useQuery({
    queryKey: ["chat-list"],
    queryFn: getChatHistory,
    enabled: isLoggedIn,
  });
  const navigate = useNavigate()
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedHistory, selecteHistory] = useState('')
  const { id } = useParams()
  const dispatch = useAppDispatch()

  const { archivedchats,setArchivedChats }=useArchive()


  const handleDivClick = (url: string) => {
    navigate(url)
    // window.location.href = url; // Navigate to the specified page
  };

  const handleDelete = async () => {
    if (!selectedHistory) return
    const res = await deleteChatHistory(selectedHistory)
    if (res) {
      data.conversations = data?.conversations.filter((item: any) => item?.conversation_id !== selectedHistory)

      if (id === selectedHistory) {
        dispatch(setMessages([]));

        navigate('/')
      }
      selecteHistory('')
    }
  };

  

  return (<>
    <Listbox className="flex-1" aria-label="Chat list">
      {isLoading ? (
        <ListboxItem key={"1"} className="p-0" textValue="chat list">
          Loading...
        </ListboxItem>
      ) : (
        data?.conversations?.filter((val:any)=>archivedchats?!archivedchats.map(arch=>arch.id).includes(val?.conversation_id):false).map((item: any) => (
          <ListboxItem
            key={item?.conversation_id}
            className={`p-0 ${item?.conversation_id === id ? " bg-default-200" : ''}`}
            textValue="chat list"
            onClick={() => handleDivClick(`/c/${item?.conversation_id}`)}
          >
            <div className="flex items-center justify-between backgroun ">
              <p className="p-2 w-full truncate">{item?.conversation_name || "Unknown"}</p>

              <Dropdown className="bg-background " placement='bottom-start' showArrow classNames={{
                'content': ' min-w-[100px]',
                'arrow': 'bg-background'
              }} >
                <DropdownTrigger>
                  <span /* isIconOnly variant="light" */ className=" right-0 sticky p-2 opacity-50 hover:opacity-100 " onClick={e => {
                    e.stopPropagation()
                    // handleDelete(item?.conversation_id)
                  }} >
                    <BsThreeDots className="h-5 w-5 " />
                  </span>
                </DropdownTrigger>
                <DropdownMenu variant="faded" aria-label="Static Actions" className=" bg-background  ">
                  <DropdownItem key="Archieve" onClick={() => {
                    setArchivedChats(([...archivedchats, { name:item.conversation_name||'Unknown',id:item.conversation_id,created:Date.now()}] as ArchivedChat[]))
                    setItem('archivedChats', [...archivedchats, { name:item.conversation_name||'Unknown',id:item.conversation_id,created:Date.now()}] as ArchivedChat[])

                    if (id === item.conversation_id) {
                      dispatch(setMessages([]));
              
                      navigate('/')
                    }
                    selecteHistory('')
                  }} className="   text-center "   >
                    <div className="flex w-full   items-center    justify-start" >
                      <IoArchiveOutline className="h-4 w-4    " /> &nbsp;Archive

                    </div>
                  </DropdownItem>
                  <DropdownItem key="Save" onClick={() => {
                    downloadHistory(item.conversation_id)
                  }} className="   text-center "   >
                    <div className="flex w-full  justify-start items-center   " >
                      <IoSaveOutline className="h-4 w-4    " /> &nbsp;Download

                    </div>
                  </DropdownItem>

                  <DropdownItem key="delete" onClick={() => {
                    onOpen()
                    selecteHistory(item.conversation_id)
                  }} className="text-danger bg-background   text-center " color="danger"  >
                    <div className="flex w-full  justify-start items-center   " >
                      <BsTrash className="h-4 w-4    " /> &nbsp;Delete

                    </div>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </ListboxItem>
        ))
      )}
    </Listbox>
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Delete chat?</ModalHeader>
            <ModalBody>
              <p>
                Are you sure you want to delete this chat history? This action cannot be undone.
              </p>

            </ModalBody>
            <ModalFooter>
              <Button color="default" onPress={onClose}>
                Close
              </Button>
              <Button color="danger" onPress={() => {
                onClose()
                handleDelete()
              }}>
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  </>
  );
}
