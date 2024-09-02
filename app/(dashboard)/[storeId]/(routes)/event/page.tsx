'use client'

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

const EventPage = ({
    params
}:{
    params: {storeId: string}
}) => {
    const equipmentId = useSearchParams().get('equipmentId')
    const eventId = useSearchParams().get('eventId')
    console.log(equipmentId, eventId)
    useEffect(()=>{
        //Фетч ивент страницу
    },[])
    return (
        <div>
            This is event page.
        </div>
    )
}

export default EventPage;