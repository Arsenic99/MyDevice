'use client'

import FullCalendar from '@fullcalendar/react'
import rrulePlugin from '@fullcalendar/rrule'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import timeGridPlugin from "@fullcalendar/timegrid"
import { useEffect, useState } from 'react'
import axios from 'axios'

const CalendarPage = () => {
    const events = [
        {
            title: 'first event',
            start: '2024-04-21',
        },
        {
            title: 'secons event',
            start: '2024-04-20',
            end: '2024-04-22',
        },
        {
            title: 'event1',
            rrule:{
                freq: 'daily',
                interval: 1,
                dtstart: '2024-04-24T00:00:00.000Z',
                until: ''
            }
        }
    ]
    const [event, setEvent] = useState();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const event = await axios.get(`/api/99637b7f-79f9-497c-b3ef-6c8bf09ab514/events`);
                setEvent(event.data);
            } catch (error) {
                // Handle any errors
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, []);
    console.log(event)
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
                    editable={true}
                />
            </div>
        </div>
    )
}

export default CalendarPage;