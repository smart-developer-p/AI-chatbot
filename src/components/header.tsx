import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { BsLayoutSidebar } from "react-icons/bs";
import { ThemeSwitch } from "./theme-switch";
import { useAuth } from "@/hooks/use-auth";
import { MdLogout } from "react-icons/md";
import { deleteSession } from "@/services/session";
import { useNavigate } from "react-router-dom";

type P = {
  toggleSideBar: () => void;
  isOpen:boolean
};
export default function Header(props: P) {
  const { toggleSideBar } = props;
  const { loading, user, isLoggedIn, setIsLoggedIn, setUser } = useAuth();
  const navigate = useNavigate();

  const handlelogout = () => {
    deleteSession();
    setUser(null);
    setIsLoggedIn(false);
    navigate("/");
  };

  if (loading) {
    return null;
  }
  return (
    <div className="absolute w-full px-2 pt-4 z-30 bg-background">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <Button isIconOnly onClick={toggleSideBar} className={`${props.isOpen?'hidden':''}`} >
            <BsLayoutSidebar className={`h-4 w-4  `} />
          </Button>
          <Select selectedKeys={["cerina"]} className="w-32" variant="faded">
            <SelectItem key={"cerina"}>Cerina</SelectItem>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitch />

          {isLoggedIn && (
            <Dropdown>
              <DropdownTrigger>
                <Avatar
                  size="sm"
                  name={user?.full_name || "Unknown"}
                  className="cursor-pointer"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem
                  key="profile"
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </DropdownItem>
                <DropdownItem key="docs" onClick={()=>navigate(0)} >Docs</DropdownItem>
                <DropdownItem key="apis" onClick={()=>navigate('/setting?id=Your_APIs')} >Your API's</DropdownItem>
                <DropdownItem
                  key="edit"
                  onClick={handlelogout}
                  startContent={<MdLogout />}
                >
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </div>
    </div>
  );
}
