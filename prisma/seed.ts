import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { hashPassword } from "../src/lib/password";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Stable placeholder photos (LoremFlickr, tag-matched + locked so the same
// URL always resolves to the same image). Swap these for real uploads via
// the admin gallery once you have actual resort photography.
const stockImage = (tags: string, lock: number) =>
  `https://loremflickr.com/800/600/${tags}?lock=${lock}`;

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
      imageTags: "maldives,overwater,villa",
    },
    {
      slug: "beachfront-pool-villa",
      name: "Beachfront Pool Villa",
      description: "Steps from the white sand, with a private plunge pool and open-air lounge.",
      basePricePerNight: 690,
      capacity: 3,
      totalRooms: 6,
      amenities: ["Private Pool", "Ocean View", "Free WiFi", "Breakfast Included", "Air Conditioning"],
      imageTags: "maldives,beach,villa,pool",
    },
    {
      slug: "lagoon-suite",
      name: "Lagoon Suite",
      description: "An intimate suite with panoramic lagoon views and a sunken outdoor bath.",
      basePricePerNight: 540,
      capacity: 2,
      totalRooms: 8,
      amenities: ["Ocean View", "Free WiFi", "Air Conditioning", "Mini Bar"],
      imageTags: "maldives,lagoon,suite,resort",
    },
    {
      slug: "sunset-deluxe-villa",
      name: "Sunset Deluxe Villa",
      description: "West-facing villa built for golden-hour views, with a wraparound deck.",
      basePricePerNight: 610,
      capacity: 2,
      totalRooms: 5,
      amenities: ["Private Pool", "Ocean View", "Free WiFi", "Mini Bar", "Snorkeling Gear"],
      imageTags: "maldives,sunset,villa,deck",
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
      imageTags: "maldives,family,villa,beach",
    },
  ];

  let imageLock = 100;
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
        data: [0, 1, 2].map((i) => ({
          resortId: resort.id,
          villaId: villa.id,
          category: "VILLA" as const,
          url: stockImage(def.imageTags, imageLock++),
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
      imageTags: "maldives,restaurant,seafood,overwater",
    },
    {
      slug: "sandbar-grill",
      name: "Sandbar Grill",
      description: "Beachside grill and bar, open all day for casual island dining.",
      cuisineType: "Grill & Bar",
      openingHours: "11:00 AM – 11:00 PM",
      imageTags: "maldives,beach,bar,grill",
    },
    {
      slug: "lagoon-cafe",
      name: "Lagoon Café",
      description: "All-day café with breakfast, coffee, and light lagoon-view fare.",
      cuisineType: "Café",
      openingHours: "6:30 AM – 6:00 PM",
      imageTags: "maldives,cafe,breakfast,resort",
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
        data: [0, 1].map((i) => ({
          resortId: resort.id,
          diningId: dining.id,
          category: "DINING" as const,
          url: stockImage(def.imageTags, imageLock++),
          caption: `${def.name} — view ${i + 1}`,
          order: i,
        })),
      });
    }
  }

  const resortWide = [
    { tags: "maldives,resort,aerial", category: "RESORT" as const, caption: "Island aerial view" },
    { tags: "maldives,pool,infinity", category: "RESORT" as const, caption: "Infinity pool" },
    { tags: "maldives,spa,resort", category: "RESORT" as const, caption: "Overwater spa" },
    { tags: "maldives,snorkeling,reef", category: "ACTIVITIES" as const, caption: "Reef snorkeling" },
    { tags: "maldives,kayak,lagoon", category: "ACTIVITIES" as const, caption: "Lagoon kayaking" },
    { tags: "maldives,sunset,cruise", category: "ACTIVITIES" as const, caption: "Sunset cruise" },
  ];
  const existingResortWide = await prisma.galleryImage.count({
    where: { resortId: resort.id, villaId: null, diningId: null },
  });
  if (existingResortWide === 0) {
    await prisma.galleryImage.createMany({
      data: resortWide.map((img, i) => ({
        resortId: resort.id,
        category: img.category,
        url: stockImage(img.tags, imageLock++),
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
