import {
  Button,
  Divider,
  Select,
  SelectItem,
  Switch
} from "@nextui-org/react";


const GeneralSetting=()=>{

  return <><div className="    max-xs:block  flex  justify-between items-center w-full p-2">
    <div>Theme</div>
    <div>
      <Select
        items={[
          { key: "system", label: "System" },
          { key: "white", label: "White" },
          { key: "dark", label: "Dark" },
        ]}
        // label="Favorite Animal"

        size="lg"
        placeholder="Select an theme"
        defaultSelectedKeys={["system"]}
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
      <Button className="w-full">Manage</Button>
    </div>
  </div>
  <div className="max-xs:block  flex justify-between items-center w-full p-2">
    <div>Archieve all chats</div>
    <div>
      <Button className="w-full">Archieve all</Button>
    </div>
  </div>
  <Divider />
  <div className=" max-xs:block  flex justify-between items-center w-full p-2">
    <div>Delete chat</div>
    <div>
      <Button className="w-full">Delete all</Button>
    </div>
  </div></>
}

export default GeneralSetting