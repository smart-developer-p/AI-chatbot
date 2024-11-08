import DefaultLayout from "@/layouts/default";
import {
  Divider,
  Tab,
  Tabs,
} from "@nextui-org/react";
import {
  AiOutlineApi,
  AiOutlineClose,
  AiOutlineSecurityScan,
} from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { useEffect, useState } from "react";
import CustomModal from "@/components/customModal";
import GeneralSetting from "@/components/setting/general";
import SecuritySetting from "@/components/setting/security";
import APIsetting from "@/components/setting/APIs";



const SettingModal = () => {

  const [isHorizontal, setHorizontalMode] = useState(false);



  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');


  useEffect(() => {
    const resizeHandler = () => {
      if (
        document.body.clientWidth < 950
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
        isOpen={true}
        width=" w-[90%] xl:w-[80%]  "
        height="h-auto top-[20%]"
        onClose={() => navigate(-1)}
      >
        <div className="px-8 pb-4 text-3xl flex justify-between">
          Settings&nbsp;
          <AiOutlineClose onClick={() => navigate(-1)} />
        </div>

        <Divider />

        <div className=" px-4  py-8 max-xs:p-1">
          <div className="flex w-full flex-col ">
            <Tabs
              aria-label="Options"
              defaultSelectedKey={id || 'General'}
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
                <GeneralSetting/>
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
                <SecuritySetting/>
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
                <APIsetting/>
              </Tab>
            </Tabs>
          </div>
        </div>
      </CustomModal>
     
    </div>
  );
};




export default function Setting() {
  
  return (
    <DefaultLayout>
      <div >
      <SettingModal/>
        </div>
    </DefaultLayout>
  );
}