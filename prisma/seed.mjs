import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { hash as bcryptHash } from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is required. Set it in .env then run: npx prisma db seed");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const email =
  process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase() ||
  "rased@shomoyerghotona.com";
const password =
  process.env.INITIAL_ADMIN_PASSWORD || "Admin123@";
const name = process.env.INITIAL_ADMIN_NAME?.trim() || "Admin";

const categoriesSeed = [
  { name: "জাতীয়", slug: "jatiyo", order: 1, description: "বাংলাদেশের জাতীয় খবর" },
  { name: "রাজনীতি", slug: "rajneeti", order: 2, description: "দলীয় ও রাজনৈতিক সংবাদ" },
  { name: "অর্থনীতি", slug: "orthoniti", order: 3, description: "ব্যবসা, বাজেট, ব্যাংকিং" },
  { name: "আন্তর্জাতিক", slug: "antorjatik", order: 4, description: "বিশ্বজুড়ে গুরুত্বপূর্ণ খবর" },
  { name: "খেলা", slug: "khela", order: 5, description: "দেশি-বিদেশি ক্রীড়া সংবাদ" },
  { name: "বিনোদন", slug: "binodon", order: 6, description: "চলচ্চিত্র, নাটক, সঙ্গীত" },
  { name: "প্রযুক্তি", slug: "projukti", order: 7, description: "ডিজিটাল ও প্রযুক্তি আপডেট" },
  { name: "শিক্ষা", slug: "shikkha", order: 8, description: "শিক্ষা নীতি, ভর্তি, পরীক্ষা" },
  { name: "স্বাস্থ্য", slug: "shastho", order: 9, description: "চিকিৎসা ও জনস্বাস্থ্য" },
  { name: "ব্লগ", slug: "blog", order: 10, description: "মতামত ও বিশ্লেষণধর্মী লেখা" },
];

