import {
  Button,
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip
} from "@nextui-org/react";
// import { Tooltip } from "../tootip/tooltip";
import { Monitor, Smartphone, Laptop, Terminal, X, Info } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getConnectedDevices, logoutAllDevices } from "@/services/dispatch/user-dispatch";
import { deleteSession } from "@/services/session";
import { useAuth } from "@/hooks/use-auth";
import toast from "react-hot-toast";
import { formatDate } from "@/utils";

interface Device {
  device_id: string,
  device_name: string,
  ip_address: string,
  last_active: Date,
  created_at: Date
}



const getDeviceInfo = (deviceName: string) => {
  const userAgent = deviceName.toLowerCase()

  if (userAgent.includes("postman")) {
    return {
      type: "API Client",
      icon: Terminal,
      name: "Postman",
      os: "Cross-platform",
      browser: "Postman Runtime",
      version: userAgent.split("/")[1]
    }
  }

  if (userAgent.includes("mozilla")) {
    const info = {
      type: "Browser",
      icon: Laptop,
      name: "Web Browser",
      os: userAgent.includes("windows") ? "Windows" :
        userAgent.includes("mac") ? "macOS" :
          userAgent.includes("linux") ? "Linux" : "Unknown",
      browser: userAgent.includes("chrome") ? "Chrome" :
        userAgent.includes("firefox") ? "Firefox" :
          userAgent.includes("safari") ? "Safari" : "Unknown",
      version: userAgent.match(/chrome\/([0-9.]+)/i)?.[1] ||
        userAgent.match(/firefox\/([0-9.]+)/i)?.[1] ||
        userAgent.match(/safari\/([0-9.]+)/i)?.[1] || "Unknown"
    }
    return info
  }

  return {
    type: "Unknown Device",
    icon: Monitor,
    name: deviceName,
    os: "Unknown",
    browser: "Unknown",
    version: "Unknown"
  }
}


const SecuritySetting = () => {
  const [devices, setDevices] = useState<Device[]>([])


  const [infoToolTip,setInfoTooltip]=useState(0)

  const { setIsLoggedIn, setUser } = useAuth();

  useEffect(() => {
    getConnectedDevices().then(res => {
      console.log(res)
      setDevices(res.connected_devices)
    })
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

        <Popover   placement="top-end" showArrow color="danger" >
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
        {true ? devices.map((v, id) => {
          const deviceInfo = getDeviceInfo(v.device_name)
          const DeviceIcon = deviceInfo.icon
          return <div key={id} className="px-8 py-4 border-2 w-full text-center dark:border-gray-200 border-gray-800 rounded-md mt-2 max-sm:px-2 max-sm:block flex justify-between " >
            {/* <div className=" whitespace-nowrap  flex justify-start items-center  truncate ... " >
              {true ? <BiDesktop className="min-w-8 min-h-8" /> : <MdOutlinePhoneAndroid className="min-w-8 min-h-8" />}&nbsp;
              {v.device_name.split(' ')[0]}
            </div>
            <div className=" whitespace-nowrap flex justify-end items-center">
              {v.ip_address} &nbsp;<IoCloseCircleOutline className=" opacity-80 hover:opacity-100 active:scale-85" />
            </div> */}
            <div className="mr-4">
              <DeviceIcon className="h-6 w-6" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{deviceInfo.name}</h3>
                <Tooltip isOpen={infoToolTip===id+1} content={
                  <div className="space-y-2">
                    <p><span className="font-semibold">Type:</span> {deviceInfo.type}</p>
                    <p><span className="font-semibold">OS:</span> {deviceInfo.os}</p>
                    <p><span className="font-semibold">Browser:</span> {deviceInfo.browser}</p>
                    <p><span className="font-semibold">Version:</span> {deviceInfo.version}</p>
                    <p><span className="font-semibold">Last Active:</span> {formatDate(v.last_active)}</p>
                    <p><span className="font-semibold">First Seen:</span> {formatDate(v.created_at)}</p>
                  </div>
                }>
                  <Button  onMouseLeave={()=>setInfoTooltip(0)} onMouseEnter={()=>setInfoTooltip(id+1)} variant="ghost" isIconOnly className="h-6 w-6">
                    <Info className="h-4 w-4" />
                  </Button>
                </Tooltip>

              </div>
              <p className="text-sm text-muted-foreground">{deviceInfo.type}</p>
            </div>

            <div className="text-right mr-4">
              <p className="font-mono">{v.ip_address}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(v.last_active).toLocaleDateString()}
              </p>
            </div>

            <Button variant="ghost" isIconOnly className="ml-2">
              <X className="h-4 w-4" />
              <span className="sr-only">Remove device</span>
            </Button>
          </div>
        })
          : <div className="p-4 border-dashed border-2 w-full text-center dark:border-gray-200 border-gray-800 ">There is no any connected device. </div>}
      </div>
    </div>
    
  </>
}

export default SecuritySetting