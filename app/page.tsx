import EventCard from "@/components/EventCard"
import ExploreBtn from "@/components/ExploreBtn"
import { events } from "@/lib/constants"



const Home = () => {
  return (
      
    <section>
      <h1>The hub for every Dev <br /> Let's Meet in Event</h1>
      <p className="text-2xl text-center mt-5">Hackathons,Meet up ,conferences, Al in one Place </p>
      <ExploreBtn/>
  
       <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
  
         <ul className="events">
          {
            events.map((event)=>(
              <li key={event.title}>
                < EventCard  {...event} />
              </li>
            ))
          }
          
         </ul>


       </div>



    </section>
     
  )
}

export default Home