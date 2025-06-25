import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper function to generate random names
function generateRandomName(): string {
  const firstNames = [
    "Alex",
    "Jordan",
    "Taylor",
    "Morgan",
    "Casey",
    "Riley",
    "Avery",
    "Quinn",
    "Blake",
    "Cameron",
    "Dakota",
    "Ellis",
    "Finley",
    "Hayden",
    "Jamie",
    "Kai",
    "Logan",
    "Max",
    "Noah",
    "Peyton",
    "Reese",
    "Sage",
    "Sam",
    "Skyler",
    "Tay",
    "Adrian",
    "Bailey",
    "Charlie",
    "Drew",
    "Emery",
    "Francis",
    "Gray",
    "Harper",
    "Ivan",
    "Jules",
    "Kennedy",
    "Lane",
    "Micah",
    "Nico",
    "Ocean",
    "Phoenix",
    "River",
    "Rowan",
    "Spencer",
    "Storm",
    "Tatum",
    "Unity",
    "Val",
    "Winter",
  ];

  const lastNames = [
    "Anderson",
    "Brown",
    "Clark",
    "Davis",
    "Evans",
    "Fisher",
    "Garcia",
    "Harris",
    "Jackson",
    "Johnson",
    "Jones",
    "King",
    "Lee",
    "Martinez",
    "Miller",
    "Moore",
    "Nelson",
    "Parker",
    "Robinson",
    "Rodriguez",
    "Smith",
    "Taylor",
    "Thomas",
    "Thompson",
    "White",
    "Williams",
    "Wilson",
    "Young",
    "Allen",
    "Baker",
    "Carter",
    "Cooper",
    "Green",
    "Hall",
    "Hill",
    "Lewis",
    "Mitchell",
    "Perez",
    "Roberts",
    "Turner",
    "Walker",
    "Ward",
    "Watson",
    "Wright",
    "Adams",
    "Bell",
    "Brooks",
    "Cook",
    "Foster",
    "Gray",
  ];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return `${firstName} ${lastName}`;
}

// Helper function to generate email from name
function generateEmail(name: string): string {
  const [firstName, lastName] = name.toLowerCase().split(" ");
  const domains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "example.com",
    "test.com",
  ];
  const domain = domains[Math.floor(Math.random() * domains.length)];

  // Add some randomness to avoid duplicates
  const randomNum = Math.floor(Math.random() * 1000);
  return `${firstName}.${lastName}${randomNum}@${domain}`;
}

// Helper function to generate unique ID
function generateId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

async function main() {
  console.log("🌱 Starting to seed the database...");

  // Clear existing users (optional - comment out if you want to keep existing data)
  console.log("🗑️ Clearing existing users...");
  await prisma.user.deleteMany({});

  console.log("👥 Creating 50 users...");

  const users = [];

  for (let i = 0; i < 50; i++) {
    const name = generateRandomName();
    const email = generateEmail(name);
    const id = generateId();

    const user = {
      id,
      name,
      email,
      emailVerified: Math.random() > 0.3, // 70% chance of being verified
      image:
        Math.random() > 0.5
          ? `https://avatar.vercel.sh/${name.replace(" ", "")}`
          : null,
      createdAt: new Date(
        Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
      ), // Random date within last year
      updatedAt: new Date(),
    };

    users.push(user);
  }

  // Create users in batch
  const createdUsers = await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });

  console.log(`✅ Created ${createdUsers.count} users successfully!`);

  // Fetch and display some sample data
  const sampleUsers = await prisma.user.findMany({
    take: 5,
    select: {
      id: true,
      name: true,
      email: true,
      apiKey: true,
      emailVerified: true,
    },
  });

  console.log("\n📋 Sample users created:");
  console.table(sampleUsers);

  // Display API key count to verify uniqueness
  const totalUsers = await prisma.user.count();
  const uniqueApiKeys = await prisma.user.findMany({
    select: { apiKey: true },
    distinct: ["apiKey"],
  });

  console.log(`\n📊 Statistics:`);
  console.log(`Total users: ${totalUsers}`);
  console.log(`Unique API keys: ${uniqueApiKeys.length}`);
  console.log(
    `✅ All API keys are unique: ${totalUsers === uniqueApiKeys.length}`
  );
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
