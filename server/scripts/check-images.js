import prisma from "../src/lib/prisma.js";

/**
 * Validates a single image URL: checks if it returns HTTP 200 and image/* content-type
 */
export async function checkImageUrl(url) {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "image/*,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(6000),
    });

    const contentType = res.headers.get("content-type") || "";
    const isImage = contentType.startsWith("image/");
    const ok = res.ok && isImage;

    return {
      status: res.status,
      contentType,
      ok,
      error: ok ? null : !res.ok ? `HTTP ${res.status}` : `Non-image content-type: ${contentType}`,
    };
  } catch (err) {
    return {
      status: 0,
      contentType: "",
      ok: false,
      error: err.name === "TimeoutError" ? "Timeout (6s)" : err.message,
    };
  }
}

export async function runImageHealthCheck() {
  console.log("Fetching all ProductMedia from database...\n");
  const mediaList = await prisma.productMedia.findMany({
    include: {
      product: {
        select: { id: true, title: true, slug: true, status: true },
      },
    },
    orderBy: { product: { title: "asc" } },
  });

  console.log(`Checking ${mediaList.length} media records...\n`);

  const results = [];
  for (const item of mediaList) {
    const check = await checkImageUrl(item.cdnUrl);
    results.push({
      slug: item.product?.slug || "unknown",
      title: item.product?.title || "Unknown",
      url: item.cdnUrl,
      status: check.status,
      contentType: check.contentType,
      ok: check.ok,
      error: check.error,
    });
  }

  const failures = results.filter((r) => !r.ok);
  const successes = results.filter((r) => r.ok);

  console.log("=========================================================================================");
  console.log(`IMAGE HEALTH REPORT: Total: ${results.length} | Passing: ${successes.length} | Failing: ${failures.length}`);
  console.log("=========================================================================================\n");

  if (failures.length > 0) {
    console.log("FAILURES (Blank boxes / Non-200 / Invalid content-type):");
    console.table(
      failures.map((f) => ({
        Slug: f.slug,
        Status: f.status,
        "Error / Note": f.error,
        URL: f.url.length > 60 ? f.url.slice(0, 57) + "..." : f.url,
      }))
    );
  } else {
    console.log("✓ All product media URLs returned HTTP 200 with valid image content-type!");
  }

  return { results, failures, successes };
}

if (process.argv[1]?.endsWith("check-images.js")) {
  runImageHealthCheck()
    .catch(console.error)
    .finally(async () => {
      await prisma.$disconnect();
    });
}
