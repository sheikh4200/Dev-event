import BookEvent from "@/components/bookEvent";
import EventCard from "@/components/EventCard";
import { EventAttributes } from "@/database";
import { fetchTheSameEvent } from "@/lib/actions/event.actions";
import Image from "next/image";

const BASE_URI = process.env.NEXT_PUBLIC_BASE_URI;

// Reusable items
const EventDetailsItems = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => {
  return (
    <div className="flex flex-row gap-2 font-bold">
      <Image src={icon} alt={alt} width={17} height={17} />
      <p>{label}</p>
    </div>
  );
};

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <ul>
      {agendaItems.map((agenda) => (
        <li key={agenda}>{agenda}</li>
      ))}
    </ul>
  </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-4 flex-wrap">
    {tags.map((tag) => (
      <div key={tag} className="pill flex-none">
        {tag}
      </div>
    ))}
  </div>
);

const booking = 10;

const EventDetails = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;

  const req = await fetch(`${BASE_URI}/api/events/${slug}`);
  const data = await req.json();

  // Safe fallback in case API returns { event: {...} } or directly the object
  const event = data.event ?? data;

  // Final destructuring
  const {
    title,
    description,
    image,
    overview,
    date,
    time,
    location,
    mode,
    audience,
    agenda,
    organizer,
    tags,
  } = event;

 const similarEvents : EventAttributes[]  = await fetchTheSameEvent(slug)   

  return (
    <section id="event" className="px-4 md:px-8">
      {/* Header */}
      <div className="header">
        <h1>Event Description</h1>
        <p className="mt-2">{description}</p>
      </div>

      {/* Main layout */}
      <div className="details flex flex-col lg:flex-row gap-10 mt-6">
        {/* LEFT CONTENT */}
        <div className="content flex-1 flex flex-col gap-6">

          {/* Responsive image wrapper */}
          <div className="w-full flex justify-start">
            <div className="w-full max-w-[900px] h-56 sm:h-72 md:h-96 lg:h-[450px] relative">
              <Image
                src={image || ""}
                alt={title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          <section className="flex flex-col gap-2">
            <h2>OverView</h2>
            <p>{overview}</p>
          </section>

          <section className="flex flex-col gap-2">
            <h2>Event Details</h2>
            <EventDetailsItems icon="/icons/calendar.svg" alt="calendar" label={date} />
            <EventDetailsItems icon="/icons/clock.svg" alt="clock" label={time} />
            <EventDetailsItems icon="/icons/pin.svg" alt="venue" label={location} />
            <EventDetailsItems icon="/icons/mode.svg" alt="mode" label={mode} />
            <EventDetailsItems icon="/icons/audience.svg" alt="audience" label={audience} />
          </section>

          <section>
            <h2>Agenda</h2>
            <EventAgenda agendaItems={agenda} />
          </section>

          <section className="flex flex-col gap-2">
            <h2>About The Organizer</h2>
            <p className="font-semibold font-sans">{organizer}</p>
          </section>

          <section className="flex flex-col gap-2">
            <h2>Tags</h2>
            <EventTags tags={tags} />
          </section>

          {/* Booking moves under image on mobile */}
          <div className="lg:hidden">
            <div className="signup-card mt-4">
        <h2 className="text-amber-400 text-center">Book Your Spot</h2>
              {booking > 0 ? (
                <p className="text-sm ">
                  join {booking} people who already booked their spot
                </p>
              ) : (
                <p>Be the first to book your spot</p>
              )}
              <BookEvent />
            </div>
          </div>
        </div>

        {/* RIGHT ASIDE — Desktop only */}
        <aside className="booking hidden lg:block w-[350px] flex-none">
          <div className="signup-card">
       <h2 className="text-amber-400 text-center">Book Your Spot</h2>
            {booking > 0 ? (
              <p className="text-sm">
                join {booking} people who already booked their spot
              </p>
            ) : (
              <p>Be the first to book your spot</p>
            )}
            <BookEvent />
          </div>
        </aside>
      </div>
      
          <br />
         
        <h2 className="text-amber-600">Similar Events</h2>
<div className="flex flex-wrap gap-4 mt-6">
  {similarEvents.length > 0 &&
    similarEvents.map(similarEvent => (
      <div
        key={similarEvent._id}
        className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
      >
        <EventCard {...similarEvent} />
      </div>
  ))}
</div>
    </section>
  );
};

export default EventDetails;
