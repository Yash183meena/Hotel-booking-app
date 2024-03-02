import {useEffect} from 'react'

type ToastProps={
      message:string,
      type:"SUCCESS" | "ERROR",
      onClose:()=>void
      //onClose is the function in js/ts to close an particular modal or notification .It is an Callback function triggers
      //a callback function that is executed when a particular action or event triggers the closing of a UI element, 
}

//type ToastProps me se destruct karke vale nikal le
const Toast = ({message,type,onClose}:ToastProps) => {

      useEffect(()=>{
            const timer=setTimeout(()=>{
                  onClose();
            },5000);

            return ()=>{clearTimeout(timer)};

      },[onClose])

      //top-4 and right-4 to add some spacing between top of the window and toast componeent
      const styles=type==="SUCCESS"?"fixed top-4 right-4 z-50 p-4 rounded-md bg-green-600 text-white max-w-md"
      :"fixed top-4 right-4 text-white p-4 z-50 rounded-md bg-red-600 max-w-md"
  return (
    <div className={styles}>
       <div className="flex justify-center item-center">
            <span className="text-lg font-semibold">{message} </span>
       </div>
    </div>
  )
}

export default Toast;