const postsSeed = [
  {
    title: "ঢাকায় গণপরিবহন সংস্কারে নতুন রূপরেখা ঘোষণা",
    slug: "dhakay-gonoporibohon-songskare-notun-ruporekha",
    location: "ঢাকা",
    categorySlug: "jatiyo",
    section: "TOP",
    order: 1,
    featuredImage: "/images/jatiyo.png",
    excerpt: "রাজধানীর বাস রুট, টিকিটিং ও নিরাপত্তা নিয়ে তিন মাসের কর্মপরিকল্পনা দিয়েছে মন্ত্রণালয়।",
    content:
      "রাজধানীতে যাত্রী ভোগান্তি কমাতে গণপরিবহনে সমন্বিত সংস্কারের নতুন রূপরেখা ঘোষণা করেছে সংশ্লিষ্ট মন্ত্রণালয়। এই পরিকল্পনায় ডিজিটাল টিকিটিং, নির্দিষ্ট স্টপেজ ব্যবস্থাপনা এবং রুট র‍্যাশনালাইজেশনের কথা বলা হয়েছে।\n\nকর্তৃপক্ষ জানিয়েছে, পরীক্ষামূলকভাবে কয়েকটি করিডরে স্মার্ট মনিটরিং চালু হবে। যাত্রীদের মতামত নেওয়ার জন্য একটি হেল্পলাইন এবং মোবাইল অ্যাপও চালু করা হবে।",
    tags: ["নগর", "গণপরিবহন"],
  },
  {
    title: "চট্টগ্রাম বন্দরে কনটেইনার ছাড়ে রেকর্ড",
    slug: "chattogram-bondore-container-chare-record",
    location: "চট্টগ্রাম",
    categorySlug: "orthoniti",
    section: "SORBOSESH",
    order: 2,
    featuredImage: "/images/economy.png",
    excerpt: "গত ২৪ ঘণ্টায় আমদানি-রপ্তানি কনটেইনার হ্যান্ডলিংয়ে নতুন রেকর্ড হয়েছে বলে জানিয়েছে বন্দর কর্তৃপক্ষ।",
    content:
      "চট্টগ্রাম বন্দরে পণ্য খালাস ও লোডিং কার্যক্রমে নতুন গতি এসেছে। সংশ্লিষ্টরা বলছেন, ডক ম্যানেজমেন্ট সফটওয়্যার আপডেট ও কর্মঘণ্টা সমন্বয়ের ফলে এই অগ্রগতি সম্ভব হয়েছে।\n\nরপ্তানিকারক সংগঠন আশা করছে, এই ধারাবাহিকতা থাকলে পরিবহন ব্যয় কমবে এবং সময়মতো শিপমেন্ট নিশ্চিত করা সহজ হবে।",
    tags: ["বন্দর", "বাণিজ্য"],
  },
  {
    title: "রাজশাহীতে আমচাষে স্মার্ট সেচ ব্যবস্থার বিস্তার",
    slug: "rajshahite-amchase-smart-sech",
    location: "রাজশাহী",
    categorySlug: "projukti",
    section: "STANDARD",
    order: 3,
    featuredImage: "/images/technology.png",
    excerpt: "ফলন বাড়াতে কৃষকেরা ব্যবহার করছেন সেন্সরভিত্তিক সেচ ও মাটির আর্দ্রতা মনিটরিং।",
    content:
      "রাজশাহীর আমবাগানে স্মার্ট সেচ প্রযুক্তি জনপ্রিয় হচ্ছে। স্থানীয় কৃষি দপ্তরের সহায়তায় কৃষকেরা মাঠে সেন্সর বসিয়ে মাটির আর্দ্রতা পরিমাপ করছেন।\n\nবিশেষজ্ঞরা বলছেন, এতে পানির অপচয় কমার পাশাপাশি রোগবালাই নিয়ন্ত্রণেও সহায়তা মিলছে।",
    tags: ["কৃষি", "স্মার্ট-ফার্মিং"],
  },
  {
    title: "খুলনায় নদীভাঙন রোধে জরুরি বাঁধ মেরামত শুরু",
    slug: "khulnay-nodivangon-rodhe-joruri-badh-meramot",
    location: "খুলনা",
    categorySlug: "jatiyo",
    section: "LIVE",
    order: 1,
    featuredImage: "/images/jatiyo.png",
    excerpt: "জোয়ারের চাপ বেড়ে যাওয়ায় ঝুঁকিপূর্ণ এলাকায় দ্রুত মেরামত কাজ শুরু করেছে পানি উন্নয়ন বোর্ড।",
    content:
      "খুলনার উপকূলীয় এলাকায় নদীভাঙন রোধে জরুরি ভিত্তিতে বাঁধ মেরামত কাজ শুরু হয়েছে। স্থানীয় প্রশাসন ও স্বেচ্ছাসেবীরা একসঙ্গে কাজ করছে।\n\nঅভিযোগ আছে, কিছু এলাকায় আগের মেরামত টেকসই হয়নি। এবার স্থায়ী সমাধানে উন্নত উপকরণ ব্যবহারের আশ্বাস দেওয়া হয়েছে।",
    tags: ["উপকূল", "দুর্যোগ"],
  },
  {
    title: "সিলেটে মেডিকেল কলেজ হাসপাতালে নতুন কার্ডিয়াক ইউনিট",
    slug: "silete-medical-college-notun-cardiac-unit",
    location: "সিলেট",
    categorySlug: "shastho",
    section: "STANDARD",
    order: 4,
    featuredImage: "/images/health.png",
    excerpt: "হৃদরোগীদের দ্রুত সেবা দিতে ২৪ ঘণ্টা চালু থাকছে নতুন কার্ডিয়াক ইউনিট।",
    content:
      "সিলেট মেডিকেল কলেজ হাসপাতালে নতুন কার্ডিয়াক ইউনিট চালু হয়েছে। বিশেষজ্ঞ চিকিৎসক, নার্স এবং প্রয়োজনীয় যন্ত্রপাতি নিয়ে ইউনিটটি ২৪ ঘণ্টা সেবা দেবে।\n\nরোগী ও স্বজনেরা বলছেন, আগে ঢাকায় যেতে হতো, এখন স্থানীয়ভাবে চিকিৎসা পাওয়ার সুযোগ বাড়ছে।",
    tags: ["হাসপাল", "হৃদরোগ"],
  },
  {
    title: "রংপুরে শিক্ষাপ্রতিষ্ঠানে ডিজিটাল উপস্থিতি রেজিস্টার",
    slug: "rongpure-digital-uposthiti-register",
    location: "রংপুর",
    categorySlug: "shikkha",
    section: "STANDARD",
    order: 5,
    featuredImage: "/images/jatiyo.png",
    excerpt: "বিদ্যালয়ে শিক্ষার্থী উপস্থিতি ও ফলাফল ট্র্যাকিংয়ে চালু হলো অ্যাপভিত্তিক রেজিস্টার।",
    content:
      "রংপুরের একাধিক স্কুলে শিক্ষার্থী উপস্থিতি রেকর্ড এখন ডিজিটাল প্ল্যাটফর্মে হচ্ছে। অভিভাবকেরা এসএমএস ও অ্যাপ নোটিফিকেশনের মাধ্যমে তথ্য পাচ্ছেন।\n\nশিক্ষকরা মনে করছেন, এতে অনুপস্থিতি কমবে এবং ঝরে পড়া রোধে দ্রুত পদক্ষেপ নেওয়া সহজ হবে।",
    tags: ["স্কুল", "ডিজিটাল-শিক্ষা"],
  },
  {
    title: "ময়মনসিংহে ক্ষুদ্র উদ্যোক্তাদের জন্য সুদসহনীয় ঋণ কর্মসূচি",
    slug: "mymensinghe-khudro-udyokta-rin-kormosuchi",
    location: "ময়মনসিংহ",
    categorySlug: "orthoniti",
    section: "STANDARD",
    order: 6,
    featuredImage: "/images/economy.png",
    excerpt: "নারী ও তরুণ উদ্যোক্তাদের অগ্রাধিকার দিয়ে নতুন ঋণ বিতরণ শুরু।",
    content:
      "ময়মনসিংহে ক্ষুদ্র উদ্যোক্তাদের জন্য নতুন ঋণ কর্মসূচি চালু হয়েছে। উদ্যোক্তাদের প্রশিক্ষণ ও বাজার সংযোগ সুবিধাও দেওয়া হবে বলে জানিয়েছে সংশ্লিষ্ট কর্তৃপক্ষ।\n\nব্যবসায়ী সংগঠনগুলোর দাবি, ঋণ প্রক্রিয়া সরল ও দ্রুত করা গেলে স্থানীয় অর্থনীতি আরও সক্রিয় হবে।",
    tags: ["উদ্যোক্তা", "এসএমই"],
  },
  {
    title: "কক্সবাজারে পর্যটন মৌসুমে নিরাপত্তা জোরদার",
    slug: "coxsbazare-porjoton-mousume-nirapotta-jordar",
    location: "কক্সবাজার",
    categorySlug: "jatiyo",
    section: "SORBOSESH",
    order: 3,
    featuredImage: "/images/jatiyo.png",
    excerpt: "সমুদ্রসৈকত ও হোটেল এলাকায় পর্যটক নিরাপত্তায় বাড়ানো হয়েছে টহল।",
    content:
      "কক্সবাজারে পর্যটন মৌসুম শুরু হওয়ায় নিরাপত্তা ব্যবস্থায় জোর দেওয়া হয়েছে। সমুদ্রসৈকতের নির্দিষ্ট জোনে লাইফগার্ড ও পর্যটন পুলিশের সংখ্যা বাড়ানো হয়েছে।\n\nপর্যটন সংশ্লিষ্টরা আশা করছেন, নিরাপদ পরিবেশ নিশ্চিত হলে দেশি-বিদেশি পর্যটক প্রবাহ বাড়বে।",
    tags: ["পর্যটন", "নিরাপত্তা"],
  },
  {
    title: "গাজীপুরে শিল্পাঞ্চলে বায়ুদূষণ নিয়ন্ত্রণে নতুন মনিটরিং",
    slug: "gazipure-shilpanchole-bayudushon-monitoring",
    location: "গাজীপুর",
    categorySlug: "shastho",
    section: "STANDARD",
    order: 7,
    featuredImage: "/images/health.png",
    excerpt: "কারখানা এলাকার বায়ুমান পর্যবেক্ষণে সেন্সর নেটওয়ার্ক স্থাপন শুরু হয়েছে।",
    content:
      "গাজীপুর শিল্পাঞ্চলে বায়ুদূষণ নিয়ন্ত্রণে নতুন মনিটরিং ব্যবস্থা চালু করা হয়েছে। বিভিন্ন পয়েন্টে এয়ার কোয়ালিটি সেন্সর বসিয়ে রিয়েল-টাইম ডেটা সংগ্রহ করা হবে।\n\nপরিবেশবাদীরা বলছেন, তথ্য উন্মুক্ত করা হলে দায়বদ্ধতা বাড়বে এবং নীতি প্রয়োগ সহজ হবে।",
    tags: ["দূষণ", "পরিবেশ"],
  },
  {
    title: "টাইগারদের সামনে কঠিন চ্যালেঞ্জ",
    slug: "tigers-challenge",
    location: "ঢাকা",
    categorySlug: "khela",
    section: "TOP",
    order: 2,
    featuredImage: "/images/sports.png",
    excerpt: "আসন্ন সিরিজে টাইগারদের সামনে বড় চ্যালেঞ্জ দেখছেন বিশেষজ্ঞরা।",
    content: "বাংলাদেশ ক্রিকেট দল এখন এক সন্ধিক্ষণে। অভিজ্ঞ ও তরুণদের সমন্বয়ে দল সাজানো হলেও মাঠের পারফরম্যান্সে ধারাবাহিকতা প্রয়োজন।",
    tags: ["ক্রিকেট", "টাইগারস"],
  },
  {
    title: "ঢালিউডে নতুন ছবির জোয়ার",
    slug: "dhallywood-new-movies",
    location: "ঢাকা",
    categorySlug: "binodon",
    section: "SORBOSESH",
    order: 4,
    featuredImage: "/images/entertainment.png",
    excerpt: "ঈদের পরে সিনেমা হলগুলোতে ভিড় বাড়ছে।",
    content: "বাংলা চলচ্চিত্রের সুদিন ফিরছে বলে মনে করছেন হল মালিকেরা। নতুন গল্পের সিনেমা দর্শকদের হলমুখী করছে।",
    tags: ["সিনেমা", "বিনোদন"],
  },
  {
    title: "ব্লগ: ঢাকার গণপরিবহন ব্যবস্থায় ছোট ছোট পরিবর্তনের বড় প্রভাব",
    slug: "blog-dhakar-gonoporibohon-poribortoner-probhav",
    location: "ঢাকা",
    categorySlug: "blog",
    section: "STANDARD",
    order: 8,
    featuredImage: "/images/blog.png",
    excerpt: "সুশৃঙ্খল স্টপেজ, ডিজিটাল ভাড়া আর যাত্রী তথ্য—তিনটি ছোট পরিবর্তন কিভাবে শহরকে বদলাতে পারে।",
    content:
      "ঢাকার যানজট নিয়ে হতাশা দীর্ঘদিনের। কিন্তু কিছু বাস্তবসম্মত ও ছোট পরিবর্তনও বড় প্রভাব ফেলতে পারে। যেমন: নির্ধারিত স্টপেজ বাস্তবায়ন, রিয়েল-টাইম বাস ট্র্যাকিং এবং সমন্বিত ভাড়া ব্যবস্থা।\n\nনাগরিক, পরিবহন মালিক ও প্রশাসন—তিন পক্ষের সমন্বয় ছাড়া টেকসই সমাধান সম্ভব নয়। এই ব্লগে সেই সমন্বয়ের কিছু ব্যবহারিক দিক তুলে ধরা হয়েছে।",
    tags: ["ব্লগ", "নগর-পরিকল্পনা"],
  },
];

