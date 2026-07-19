import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { hashPassword } from "../src/lib/password";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Curated, individually-verified Unsplash photo IDs (free license, no
// attribution required — https://unsplash.com/license). Swap these for real
// uploads via the admin gallery once you have actual resort photography.
const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

async function main() {
  const resort = await prisma.resort.upsert({
    where: { slug: "islaverde-maldives" },
    update: {},
    create: {
      name: "Islaverde Maldives",
      slug: "islaverde-maldives",
      description:
        "A private island escape in the heart of the Maldives — overwater and beachfront villas set against turquoise lagoons.",
      address: "Islaverde Atoll",
      city: "Malé",
      country: "Maldives",
    },
  });

  const amenityNames = [
    "Private Pool",
    "Ocean View",
    "Free WiFi",
    "Butler Service",
    "Breakfast Included",
    "Air Conditioning",
    "Mini Bar",
    "Snorkeling Gear",
  ];
  const amenities = await Promise.all(
    amenityNames.map((name) =>
      prisma.amenity.upsert({ where: { name }, update: {}, create: { name } }),
    ),
  );
  const amenityByName = Object.fromEntries(amenities.map((a) => [a.name, a.id]));

  const villaDefs = [
    {
      slug: "overwater-villa",
      name: "Overwater Villa",
      description:
        "Suspended above the lagoon with a private glass-floor deck and direct ocean access.",
      basePricePerNight: 850,
      capacity: 2,
      totalRooms: 4,
      amenities: ["Private Pool", "Ocean View", "Free WiFi", "Butler Service", "Breakfast Included"],
      imageIds: ["1514282401047-d79a71a590e8", "1590523277543-a94d2e4eb00b", "1586861642026-74a6da22a3cd"],
    },
    {
      slug: "beachfront-pool-villa",
      name: "Beachfront Pool Villa",
      description: "Steps from the white sand, with a private plunge pool and open-air lounge.",
      basePricePerNight: 690,
      capacity: 3,
      totalRooms: 6,
      amenities: ["Private Pool", "Ocean View", "Free WiFi", "Breakfast Included", "Air Conditioning"],
      imageIds: ["1602002418679-43121356bf41", "1557750505-e7b4d1c40410", "1499793983690-e29da59ef1c2"],
    },
    {
      slug: "lagoon-suite",
      name: "Lagoon Suite",
      description: "An intimate suite with panoramic lagoon views and a sunken outdoor bath.",
      basePricePerNight: 540,
      capacity: 2,
      totalRooms: 8,
      amenities: ["Ocean View", "Free WiFi", "Air Conditioning", "Mini Bar"],
      imageIds: ["1575231902142-29aaec0bd547", "1620483829312-71b2ec172fd0", "1564469780933-37609ec45780"],
    },
    {
      slug: "sunset-deluxe-villa",
      name: "Sunset Deluxe Villa",
      description: "West-facing villa built for golden-hour views, with a wraparound deck.",
      basePricePerNight: 610,
      capacity: 2,
      totalRooms: 5,
      amenities: ["Private Pool", "Ocean View", "Free WiFi", "Mini Bar", "Snorkeling Gear"],
      imageIds: ["1609601540898-52ca92508901", "1614505241498-80a3ec936595", "1602002418816-5c0aeef426aa"],
    },
    {
      slug: "family-beach-villa",
      name: "Family Beach Villa",
      description: "Two-bedroom beachfront villa with a shared lounge, built for families.",
      basePricePerNight: 980,
      capacity: 5,
      totalRooms: 3,
      amenities: [
        "Private Pool",
        "Ocean View",
        "Free WiFi",
        "Breakfast Included",
        "Air Conditioning",
        "Snorkeling Gear",
      ],
      imageIds: ["1551918120-9739cb430c6d", "1586861642026-74a6da22a3cd", "1557750505-e7b4d1c40410"],
    },
  ];

  for (const def of villaDefs) {
    const villa = await prisma.villa.upsert({
      where: { slug: def.slug },
      update: {},
      create: {
        resortId: resort.id,
        name: def.name,
        slug: def.slug,
        description: def.description,
        basePricePerNight: def.basePricePerNight,
        capacity: def.capacity,
        totalRooms: def.totalRooms,
        amenities: { connect: def.amenities.map((n) => ({ id: amenityByName[n] })) },
      },
    });

    const existingImages = await prisma.galleryImage.count({ where: { villaId: villa.id } });
    if (existingImages === 0) {
      await prisma.galleryImage.createMany({
        data: def.imageIds.map((id, i) => ({
          resortId: resort.id,
          villaId: villa.id,
          category: "VILLA" as const,
          url: unsplash(id),
          caption: `${def.name} — view ${i + 1}`,
          order: i,
        })),
      });
    }
  }

  const diningDefs = [
    {
      slug: "the-reef",
      name: "The Reef",
      description: "Fresh-caught seafood served over the water at sunset.",
      cuisineType: "Seafood",
      openingHours: "6:00 PM – 10:30 PM",
      imageIds: ["1779249430124-b5bf40d4f9c9", "1597213515962-3d0a60f05feb"],
    },
    {
      slug: "sandbar-grill",
      name: "Sandbar Grill",
      description: "Beachside grill and bar, open all day for casual island dining.",
      cuisineType: "Grill & Bar",
      openingHours: "11:00 AM – 11:00 PM",
      imageIds: ["1677517497394-87d635cf7e10", "1766937754702-6c92a3804e1f"],
    },
    {
      slug: "lagoon-cafe",
      name: "Lagoon Café",
      description: "All-day café with breakfast, coffee, and light lagoon-view fare.",
      cuisineType: "Café",
      openingHours: "6:30 AM – 6:00 PM",
      imageIds: ["1782558399208-1f511bb57177", "1619676907714-0b9d46a0e764"],
    },
  ];

  for (const def of diningDefs) {
    const dining = await prisma.dining.upsert({
      where: { slug: def.slug },
      update: {},
      create: {
        resortId: resort.id,
        name: def.name,
        slug: def.slug,
        description: def.description,
        cuisineType: def.cuisineType,
        openingHours: def.openingHours,
      },
    });

    const existingImages = await prisma.galleryImage.count({ where: { diningId: dining.id } });
    if (existingImages === 0) {
      await prisma.galleryImage.createMany({
        data: def.imageIds.map((id, i) => ({
          resortId: resort.id,
          diningId: dining.id,
          category: "DINING" as const,
          url: unsplash(id),
          caption: `${def.name} — view ${i + 1}`,
          order: i,
        })),
      });
    }
  }

  const resortWide = [
    { id: "1578922746465-3a80a228f223", category: "RESORT" as const, caption: "Island aerial view" },
    { id: "1620065487644-1080510335f5", category: "RESORT" as const, caption: "Infinity pool" },
    { id: "1773924093206-9a433a14bb44", category: "RESORT" as const, caption: "Overwater spa" },
    { id: "1708649290066-5f617003b93f", category: "ACTIVITIES" as const, caption: "Reef snorkeling" },
    { id: "1719584128248-ec41df8a41de", category: "ACTIVITIES" as const, caption: "Lagoon kayaking" },
    { id: "1763581616094-c1b4097972d4", category: "ACTIVITIES" as const, caption: "Sunset cruise" },
  ];
  const existingResortWide = await prisma.galleryImage.count({
    where: { resortId: resort.id, villaId: null, diningId: null },
  });
  if (existingResortWide === 0) {
    await prisma.galleryImage.createMany({
      data: resortWide.map((img, i) => ({
        resortId: resort.id,
        category: img.category,
        url: unsplash(img.id, i === 0 ? 1920 : 1200),
        caption: img.caption,
        order: i,
      })),
    });
  }

  const adminEmail = "admin@islaverde.com";
  const adminPassword = "IslaverdeAdmin123!";
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Islaverde Admin",
      role: "ADMIN",
      password: await hashPassword(adminPassword),
    },
  });

  console.log("Seed complete.");
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
