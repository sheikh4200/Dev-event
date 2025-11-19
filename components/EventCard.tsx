import Image from "next/image"
import Link from "next/link"

interface props{
    title:string,
    image:string,
    slug: string,
    location : string,
    date: string,
    time:string
}

const EventCard = ({title , image, slug, location, date ,time} : props) => {
  return (
    <Link href={`event/${slug}`} id="eventCard">
     <Image src={image} alt="image" width={410} height={300} className="poster"/>
    
    <div className="flex flex-row gap-1.5">
      <Image src={"/icons/pin.svg"} alt="location" width={14} height={14}/>
      <p>{location}</p>
    </div>

     <div className="text-2xl">
      <p className="title">{title}</p>
     </div>


     <div className="datetime ">
      <div className="flex flex-row gap-1.5">
        <Image src={"/icons/clock.svg"} alt="clock" width={14} height={14}/>
        <p>{time}</p>
        |  <div className="flex flex-row gap-2 mr-3 ml-3">
          <Image src={"/icons/calendar.svg"} alt="calendar" width={14} height={14} />
        <p>{date}</p></div>
      </div>
     </div>

    </Link>
  )
}

export default EventCard;