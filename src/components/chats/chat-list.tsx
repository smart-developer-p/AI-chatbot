/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/hooks/use-auth";
import { deleteChatHistory, getChatHistory } from "@/services/dispatch/chat-dispatch";
import {Dropdown, Link, DropdownTrigger, DropdownMenu, DropdownItem, Button,Listbox, ListboxItem } from "@nextui-org/react";
import { BsThreeDots,  } from "react-icons/bs";
import { useQuery } from "react-query";

export default function ChatList() {
  const { isLoggedIn } = useAuth();
  const { isLoading, data } = useQuery({
    queryKey: ["chat-list"],
    queryFn: getChatHistory,
    enabled: isLoggedIn,
  });

  const handleDivClick = (url:string) => {
    window.location.href = url; // Navigate to the specified page
  };

  const handleDelete = async(id:string) => {
   const data=  await deleteChatHistory(id)
   if(data){
    window.location.href='/'
   }
  };

  return (
    <Listbox className="flex-1" aria-label="Chat list">
      {isLoading ? (
        <ListboxItem key={"1"} className="p-0" textValue="chat list">
          Loading...
        </ListboxItem>
      ) : (
        data?.conversations?.map((item: any) => (
          <ListboxItem
            key={item?.conversation_id}
            className="p-0"
            textValue="chat list"
            onClick={()=>handleDivClick(`/c/${item?.conversation_id}`)}
          >
            <div className="flex items-center justify-between">
              <p className="p-2">{item?.conversation_name || "Unknown"}</p>
              
              <Dropdown className="bg-background w-20"  >
      <DropdownTrigger>
      <Button isIconOnly variant="light" className=" right-0 sticky " onClick={e=>{
                e.stopPropagation()
                // handleDelete(item?.conversation_id)
              }} >
                <BsThreeDots className="h-5 w-5 " />
              </Button>
      </DropdownTrigger>
      <DropdownMenu variant="faded" aria-label="Static Actions"   className="text-danger bg-background   ">
        
        <DropdownItem key="delete" onClick={()=>handleDelete(item.conversation_id)} className="text-danger bg-background" color="danger"  >
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
            </div>
          </ListboxItem>
        ))
      )}
    </Listbox>
  );
}
