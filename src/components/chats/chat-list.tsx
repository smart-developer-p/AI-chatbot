/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/hooks/use-auth";
import {
  deleteChatHistory,
  getChatHistory,
} from "@/services/dispatch/chat-dispatch";
import { useAppDispatch } from "@/store/hooks";
import { setMessages } from "@/store/slices/chatSlice";
import {
  Dropdown,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";
import { useState } from "react";
import { BsThreeDots, BsTrash } from "react-icons/bs";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";

export default function ChatList() {
  const { isLoggedIn } = useAuth();
  const { isLoading, data } = useQuery({
    queryKey: ["chat-list"],
    queryFn: getChatHistory,
    enabled: isLoggedIn,
  });
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedHistory, selecteHistory] = useState("");
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const handleDivClick = (url: string) => {
    navigate(url);
    // window.location.href = url; // Navigate to the specified page
  };

  const handleDelete = async () => {
    if (!selectedHistory) return;
    const res = await deleteChatHistory(selectedHistory);
    if (res) {
      data.conversations = data?.conversations.filter(
        (item: any) => item?.conversation_id !== selectedHistory
      );

      if (id === selectedHistory) {
        dispatch(setMessages([]));

        navigate("/");
      }
      selecteHistory("");
    }
  };

  return (
    <>
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
              onClick={() => handleDivClick(`/c/${item?.conversation_id}`)}
            >
              <div className="group relative flex items-center w-full rounded-md">
                <p className="p-2">
                  {item?.conversation_name || "Unknown"}
                </p>

                <div className="absolute bottom-0 top-0 ltr:right-0 hidden group-hover:flex items-center right-0 pr-2 bg-[#3f3f46] rounded-r-lg">
                  <Dropdown className="bg-background ">
                    <DropdownTrigger>
                      <Button
                        isIconOnly
                        variant="light"
                        className=" right-0 sticky"
                        onClick={(e) => {
                          e.stopPropagation();
                          // handleDelete(item?.conversation_id)
                        }}
                      >
                        <BsThreeDots className="h-5 w-5 " />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      variant="faded"
                      aria-label="Static Actions"
                      className="text-danger bg-background  "
                    >
                      <DropdownItem
                        key="delete"
                        onClick={() => {
                          onOpen();
                          selecteHistory(item.conversation_id);
                        }}
                        className="text-danger bg-background   text-center "
                        color="danger"
                      >
                        <div className="flex w-full  justify-center items-center">
                          <BsTrash className="h-4 w-4    " /> &nbsp;Delete
                        </div>
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </ListboxItem>
          ))
        )}
      </Listbox>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete chat?
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete this chat history? This action
                  cannot be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    onClose();
                    handleDelete();
                  }}
                >
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
