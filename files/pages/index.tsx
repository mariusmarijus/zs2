import { useUser } from '@clerk/nextjs';
import { GetServerSideProps } from 'next';
import prisma from '../lib/prisma';

export const getServerSideProps: GetServerSideProps = async () => {
  const events = await prisma.event.findMany();
  return { props: { events } };
};

export default function Home({ events }) {
  const { user } = useUser();
  
  return (
    <div>
      <h1>Žmonės Sportuoja</h1>
      <div>
        <h2>Free and Credit-Based Outdoor Events</h2>
        {events.map((event) => (
          <div key={event.id}>
            <h3>{event.name}</h3>
            <p>{event.description}</p>
            <button>Book Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}