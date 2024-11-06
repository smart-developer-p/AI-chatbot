import { Button } from "@nextui-org/react"
import { BsCheck2All, BsStarFill } from "react-icons/bs"
import { IoCloseOutline } from "react-icons/io5"
import { useNavigate } from "react-router-dom"

const Upgrade_Plan = () => {
  const navigate = useNavigate()
  return (
    <div  >
      <IoCloseOutline className="w-8 h-8  right-[10%] top-[10%] fixed" onClick={() => navigate(-1)} />
      <div className="max-sm:text-2xl text-4xl font-bold w-full justify-self-center text-center p-12 pt-24"  >Upgrade Your Plan </div>

      <div className="max-sm:block flex justify-between  max-w-5xl justify-self-center " >
        <div className="max-sm:w-auto w-1/2  min-h-[500px] max-xs:m-2 m-8 border-2 rounded-3xl px-6 py-8 " >
          <div className="text-3xl font-semibold px-10">Free</div>
          <div className="px-8">Rs. 0/month</div>
          <Button className="w-full text-2xl my-4  bg-transparent border-zinc-400 border-2 p-6 rounded-2xl "   >Your Current Plan</Button>
          <div>
            <p className="flex items-center py-2" ><BsCheck2All className=" text-green-500" />&nbsp;Lorem ipsum dolor sit amet consectetur.
            </p>
            <p className="flex items-center py-2" >
              <BsCheck2All className=" text-green-500" />&nbsp;
              Sapien in magnis nam at eget ipsum.
            </p>
          </div>
        </div>
        <div className="max-sm:w-auto w-1/2  min-h-[500px] max-xs:m-2 m-8 border-2 rounded-3xl px-6 py-8 " >
          <div className="text-3xl font-semibold px-10 flex items-center "   >
            <div className="relative w-8 h-6" >
              <BsStarFill color="#00ff11" className=" absolute w-3/5 h-3/5 left-1/2 -translate-x-1/2 top-0 " />
              <BsStarFill color="#00ff11" className=" absolute w-3/5 h-3/5 left-0   bottom-0" />
              <BsStarFill color="#00ff11" className=" absolute w-3/5 h-3/5 right-0  bottom-0 " />
            </div>
           
            Plus</div>
          <div className="px-8">Rs. 5,000/month</div>
          <Button className="w-full text-2xl my-4   p-6 rounded-2xl " color="success"  >


            Upgrade Plan</Button>
          <div>
            <p className="flex items-center py-2" ><BsCheck2All className=" text-green-500" />&nbsp;Lorem ipsum dolor sit amet consectetur.
            </p>
            <p className="flex items-center py-2" >
              <BsCheck2All className=" text-green-500" />&nbsp;
              Sapien in magnis nam at eget ipsum.
            </p>
            <p className="flex items-center py-2" >
              <BsCheck2All className=" text-green-500" />&nbsp;
              At arcu semper amet massa elementum dignissim.
            </p>
            <p className="flex items-center py-2" >
              <BsCheck2All className=" text-green-500" />&nbsp;
              Faucibus maecenas facilisis aliquam accumsan m.               </p>
            <p className="flex items-center py-2" >
              <BsCheck2All className=" text-green-500" />&nbsp;
              Massa sit condimentum nulla dolor.              </p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Upgrade_Plan