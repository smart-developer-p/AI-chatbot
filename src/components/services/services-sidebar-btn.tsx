import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { Key, useState } from "react";
import { MdOutlineMiscellaneousServices } from "react-icons/md";

export default function ServicesSidebarBtn() {
  const [showMore, setShowMore] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuClick = (key: Key) => {
    if (key === "more") {
      setShowMore(true);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <Dropdown
      className="bg-background"
      classNames={{
        content: ["w-[16rem] md:w-[18rem]"],
        base: "before:bg-background",
      }}
      onClose={() => {
        setShowMore(false);
        setIsOpen(false);
      }}
      isOpen={isOpen}
      placement="right"
    >
      <DropdownTrigger
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        <Button 
          radius="sm"
          variant="light"
          className="justify-start gap-2 w-full h-11"
        >
          <MdOutlineMiscellaneousServices className="h-5 w-5" />
          Services
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Services Menu"
        itemClasses={{
          base: "rounded-sm h-11 gap-2",
          title: "text-sm font-normal",
        }}
        classNames={{
          list: "gap-1 p-1",
        }}
        onAction={handleMenuClick}
        closeOnSelect={false}
      >
        <DropdownItem
          key="ai_stock_predictor"
          startContent={<img src="/icons/stock.svg" className="w-5 h-5" />}
        >
          AI Stock Predictor
        </DropdownItem>
        <DropdownItem
          key="ai_doctor"
          startContent={<img src="/icons/doctor.svg" className="w-5 h-5" />}
        >
          AI Doctor
        </DropdownItem>
        <DropdownItem
          key="ai_researcher"
          startContent={<img src="/icons/researcher.svg" className="w-5 h-5" />}
        >
          AI Researcher
        </DropdownItem>
        <DropdownItem
          key="more"
          className={`${showMore ? "hidden" : "block"} text-center`}
        >
          More...
        </DropdownItem>
        <DropdownItem
          key="ai_lawyer"
          startContent={<img src="/icons/lawyer.svg" className="w-5 h-5" />}
          className={`${showMore ? "flex" : "hidden"}`}
        >
          AI Lawyer
        </DropdownItem>
        <DropdownItem
          key="ai_promt_optimizer"
          startContent={<img src="/icons/promt.svg" className="w-5 h-5" />}
          className={`${showMore ? "flex" : "hidden"}`}
        >
          AI Prompt Optimizer
        </DropdownItem>
        <DropdownItem
          key="ai_clinical_notes"
          startContent={<img src="/icons/clinic.svg" className="w-5 h-5" />}
          className={`${showMore ? "flex" : "hidden"}`}
        >
          AI Clinical Notes
        </DropdownItem>
        <DropdownItem
          key="add_your_own"
          startContent={<img src="/icons/own-promt.svg" className="w-5 h-5" />}
          className={`${showMore ? "flex" : "hidden"}`}
        >
          Add your own
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}