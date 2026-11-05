import prisma from "../src/lib/prisma.js";

const UPDATES = {
  "fellow-stagg-ekg": "https://images.unsplash.com/photo-1592417766326-088bf3da80c5?w=800&auto=format&fit=crop&q=80",
  "wd-black-sn850x-2tb": "https://images.unsplash.com/photo-1686705562930-4f3e46f620d8?w=800&auto=format&fit=crop&q=80",
  "logitech-mx-master-3s": "https://images.unsplash.com/photo-1623371748986-9a829391f7c9?w=800&auto=format&fit=crop&q=80",
  "apple-airpods-pro-2": "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&auto=format&fit=crop&q=80",
  "apple-airtag-4-pack": "https://images.unsplash.com/photo-1620787259628-39a4d9937bac?w=800&auto=format&fit=crop&q=80",
  "logitech-mx-keys-s": "https://images.unsplash.com/photo-1623371748986-9a829391f7c9?w=800&auto=format&fit=crop&q=80",
  "valve-steam-deck-oled-512gb": "https://images.unsplash.com/photo-1665608130535-d9a71bce53b9?w=800&auto=format&fit=crop&q=80",
  "anker-735-nano-ii-65w": "https://images.unsplash.com/photo-1596877445530-ad74838754c6?w=800&auto=format&fit=crop&q=80",
  "samsung-t7-shield-2tb": "https://images.unsplash.com/photo-1721333084639-0f64b0583875?w=800&auto=format&fit=crop&q=80",
  "elgato-stream-deck-mk2": "https://upload.wikimedia.org/wikipedia/commons/6/67/Elgato_Stream_Deck_%2B.jpg",
};

async function main() {
  console.log("Connecting to PostgreSQL to update product media URLs...");

  for (const [slug, cdnUrl] of Object.entries(UPDATES)) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { media: true },
    });

    if (!product) {
      console.log(`⚠️ Product not found: ${slug}`);
      continue;
    }

    if (product.media.length > 0) {
      await prisma.productMedia.updateMany({
        where: { productId: product.id },
        data: { cdnUrl },
      });
      console.log(`✓ Updated media for ${slug}`);
    } else {
      await prisma.productMedia.create({
        data: {
          productId: product.id,
          cdnUrl,
          isPrimary: true,
          sortOrder: 0,
        },
      });
      console.log(`+ Created media for ${slug}`);
    }
  }

  console.log("\nAll product media URLs successfully updated in PostgreSQL database!");
}

main()
  .catch((e) => {
    console.error("Error updating product media:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
