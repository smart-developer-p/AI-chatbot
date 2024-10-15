/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/hooks/use-auth";
import { getChatHistory } from "@/services/dispatch/chat-dispatch";
import { Button, Listbox, ListboxItem } from "@nextui-org/react";
import { BsThreeDots } from "react-icons/bs";
import { useQuery } from "react-query";

export default function ChatList() {
  const { isLoggedIn } = useAuth();
  const { isLoading, data } = useQuery({
    queryKey: ["chat-list"],
    queryFn: getChatHistory,
    enabled: isLoggedIn,
  });
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
            href={`/c/${item?.conversation_id}`}
          >
            <div className="flex items-center justify-between">
              <p className="p-2">{item?.conversation_name || "Unknown"}</p>
              <Button isIconOnly variant="light">
                <BsThreeDots className="h-5 w-5" />
              </Button>
            </div>
          </ListboxItem>
        ))
      )}
    </Listbox>
  );
}
