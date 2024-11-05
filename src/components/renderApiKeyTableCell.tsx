import { Tooltip } from "@nextui-org/react";
import React from "react";
import { IoEyeOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";



interface Props{
  name?:string,
  key?:string,
  permission?:string
}


export const RenderCell = (value: Props, columnKey: React.Key) => {
    const cellValue = value[columnKey as keyof Props ];

    switch (columnKey) {
     
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip showArrow content="View">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <IoEyeOutline />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete">
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
