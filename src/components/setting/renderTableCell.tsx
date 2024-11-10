import { Popover, PopoverContent, PopoverTrigger, Tooltip } from "@nextui-org/react";
import React, { useState } from "react";
import { IoCheckmarkOutline, IoCopyOutline, IoEyeOutline } from "react-icons/io5";
import { MdDeleteOutline, MdUnarchive } from "react-icons/md";
import { ArchivedChat } from "../chats/chat-list";
import { BiConversation } from "react-icons/bi";



interface APIProps {
  name?: string,
  key?: string,
  permission?: string
}




const CopyButton = (props: { copyvalue: string }) => {
  const [copying, setCopying] = useState(false)
  const copy = () => {
    setCopying(true)
    window.navigator.clipboard.writeText(props.copyvalue)
    setTimeout(() => {
      setCopying(false)
    }, 2000);
  }

  return <>
    {copying ? <IoCheckmarkOutline /> : <IoCopyOutline onClick={copy} />}
  </>

}




export const RenderAPITableCell = (value: APIProps, columnKey: React.Key) => {
  const cellValue = value[columnKey as keyof APIProps] || '';

  switch (columnKey) {
    case 'key':
      return (
        <div className="flex  items-center self-center text-center justify-center" >
          {cellValue.slice(0, 6)}...............{cellValue.slice(-5)}&nbsp;<CopyButton copyvalue={cellValue} />
        </div>
      )

    case "actions":
      return (
        <div className="relative flex items-center   justify-center gap-2">
          <Popover showArrow color="primary" placement='top-end'>
            <PopoverTrigger>
            {/* <Tooltip showArrow content="View"> */}
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <IoEyeOutline />
            </span>
          {/* </Tooltip> */}
            </PopoverTrigger>
            <PopoverContent>
              <div className="px-1 py-2">
                {value['key']}
              </div>
            </PopoverContent>
          </Popover>
          
          <Tooltip showArrow color="danger" content="Delete">
            <span className="text-lg text-danger cursor-pointer active:opacity-50">
              <MdDeleteOutline />
            </span>
          </Tooltip>

        </div>
      );
    default:
      return cellValue;
  }
}



export const RenderArchivedChatsTableCell = (value: any, columnKey: React.Key,handleUnarchive:Function,handleDeleteConversation:Function,navigate:Function) => {
  const cellValue = value[columnKey as keyof ArchivedChat] || '';

  

  switch (columnKey) {
    case 'name':
     return <div className="cursor-pointer flex items-center hover:text-blue-300" style={{
      cursor:'pointer !important'
     }}  onClick={()=>navigate('/c/'+value.id)} >
          <BiConversation/>&nbsp; {cellValue}
        </div>
    case 'created':
      return (
        <div className="flex  items-center self-center text-center justify-center" >
          {new Date(cellValue).toLocaleDateString()}
        </div>
      )

    case "actions":
      return (
        <div className="relative flex items-center   justify-center gap-2">
          <Tooltip showArrow  content="Unarchive conversation">
            <span className="text-lg  cursor-pointer active:opacity-50">
              <MdUnarchive  onClick={()=>handleUnarchive(value.id)}/>
            </span>
          </Tooltip>
          
          <Tooltip showArrow color="danger" content="Delete conversation">
            <span className="text-lg text-danger cursor-pointer active:opacity-50">
              <MdDeleteOutline  onClick={()=>handleDeleteConversation(value.id)} />
            </span>
          </Tooltip>

        </div>
      );
    default:
      return cellValue;
  }
}
