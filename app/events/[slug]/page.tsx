


import Image from "next/image";
import { notFound } from "next/navigation";


const BASE_URI = process.env.NEXT_PUBLIC_BASE_URI;

const EventDetails = async ({ params }: { params: {slug :string} }) => {
    const { slug } = await params
    const req = await fetch(`${BASE_URI}/api/events/${slug}`,{
         cache: "no-store",
    });
    
const data = await req.json();
const {event : description,overview,image,title,agenda, time ,date,location,tags ,mode ,audience ,organizer} = data.event || data;

    

    return (
        <section className="w-full min-h-screen bg-[#102c29] text-white p-8 flex flex-col lg:flex-row gap-8">
      
      {/* Left Side: Event Details */}
     <div className="lg:w-2/3 flex flex-col gap-8">
  {/* Title */}
  <section className="border-b border-gray-700 pb-4">
    <h1 className="text-5xl font-bold">{title}</h1>
  </section>

  {/* Description */}
  <section className="border-b border-gray-700 pb-4">
    <p className="text-lg">{description}</p>
  </section>

  {/* Event Image */}
  <section className="border-b border-gray-700 pb-4">
    <div className="w-full h-80 lg:h-[400px] overflow-hidden rounded-xl">
      <img src={image} alt={title} className="w-full h-full object-cover" />
    </div>
  </section>

  {/* Overview */}
  <section className="border-b border-gray-700 pb-4">
    <h2 className="text-2xl font-semibold mb-2">Overview</h2>
    <p>{overview}</p>
  </section>

  {/* Event Details */}
  <section className="border-b border-gray-700 pb-4">
    <h2 className="text-2xl font-semibold mb-2">Event Details</h2>
    <ul className="space-y-1">
      <li className="flex flex-row gap-2"><strong>Date:</strong> <Image src="/icons/calendar.svg" alt="date" width={16} height={16}/>
      {date}
      </li>

      <li className="flex flex-row gap-2"><strong>Time:</strong>
      <Image src="/icons/clock.svg" alt="time" width={16} height={16}/>
       {time}</li>

      <li className="flex flex-row gap-2"><strong>Venue:</strong> 
      <Image src="/icons/pin.svg" alt="venue" width={16} height={16}/>
      {location}</li>

      <li className="flex flex-row gap-2"><strong>Mode:</strong> 
      <Image src="/icons/mode.svg" alt="mode" width={16} height={16}/>
      {mode}</li>

      <li className="flex flex-row gap-2"><strong>Audience:</strong>
      <Image src="/icons/audience.svg" alt="mode" width={16} height={16}/>
       {audience}
       </li>

    </ul>
  </section>

  {/* Agenda */}
  <section className="border-b border-gray-700 pb-4">
    <h2 className="text-2xl font-semibold mb-2">Agenda</h2>
    <p>{agenda}</p>
  </section>

  {/* About Organizer */}
  <section className="border-b border-gray-700 pb-4">
    <h2 className="text-2xl font-semibold mb-2">About Organizer</h2>
    <p>{organizer}</p>
  </section>

  {/* Tags */}
  <section className="pb-4">
    <div className="flex flex-wrap gap-2">
      {tags.map((tag: string, index: number) => (
        <span
          key={index}
          className="bg-green-700 px-3 py-1 rounded-full text-sm"
        >
          {tag}
        </span>
      ))}
    </div>
  </section>
</div>


      {/* Right Side: Booking Section */}
      <div className="lg:w-1/3 bg-green-900 p-6 rounded-xl flex flex-col gap-4 sticky top-20">
        <h2 className="text-3xl font-bold mb-4">Book Your Spot</h2>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Name"
            className="p-3 rounded-md text-black"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="p-3 rounded-md text-black"
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 transition-colors p-3 rounded-md font-semibold"
          >
            Book Now
          </button>
        </form>
      </div>
    </section>
    );
};

export default EventDetails;



