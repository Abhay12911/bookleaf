import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import sampleData from "../data/bookleaf_sample_data.json" with { type: "json" };

const prisma = new PrismaClient();
const seedPassword = process.env.SEED_AUTHOR_PASSWORD || "BookLeafDemo123!";
const adminEmail = (process.env.SEED_ADMIN_EMAIL || "admin@bookleaf.com").toLowerCase();
const adminPassword = process.env.SEED_ADMIN_PASSWORD || "BookLeafAdmin123!";

function dateOrNull(value) {
  return value ? new Date(value) : null;
}

async function main() {
  const password = await bcrypt.hash(seedPassword, 12);
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "BookLeaf Admin",
      role: "ADMIN",
    },
    create: {
      name: "BookLeaf Admin",
      email: adminEmail,
      password: hashedAdminPassword,
      role: "ADMIN",
    },
  });

  for (const authorData of sampleData.authors) {
    const author = await prisma.user.upsert({
      where: { email: authorData.email.toLowerCase() },
      update: {
        sampleAuthorId: authorData.author_id,
        name: authorData.name,
        phone: authorData.phone,
        city: authorData.city,
        joinedDate: dateOrNull(authorData.joined_date),
      },
      create: {
        sampleAuthorId: authorData.author_id,
        name: authorData.name,
        email: authorData.email.toLowerCase(),
        password,
        role: "AUTHOR",
        phone: authorData.phone,
        city: authorData.city,
        joinedDate: dateOrNull(authorData.joined_date),
      },
    });

    for (const bookData of authorData.books) {
      await prisma.book.upsert({
        where: { sampleBookId: bookData.book_id },
        update: {
          title: bookData.title,
          isbn: bookData.isbn,
          genre: bookData.genre,
          publicationDate: dateOrNull(bookData.publication_date),
          status: bookData.status,
          mrp: bookData.mrp,
          authorRoyaltyPerCopy: bookData.author_royalty_per_copy,
          totalCopiesSold: bookData.total_copies_sold,
          totalRoyaltyEarned: bookData.total_royalty_earned,
          royaltyPaid: bookData.royalty_paid,
          royaltyPending: bookData.royalty_pending,
          lastRoyaltyPayoutDate: dateOrNull(bookData.last_royalty_payout_date),
          printPartner: bookData.print_partner,
          availableOn: bookData.available_on,
          authorId: author.id,
        },
        create: {
          sampleBookId: bookData.book_id,
          title: bookData.title,
          isbn: bookData.isbn,
          genre: bookData.genre,
          publicationDate: dateOrNull(bookData.publication_date),
          status: bookData.status,
          mrp: bookData.mrp,
          authorRoyaltyPerCopy: bookData.author_royalty_per_copy,
          totalCopiesSold: bookData.total_copies_sold,
          totalRoyaltyEarned: bookData.total_royalty_earned,
          royaltyPaid: bookData.royalty_paid,
          royaltyPending: bookData.royalty_pending,
          lastRoyaltyPayoutDate: dateOrNull(bookData.last_royalty_payout_date),
          printPartner: bookData.print_partner,
          availableOn: bookData.available_on,
          authorId: author.id,
        },
      });
    }
  }

  console.log(
    `Seeded ${sampleData.authors.length} authors and ${sampleData.authors.reduce(
      (count, author) => count + author.books.length,
      0
    )} books.`
  );
  console.log(`Seed author password: ${seedPassword}`);
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((error) => {
    console.error("Sample data seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
