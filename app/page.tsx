import EventCard from "@/components/EventCard"
import ExploreBtn from "@/components/ExploreBtn"
import { EventAttributes } from "@/database/event.model"
// import { NextResponse } from "next/server"



const BASE_URI = process.env.NEXT_PUBLIC_BASE_URI;
// console.log("BASE_URI => ", BASE_URI);

 const Home = async() => {
  
const res = await fetch(`${BASE_URI}/api/events`);
const { event:events} = await res.json(); 


  return (
      
    <section>
      <h1>The hub for every Dev <br /> Let's Meet in Event</h1>
      <p className="text-2xl text-center mt-5">Hackathons,Meet up ,conferences, Al in one Place </p>
      <ExploreBtn/>
  
       <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
  
         <ul className="events">
          {
           events && events.length > 0 &&  events.map((event:EventAttributes)=>(
         
         <li key={event.title}  >
       <EventCard 
         title={event.title}
         image={event.image}     
         slug={event.slug}
         location={event.location}
         date={event.date}    
         time={event.time}     
        />
      </li> 
        ))
        }
         </ul>
       </div>
    </section>   
  )}

export default Home