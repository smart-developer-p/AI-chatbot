import React, { useRef, useState } from "react";
import CustomModal from "../customModal";
import { Avatar, Divider, Switch } from "@nextui-org/react";
import { AiOutlineUser } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  //to-do: userdata fetching

  const [UserInfo, setUserInfo] = useState({
    avatar: "/images/avatar.png",
    name: "Alpha Star",
    email: "alpha_star@gmail.com",
    retention: true,
  });

  const [isNameChanging, setIsnameChaning] = useState(false);
  const [isEmailChanging, setIsEmailChanging] = useState(false);

  const [file, setFile] = useState<File>();

  const FileInputRef = useRef<HTMLInputElement>(null);

  const handleSeleteFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files) {
      setFile(e.target.files[0]);
      setUserInfo({
        ...UserInfo,
        avatar: URL.createObjectURL(e.target.files[0]),
      });
    }
  };
  const handleChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...UserInfo, name: e.target.value });
  };
  const handleChangeUserEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...UserInfo, email: e.target.value });
  };

  const navigate = useNavigate();

  return (
    <div>
      <CustomModal isOpen={true} onClose={() => navigate(-1)}>
        <div>
          <div className="flex justify-between p-3 items-center">
            <div className=" text-xl">Avatar</div>
            <div
              className="flex items-end"
              onClick={() => FileInputRef.current?.click()}
            >
              {" "}
              <Avatar
                size="lg"
                src={UserInfo.avatar}
                className="w-10  sm:w-14 md:w-20 h-auto aspect-square text-large translate-x-2/4 "
                icon={<AiOutlineUser className="w-8/12 h-auto" />}
              />{" "}
              <BiEdit className="w-1/2 z-[50] opacity-80 hover:opacity-100 active:opacity-50" />
            </div>
          </div>
          <Divider />
          <div className="max-xs:block flex justify-between p-3">
            <div className=" text-xl">User Name</div>
            <div className="flex  items-center whitespace-nowrap ">
              {" "}
              {isNameChanging ? (
                <input
                  className="p-1 bg-transparent   focus:outline-slate-500 "
                  autoFocus
                  value={UserInfo.name}
                  onChange={handleChangeUserName}
                  onBlur={() => setIsnameChaning(false)}
                />
              ) : (
                <div className="p-1 max-xs:w-full">{UserInfo.name}</div>
              )}
              &nbsp;&nbsp;
              <BiEdit
                onClick={() => setIsnameChaning(true)}
                className="w-1/2 z-[50] opacity-80 hover:opacity-100 active:opacity-50"
              />
            </div>
          </div>
          <Divider />
          <div className="max-xs:block flex justify-between p-3">
            <div className=" text-xl">Email</div>
            <div className="flex  items-center whitespace-nowrap">
              {isEmailChanging ? (
                <input
                  className="p-1 bg-transparent   focus:outline-slate-500 "
                  autoFocus
                  value={UserInfo.email}
                  onChange={handleChangeUserEmail}
                  onBlur={() => setIsEmailChanging(false)}
                />
              ) : (
                <div className="p-1  max-xs:w-full">{UserInfo.email}</div>
              )}
              &nbsp;&nbsp;
              <BiEdit
                onClick={() => setIsEmailChanging(true)}
                className="w-1/2 z-[50] opacity-80 hover:opacity-100 active:opacity-50"
              />
            </div>
          </div>
          <Divider />
          <div className="max-xs:block flex justify-between items-center p-3">
            <div>
              <div className=" text-xl">AI Data Retention</div>
              <div className=" text-sm  opacity-50 max-xs:w-3/4 w-2/3">
                AI Data Retention allows Cerina to use your searches to improve
                AI models. Turn this setting off if you wish to exclude your
                data from this process
              </div>
            </div>
            <div>
              <Switch
                className=" float-end"
                defaultSelected
                color="success"
                size="sm"
                onValueChange={(isSelected) =>
                  setUserInfo({ ...UserInfo, retention: isSelected })
                }
                isSelected={UserInfo.retention}
              ></Switch>
            </div>
          </div>
          <input
            ref={FileInputRef}
            onChange={handleSeleteFile}
            type="file"
            className="hidden"
          />
        </div>
      </CustomModal>
    </div>
  );
};

export default Profile;
