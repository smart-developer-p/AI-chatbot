import { useTheme } from "@/hooks/use-theme";
import { deleteChatHistory, getChatHistory } from "@/services/dispatch/chat-dispatch";
import { getItem, setItem } from "@/services/session";
import {
  Button,
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from "@nextui-org/react";
import CustomModal from "../customModal";
import {  useState } from "react";
import { ArchivedChat } from "../chats/chat-list";
import { RenderArchivedChatsTableCell } from "./renderTableCell";
import { useNavigate } from "react-router-dom";
import { useArchive } from "@/hooks/use-archive";


const GeneralSetting=()=>{

  const { theme, setLightTheme,setDarkTheme } = useTheme()

  const [manageModal,setManageModal]=useState(false)

  const [tooltip,setTooltip]=useState(false)

  const { archivedchats ,setArchivedChats } = useArchive()

  const navigate=useNavigate()


  const handleArchieveAll = async() => { 
    const histories=await getChatHistory()

    setItem('archivedChats',histories?.conversations.map((v:any)=>({id:v.conversation_id,name:v.conversation_name,created:Date.now()})))

   }


   const handleUnarchive = (current:string) => { 
    const chats:ArchivedChat[]=getItem('archivedChats')
    setItem('archivedChats',chats.filter(chat=>chat.id!==current))
    setArchivedChats(chats.filter(chat=>chat.id!==current))
   }
   const handleDeleteConversation =async (current:string) => { 
    const chats:ArchivedChat[]=getItem('archivedChats')
    setItem('archivedChats',chats.filter(chat=>chat.id!==current))
    setArchivedChats(chats.filter(chat=>chat.id!==current))
     await deleteChatHistory(current)
    }


  return <><div className="    max-xs:block  flex  justify-between items-center w-full p-2">
    <div>Theme</div>
    <div>
      <Select
      aria-label="them selector"
        selectedKeys={[theme]}
        onSelectionChange={key=>{
          if([...key][0]==='light'){
            setLightTheme()
          }else{
            setDarkTheme()
          }
        }}
        items={[
          { key: "light", label: "Light" },
          { key: "dark", label: "Dark" },
        ]}
        // label="Favorite Animal"

        size="lg"
        placeholder="Select an theme"
        className=" w-40 max-xs:w-full"
      >
        {(opt: { key: string; label: string }) => (
          <SelectItem key={opt.key}>{opt.label}</SelectItem>
        )}
      </Select>
    </div>
  </div>
  <Divider />
  <div className=" max-xs:block  flex justify-between items-center w-full p-2">
    <div>Always show code while using data analytics</div>
    <div>
      <Switch
        defaultSelected
        color="default"
        className="float-end"
      ></Switch>
    </div>
  </div>
  <Divider />
  <div className=" max-xs:block  flex justify-between items-center w-full p-2">
    <div>Language</div>
    <div>
      <Select
       aria-label="language selector"
       items={[
        { key: "auto", label: "Auto-detect" },
        { key: "en", label: "English" },
        { key: "hi", label: "Hindi" },
        { key: "bn", label: "Bengali" },
        { key: "gu", label: "Gujarati" },
        { key: "ur", label: "Urdu" },
        { key: "es", label: "Spanish" },
        { key: "fr", label: "French" },
        { key: "zh", label: "Chinese" },
      ]}
        size="lg"
        placeholder="Select an theme"
        defaultSelectedKeys={["auto"]}
        className="w-40 max-xs:w-full"
      >
        {(opt: { key: string; label: string }) => (
          <SelectItem key={opt.key}>{opt.label}</SelectItem>
        )}
      </Select>
    </div>
  </div>
  <Divider />
  <div className=" max-xs:block  flex justify-between items-center w-full p-2">
    <div>Archieved chat</div>
    <div>
      <Button onClick={()=>setManageModal(true)} className="w-full">Manage</Button>
    </div>
  </div>
  <div className="max-xs:block  flex justify-between items-center w-full p-2">
    <div>Archive all chats</div>
    <div>
    <Popover isOpen={tooltip} onBlur={()=>setTooltip(false)} placement="top-end" showArrow >
          <PopoverTrigger>
          <Button onClick={()=>setTooltip(true)}  className="w-full">Archieve all</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2">
              <div className=" font-bold">Are you sure?</div>
              <p className="text-small py-2">Archive all chat history.</p>
              <div className=" justify-end flex " ><Button onClick={()=>{
                handleArchieveAll()
                setTooltip(false)
                }} size="sm" color="danger" >Ok</Button></div>
            </div>
          </PopoverContent>
        </Popover>
      
    </div>
  </div>
  <Divider />
  <div className=" max-xs:block  flex justify-between items-center w-full p-2">
    <div>Delete chat</div>
    <div>
      <Button className="w-full">Delete all</Button>
    </div>
  </div>
  
  <CustomModal
        width="w-[90%]"
        height="top-1/4"
        isOpen={manageModal}
        onClose={() => {
          setManageModal(false);
        }}
      >
        <div className="w-full">Archeved Chats</div>
        <Divider/>
        <Table 
        
      isHeaderSticky
      className="overflow-hidden"
      classNames={{
        base: "max-h-[230px] overflow-scroll",
      }} aria-label="Example table with custom cells">
      <TableHeader columns={[{
        uid: 'name', name: 'Name'
      }, {
        uid: 'created', name: 'Date created'
      },
       {
        uid: 'actions', name: 'Actions'
      }
      ]}>
        {(column) => (
          <TableColumn key={column?.uid} align={ column.uid==='name'?'start':'center'}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={archivedchats}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{RenderArchivedChatsTableCell(item,columnKey,handleUnarchive,handleDeleteConversation,navigate)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
      </CustomModal>
  
  
  </>
}

export default GeneralSetting