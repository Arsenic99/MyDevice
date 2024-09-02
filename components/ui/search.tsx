import { Input } from "@/components/ui/input"

export default function Search({
    input,
    setInput,
    submitHandler
}:{
    input:any,
    setInput: (input: any)=>void,
    submitHandler: (e:any)=>void
}) {

    return (
        <form onSubmit={(e:any)=>submitHandler(e)} className="flex items-center ml-auto w-full max-w-sm space-x-2 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-900 pl-2 py-1">
            <SearchIcon className="h-4 w-4 cursor-pointer" onClick={(e:any)=>submitHandler(e)}/>
            <Input type="search" placeholder="Search by serial number" className="w-full border-0 h-8 font-semibold focus:outline-none" value={input} onChange={(e:any)=>setInput(e.target.value)}/>
        </form>
    )
}

function SearchIcon(props:any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}