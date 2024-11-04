import { Button, Divider, Input, Radio, RadioGroup, Select, SelectItem, Switch, Tab, Tabs } from "@nextui-org/react";
import { AiOutlineApi, AiOutlineClose, AiOutlineProfile, AiOutlineSecurityScan, } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import CustomModal from "./customModal";
import { FiDatabase, FiSettings, FiUser } from "react-icons/fi";
import { useState } from "react";


const SettingModal = () => {
  const [createModal, setCreateModal] = useState(false)




  const navigate = useNavigate()



  return (
    <div >
      <CustomModal isOpen={true}
        width="w-[90%]"
        height="h-auto top-[20%]"
        onClose={() => navigate(-1)}
      >
        <div className="px-8 py-4 text-3xl flex justify-between">
          Settings&nbsp;<AiOutlineClose />
        </div>

        <Divider />


        <div className=" px-4 py-8">

          <div className="flex w-full flex-col ">
            <Tabs aria-label="Options" isVertical={true} classNames={{
              tabList: 'text-left font-bold',
              tab: 'p-5  text-lg ',
              tabContent: 'w-full',
              panel: 'w-full text-lg'
            }}>
              <Tab key="General" title={<div className=" flex items-center" ><FiSettings className="w-6 h-6" />&nbsp; General</div>}>
                <div className="flex justify-between items-center w-full p-2" >
                  <div>

                    Theme</div>
                  <div>

                    <Select

                      items={[
                        { key: 'system', label: 'System' },
                        { key: 'white', label: 'White' },
                        { key: 'dark', label: 'Dark' },
                      ]}
                      // label="Favorite Animal"

                      size="lg"
                      placeholder="Select an theme"
                      defaultSelectedKeys={['system']}
                      className="w-40"
                    >
                      {(opt: { key: string, label: string }) => <SelectItem key={opt.key} >{opt.label}</SelectItem>}
                    </Select>
                  </div>
                </div>
                <Divider />
                <div className="flex justify-between items-center w-full p-2" >
                  <div>
                    Always show code while using data analytics
                  </div>
                  <div>

                    <Switch defaultSelected color="success"></Switch>
                  </div>
                </div>
                <Divider />
                <div className="flex justify-between items-center w-full p-2" >
                  <div>

                    Language</div>
                  <div>

                    <Select

                      items={[
                        { key: 'auto', label: 'Auto-detect' },

                      ]}
                      size="lg"
                      placeholder="Select an theme"
                      defaultSelectedKeys={['auto']}
                      className="w-40"
                    >
                      {(opt: { key: string, label: string }) => <SelectItem key={opt.key} >{opt.label}</SelectItem>}
                    </Select>
                  </div>
                </div>
                <Divider />
                <div className="flex justify-between items-center w-full p-2" >
                  <div>
                    Archieved chat
                  </div>
                  <div>

                    <Button>Manage</Button>
                  </div>
                </div>
                <div className="flex justify-between items-center w-full p-2" >
                  <div>
                    Archieve all chats
                  </div>
                  <div>

                    <Button>Archieve all</Button>
                  </div>
                </div>
                <Divider />
                <div className="flex justify-between items-center w-full p-2" >
                  <div>
                    Delete chat
                  </div>
                  <div>

                    <Button>Delete all</Button>
                  </div>
                </div>


              </Tab>
              <Tab key="Personalization" title={<div className=" flex items-center" ><FiUser className="w-6 h-6" /> &nbsp;Personalization</div>}>
                Here is Personaliztion setting

              </Tab>
              <Tab key="Data_controls" title={<div className=" flex items-center" ><FiDatabase className="w-6 h-6" />&nbsp;  Data controls</div>}>
                Here is Data controls setting


              </Tab>
              <Tab key="Builder_Profile" title={<div className=" flex items-center" > <AiOutlineProfile className="w-6 h-6" />&nbsp; Builder Profile</div>}>
                Here is Builder Profile setting


              </Tab>
              <Tab key="Security" title={<div className=" flex items-center" > <AiOutlineSecurityScan className="w-6 h-6" /> &nbsp;  Security</div>}>
                Here is Security setting


              </Tab>
              <Tab key="Your_APIs" title={<div className=" flex items-center" ><AiOutlineApi className="w-6 h-6" />&nbsp;  Your API's</div>}>
                <div className="text-lg font-bold px-1" >
                  Create new API key
                </div>

                <RadioGroup
                  label="Owned by"
                  orientation="horizontal"
                >
                  <Radio value="buenos-aires">You</Radio>
                  <Radio value="sydney">Service Account</Radio>

                </RadioGroup>
                <div className="text-sm py-4">Lorem ipsum dolor sit amet consectetur. Ac at et metus consectetur. Amet bibendum amet in dui viverra malesuada cursus quis.</div>

                New
                <Input color="default" placeholder="new" classNames={{
                  inputWrapper: 'border-1'
                }} />
                <br />
                Permissions<br />
                <Tabs color='success' radius="sm">
                  <Tab key="all" title="All" />
                  <Tab key="restricted" title="Restricted" />
                  <Tab key="readonly" title="Read Only" />
                </Tabs>
                <br />


                <Button color="success" className=" float-end" onClick={() => setCreateModal(true)} >Create API Key</Button>


              </Tab>


            </Tabs>
          </div>
        </div>


      </CustomModal>
      <CustomModal width="w-[60%]" isOpen={createModal} onClose={() => setCreateModal(false)} >
        <div className="text-xl font-bold text-center w-full p-4">Your Generated API Key</div>
        <div className="text-sm text-justify">
          Lorem ipsum dolor sit amet consectetur. Aliquam eu praesent faucibus morbi dolor mi. Feugiat id at ornare at donec ante massa. Sit volutpat elementum et consequat amet aliquet scelerisque. Hendrerit amet mauris quis quis faucibus scelerisque risus.
        </div>

        <div className="py-4 flex gap-1">
        <Input color="default" placeholder="new" classNames={{
                  inputWrapper: 'border-1'
                }} />
                <Button color="success">Copy</Button>
        </div>
        <Button color="success" size="sm" className=" float-end" onClick={() => setCreateModal(false)} >Close</Button>
      </CustomModal>



    </div>

  )
}

export default SettingModal