import {
  Button,
  Divider,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Switch,
  Tab,
  Tabs,
} from "@nextui-org/react";
import {
  AiOutlineApi,
  AiOutlineClose,
  AiOutlineProfile,
  AiOutlineSecurityScan,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import CustomModal from "./customModal";
import { FiSettings } from "react-icons/fi";
import { useEffect, useState } from "react";
import { BiDesktop } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { IoCloseCircleOutline } from "react-icons/io5";
import { MdOutlinePhone, MdOutlinePhoneAndroid } from "react-icons/md";

const SettingModal = () => {
  const [createModal, setCreateModal] = useState(false);

  const [isHorizontal, setHorizontalMode] = useState(false);
  const [SettingModal, setSettingModal] = useState(true);

  useEffect(() => {
    const resizeHandler = () => {
      if (
        document.body.clientWidth  < 950
      ) {
        setHorizontalMode(true);
      } else {
        setHorizontalMode(false);
      }
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  const navigate = useNavigate();

  return (
    <div>
      <CustomModal
        isOpen={SettingModal}
        width=" w-[90%] xl:w-[60%]  "
        height="h-auto top-[20%]"
        onClose={() => navigate(-1)}
      >
        <div className="px-8 py-4 text-3xl flex justify-between">
          Settings&nbsp;
          <AiOutlineClose onClick={()=>navigate(-1)} />
        </div>

        <Divider />

        <div className=" px-4  py-8 max-xs:p-1">
          <div className="flex w-full flex-col ">
            <Tabs
              aria-label="Options"
              isVertical={!isHorizontal}
              classNames={{
                tabList: "text-left  font-bold flex justify-center",
                tab: "p-5  text-lg ",
                tabContent: "w-full",
                panel: "w-full text-lg",
              }}
            >
              <Tab
                key="General"
                title={
                  <div className=" flex items-center">
                    <FiSettings className="w-6 h-6" />
                    {isHorizontal || <>&nbsp; General</>}
                  </div>
                }
              >
                <div className="    max-xs:block  flex  justify-between items-center w-full p-2">
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
                      color="success"
                      className="float-end"
                    ></Switch>
                  </div>
                </div>
                <Divider />
                <div className=" max-xs:block  flex justify-between items-center w-full p-2">
                  <div>Language</div>
                  <div>
                    <Select
                      items={[{ key: "auto", label: "Auto-detect" }]}
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
                </div>
              </Tab>

              <Tab
                key="Security"
                title={
                  <div className=" flex items-center">
                    {" "}
                    <AiOutlineSecurityScan className="w-6 h-6" />
                    {isHorizontal || <>&nbsp; Security</>}{" "}
                  </div>
                }
              >
                 <div className=" max-xs:block  text-lg flex justify-between items-center w-full p-2">
                  <div className="px-2">Log out of all devices</div>
                  <div>
                    <Button className="w-full">Log out all</Button>
                  </div>
                </div>
                <Divider/>
                <div className=" block  text-lg  justify-between items-center w-full p-2">
                  <div className="p-2">Connected devices</div>
                  <div className=" max-h-80 overflow-auto " >
                  {true?[...Array(10)].map((v,id)=><div key={id} className= "px-8 py-4 border-2 w-full text-center dark:border-gray-200 border-gray-800 rounded-md mt-2 max-sm:px-2 max-sm:block flex justify-between " >
                    <div className=" whitespace-nowrap  flex justify-start items-center  truncate ... " >
                      {id%3?<BiDesktop className="min-w-8 min-h-8"/>:<MdOutlinePhoneAndroid className="min-w-8 min-h-8"/>}&nbsp;
                      9OWJDEEW0203WWKOPP
                    </div>
                    <div className= " whitespace-nowrap flex justify-end items-center">
                      129.89.94.2 &nbsp;<IoCloseCircleOutline className=" opacity-80 hover:opacity-100 active:scale-85"  />
                    </div>
                  </div>)
                  :<div className="p-4 border-dashed border-2 w-full text-center dark:border-gray-200 border-gray-800 ">There is no any connected device. </div>}
                  </div>
                </div>
              </Tab>
              <Tab
                key="Your_APIs"
                title={
                  <div className=" flex items-center">
                    <AiOutlineApi className="w-6 h-6" />
                    {isHorizontal || <>&nbsp; Your APIs</>}
                  </div>
                }
              >
                <div className="text-lg font-bold px-1">Create new API key</div>
                <RadioGroup
                  label="Owned by"
                  orientation="horizontal"
                  defaultValue={"you"}
                >
                  <Radio value="you">You</Radio>
                  <Radio value="service">Service Account</Radio>
                </RadioGroup>
                <div className="text-sm py-4">
                  Lorem ipsum dolor sit amet consectetur. Ac at et metus
                  consectetur. Amet bibendum amet in dui viverra malesuada
                  cursus quis.
                </div>
                New
                <Input
                  color="default"
                  placeholder="new"
                  classNames={{
                    inputWrapper: "border-1",
                  }}
                />
                <br />
                Permissions
                <br />
                <Tabs color="success" radius="sm">
                  <Tab key="all" title="All" />
                  <Tab key="restricted" title="Restricted" />
                  <Tab key="readonly" title="Read Only" />
                </Tabs>
                <br />
                <Button
                  color="success"
                  className="max-xs:w-full w-1/3 mt-4 float-end"
                  onClick={() => {
                    setSettingModal(false);
                    setCreateModal(true);
                  }}
                >
                  Create API Key
                </Button>
              </Tab>
            </Tabs>
          </div>
        </div>
      </CustomModal>
      <CustomModal
        width="w-[90%] xl:w-[60%]"
        isOpen={createModal}
        onClose={() => {
          setCreateModal(false);

          setSettingModal(true);
        }}
      >
        <div className="text-xl font-bold text-center w-full p-4">
          Your Generated API Key
        </div>
        <div className="text-sm text-justify">
          Lorem ipsum dolor sit amet consectetur. Aliquam eu praesent faucibus
          morbi dolor mi. Feugiat id at ornare at donec ante massa. Sit volutpat
          elementum et consequat amet aliquet scelerisque. Hendrerit amet mauris
          quis quis faucibus scelerisque risus.
        </div>

        <div className="py-4 max-xs:block flex gap-1">
          <Input
            color="default"
            disabled
            placeholder="new"
            className="my-4"
            classNames={{
              inputWrapper: "border-1",
            }}
          />
          <Button color="success" className="max-xs:w-full my-4">
            Copy
          </Button>
        </div>
      </CustomModal>
    </div>
  );
};

export default SettingModal;
