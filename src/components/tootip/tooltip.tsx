import { useState } from "react";

type P = {
    children: any;
    content: any
};
export function Tooltip(props: P) {

    const [hover, setHover] = useState(false);
    return (
        <div className="relative rounded-md">
            <div className={`${hover ? 'block' : 'hidden'} absolute bottom-0 max-w-[300px] bg-black`}>
                <div className="flex flex-col">
                    {props.content}
                </div>
            </div>
            <div className="" onMouseOut={() => [
                setHover(false)
            ]}
                onMouseOver={() => {
                    setHover(true)
                }}
            >
                {
                    props.children
                }
            </div>
        </div>
    );
}
