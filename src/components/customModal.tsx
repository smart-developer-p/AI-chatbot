import React, { MouseEventHandler } from "react"


interface props {
  isOpen?: boolean,
  onClose?: MouseEventHandler<HTMLDivElement>,
  children?: React.ReactNode
  height?:string
  width?:string
}

const CustomModal = (p: props) => {
  const { children = <></>, isOpen = false, onClose = () => { },height='',width='' } = p
  return  isOpen?(
    <>
      <div  className="fixed top-0 left-0 z-50 w-full h-full backdrop-blur-sm" onClick={onClose} ></div>
      <div className='absolute w-full h-full z-[60] top-0 left-0 overflow-auto ' >
        <div className='fixed w-full h-full z-0  bg-black opacity-30 m-0' onClick={onClose} />
        <div className={` backdrop-blur-md justify-self-center relative shadow-lg rounded-sm px-4 py-4 bg-zinc-100 dark:bg-zinc-800  ${width?width:'w-[90%] sm:w-[70%] md:w-[70%] xl:w-[50%]'} ${height?height:"h-auto max-h-[400px] top-1/4"}  overflow-x-hidden overflow-y-auto animate-[modal_0.2s_ease-in-out] mb-48 `} >

          {children}
        </div>
      </div>
    </>

  ):<></>
}

export default CustomModal