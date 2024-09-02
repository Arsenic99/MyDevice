'use client'

import FullCalendar from '@fullcalendar/react'
import rrulePlugin from '@fullcalendar/rrule'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import timeGridPlugin from "@fullcalendar/timegrid"
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'

const CalendarPage = () => {
    const [event, setEvent] = useState();
    const router = useRouter();
    const params = useParams();
    const clickHandler = (event:any) => {
        router.push('./event?equipmentId='+event.event.extendedProps.equipmentId+'&&eventId='+event.event.id);
    }
    useEffect(() => {
        const fetchData = async () => { // фетч событии из сервера
            try {
                const event = await axios.get(`/api/${params.storeId}/events`);
                setEvent(event.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, []);
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    height={'80vh'}
                    events={event}
                    editable={false}
                    eventClick={(event)=>clickHandler(event)}
                />
            </div>
        </div>
    )
}

export default CalendarPage;