import { Message } from "@/store/slices/chatSlice";

type P = {
  message: Message;
};
export default function UserMessage(props: P) {
  const { message } = props;
  return (
    <div className="text-right py-2 px-3 bg-default w-fit self-end rounded-lg">
      <p className=" text-left" dangerouslySetInnerHTML={{__html:message.text.replace(/\n/g,'<br/>')}} >

       
        </p>
    </div>
  );
}