async function main() {
  const passwordHash = await bcryptHash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: "ADMIN",
      name,
      isActive: true,
    },
    create: {
      email,
      passwordHash,
      role: "ADMIN",
      name,
    },
  });

  for (const cat of categoriesSeed) {
    const existing = await prisma.category.findFirst({
      where: {
        OR: [{ slug: cat.slug }, { name: cat.name }],
      },
    });

    if (existing) {
      await prisma.category.update({
        where: { id: existing.id },
        data: {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          order: cat.order,
        },
      });
    } else {
      await prisma.category.create({
        data: cat,
      });
    }
  }

  const categories = await prisma.category.findMany({
    where: {
      slug: {
        in: categoriesSeed.map((c) => c.slug),
      },
    },
  });
  const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

  for (const item of postsSeed) {
    const category = categoryBySlug.get(item.categorySlug);
    if (!category) continue;

    await prisma.post.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        content: item.content,
        excerpt: item.excerpt,
        location: item.location,
        categoryId: category.id,
        status: "PUBLISHED",
        section: item.section,
        order: item.order,
        publishedAt: new Date(),
      },
      create: {
        title: item.title,
        slug: item.slug,
        content: item.content,
        excerpt: item.excerpt,
        location: item.location,
        categoryId: category.id,
        status: "PUBLISHED",
        section: item.section,
        order: item.order,
        publishedAt: new Date(),
      },
    });
  }

  console.log(`Admin user ready: ${email}`);
  console.log(`Seeded ${categoriesSeed.length} Bangla categories and ${postsSeed.length} Bangla posts/blogs.`);
  console.log("Change INITIAL_ADMIN_PASSWORD in .env and re-seed for production.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
