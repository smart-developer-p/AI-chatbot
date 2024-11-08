import {
  Button,
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,

} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BiDesktop } from "react-icons/bi";
import { IoCloseCircleOutline } from "react-icons/io5";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { getConnectedDevices, logoutAllDevices } from "@/services/dispatch/user-dispatch";
import { deleteSession } from "@/services/session";
import { useAuth } from "@/hooks/use-auth";
import toast from "react-hot-toast";

interface Device {
  device_id: string,
  device_name: string,
  ip_address: string,
  last_active: Date,
  created_at: Date
}

const SecuritySetting = () => {
  const [devices, setDevices] = useState<Device[]>([])

  const { setIsLoggedIn, setUser } = useAuth();

  useEffect(() => {
    getConnectedDevices().then(res => setDevices(res.connected_devices))
  }, []);

  const navigate = useNavigate();


  const handlelogoutAll = () => {

    logoutAllDevices().then(res => {
      toast.success('All the devices have been logged out including you. Kindly login back...')
      console.log(res)  
      deleteSession();
      setUser(null);
      setIsLoggedIn(false);
      navigate("/");
    })

  };

  const handleDeleteAccount = () => {
    toast.success('Your account is deleted successfully')
    deleteSession();
    setUser(null);
    setIsLoggedIn(false);
    navigate("/");
  }

  return <>
    <div className=" max-xs:block  text-lg flex justify-between items-center w-full p-2">
      <div className="px-2">Delete account</div>
      <div>

        <Popover placement="top-end" showArrow color="danger" >
          <PopoverTrigger>
            <Button className="w-full" color="danger" >Delete current account</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2">
              <div className=" font-bold">Are you sure?</div>
              <p className="text-small py-2">Your current account will be deleted. This action cannot be undone.</p>
              <div className=" justify-end flex  " ><Button className="border-2" onClick={handleDeleteAccount} size="sm" color="danger" >Ok</Button></div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
    <Divider />
    <div className=" max-xs:block  text-lg flex justify-between items-center w-full p-2">
      <div className="px-2">Log out of all devices</div>
      <div>

        <Popover placement="top-end" showArrow >
          <PopoverTrigger>
            <Button className="w-full">Log out all</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2">
              <div className=" font-bold">Are you sure?</div>
              <p className="text-small py-2">All the devices will be logged out including you</p>
              <div className=" justify-end flex " ><Button onClick={handlelogoutAll} size="sm" color="danger" >Ok</Button></div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
    <Divider />
    <div className=" block  text-lg  justify-between items-center w-full p-2">
      <div className="p-2">Connected devices</div>
      <div className=" max-h-80 overflow-auto " >
        {true ? devices.map((v, id) => <div key={id} className="px-8 py-4 border-2 w-full text-center dark:border-gray-200 border-gray-800 rounded-md mt-2 max-sm:px-2 max-sm:block flex justify-between " >
          <div className=" whitespace-nowrap  flex justify-start items-center  truncate ... " >
            {true ? <BiDesktop className="min-w-8 min-h-8" /> : <MdOutlinePhoneAndroid className="min-w-8 min-h-8" />}&nbsp;
            {v.device_name.split(' ')[0]}
          </div>
          <div className=" whitespace-nowrap flex justify-end items-center">
            {v.ip_address} &nbsp;<IoCloseCircleOutline className=" opacity-80 hover:opacity-100 active:scale-85" />
          </div>
        </div>)
          : <div className="p-4 border-dashed border-2 w-full text-center dark:border-gray-200 border-gray-800 ">There is no any connected device. </div>}
      </div>
    </div>
  </>
}

export default SecuritySetting