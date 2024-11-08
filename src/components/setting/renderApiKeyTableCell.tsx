import { Popover, PopoverContent, PopoverTrigger, Tooltip } from "@nextui-org/react";
import React, { useState } from "react";
import { IoCheckmarkOutline, IoCopyOutline, IoEyeOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";



interface Props {
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

export const RenderCell = (value: Props, columnKey: React.Key) => {
  const cellValue = value[columnKey as keyof Props] || '';

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
