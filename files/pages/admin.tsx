import { auth, clerkClient } from '@clerk/nextjs/server';
import { GetServerSideProps } from 'next';
import prisma from '../lib/prisma';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = auth(ctx.req);
  if (!userId) return { redirect: { destination: '/sign-in', permanent: false } };

  const user = await clerkClient.users.getUser(userId);
  const isAdmin = user.publicMetadata.role === 'admin';

  if (!isAdmin) {
    return { redirect: { destination: '/', permanent: false } };
  }

  const sponsorships = await prisma.sponsorship.findMany({
    include: {
      user: true,
    },
  });

  return { props: { sponsorships } };
};

export default function AdminPage({ sponsorships }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">🎛️ Administratoriaus Valdymas</h1>
      <div className="my-4">
        <h2 className="text-xl">Sponsoriai ir Kredito Perdavimas</h2>
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">💰 Visi parėmimo įrašai</h3>
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Vartotojas</th>
                <th className="border p-2">Kreditų suma</th>
                <th className="border p-2">Mokėjimo statusas</th>
              </tr>
            </thead>
            <tbody>
              {sponsorships.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="border p-2">{transaction.user.email}</td>
                  <td className="border p-2">{transaction.amount} kreditai</td>
                  <td className="border p-2">{transaction.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}