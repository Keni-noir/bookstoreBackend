import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter })

async function main() {
  // Create users with books
  const alice = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.com',
      username: 'Alice',
      password: 'qwerTRE234',
      books: {
        create: {
          title: "Mere Christianity",
          author: "C.S. Lewis",
          publishedDate: "1952-01-01T00:00:00Z",
          price: 18,
          description: "A classic Christian apologetics work explaining the core beliefs of Christianity.",
        },
      },
    },
  })

  // Seed books from the array
  for (const bookData of books) {
    const { userId, ...bookWithoutUserId } = bookData;
    
    await prisma.user.update({
      where: { id: userId },
      data: {
        books: {
          create: bookWithoutUserId,
        },
      },
    });
  }

  console.log("Database seeded successfully!");
}

const books = [
  {
    "title": "The Cost of Discipleship",
    "author": "Dietrich Bonhoeffer",
    "publishedDate": "1937-01-01T00:00:00Z",
    "price": 20,
    "description": "A profound exploration of what it means to truly follow Christ.",
    "userId": 2
  },
  {
    "title": "Confessions",
    "author": "Saint Augustine",
    "publishedDate": "0397-01-01T00:00:00Z",
    "price": 16,
    "description": "An autobiographical work reflecting on Augustine’s journey to faith.",
    "userId": 3
  },
  {
    "title": "The Problem of Pain",
    "author": "C.S. Lewis",
    "publishedDate": "1940-01-01T00:00:00Z",
    "price": 15,
    "description": "A theological reflection on suffering and God’s goodness.",
    "userId": 4
  },
  {
    "title": "Orthodoxy",
    "author": "G.K. Chesterton",
    "publishedDate": "1908-01-01T00:00:00Z",
    "price": 17,
    "description": "A witty and thoughtful defense of Christian belief.",
    "userId": 1
  },
  {
    "title": "The Lord of the Rings",
    "author": "J.R.R. Tolkien",
    "publishedDate": "1954-07-29T00:00:00Z",
    "price": 35,
    "description": "An epic fantasy adventure set in Middle-earth.",
    "userId": 2
  },
  {
    "title": "The Chronicles of Narnia",
    "author": "C.S. Lewis",
    "publishedDate": "1950-10-16T00:00:00Z",
    "price": 28,
    "description": "A fantasy series filled with Christian symbolism and adventure.",
    "userId": 3
  },
  {
    "title": "1984",
    "author": "George Orwell",
    "publishedDate": "1949-06-08T00:00:00Z",
    "price": 14,
    "description": "A dystopian novel about totalitarianism and surveillance.",
    "userId": 4
  },
  {
    "title": "Brave New World",
    "author": "Aldous Huxley",
    "publishedDate": "1932-01-01T00:00:00Z",
    "price": 13,
    "description": "A futuristic society shaped by technology and control.",
    "userId": 1
  },
  {
    "title": "The Hobbit",
    "author": "J.R.R. Tolkien",
    "publishedDate": "1937-09-21T00:00:00Z",
    "price": 19,
    "description": "A fantasy adventure about Bilbo Baggins’ unexpected journey.",
    "userId": 4
  }
]

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e: unknown) => {
    const message = e instanceof Error ? e.message : String(e);
    console.error("Seeding error:", message)
    await prisma.$disconnect()
    process.exit(1)
  })
