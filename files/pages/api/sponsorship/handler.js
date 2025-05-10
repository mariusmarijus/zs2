import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const { email, amount, transactionStatus } = JSON.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(404).json({ error: 'User not found' });

  // Add credits to the user
  await prisma.user.update({
    where: { email },
    data: { credits: { increment: amount } },
  });

  // Store the sponsorship transaction
  await prisma.sponsorship.create({
    data: {
      userEmail: email,
      amount,
      status: transactionStatus,  // Completed or Pending
    },
  });

  res.status(200).json({ success: true });
}