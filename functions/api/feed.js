
const CATEGORIES = {
  world: "world news",
  cyber: "cybersecurity OR hacking OR data breach",
  ai: "artificial intelligence OR machine learning",
  technology: "technology OR science",
  intelligence: "defence OR intelligence OR national security"
};

export async function onRequest({ request, env }) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "public, max-age=60"
  };

  const respond = (data, status = 200) =>
    new Response(JSON.stringify(data), { status, headers });

  if (request.method !== "GET") {
    return respond({ success: false, error: "Method not allowed" }, 405);
  }

  if (!env.NEWS_API_KEY) {
    return respond({ success: false, error: "News API is not configured" }, 500);
  }

  const url = new URL(request.url);
  const category = (url.searchParams.get("category") || "world").toLowerCase();
  const search = (url.searchParams.get("q") || "").trim().slice(0, 100);

  if (!Object.hasOwn(CATEGORIES, category)) {
    return respond({ success: false, error: "Invalid news category" }, 400);
  }

  const newsUrl = new URL("https://newsapi.org/v2/everything");
  newsUrl.searchParams.set("q", search || CATEGORIES[category]);
  newsUrl.searchParams.set("language", "en");
  newsUrl.searchParams.set("sortBy", "publishedAt");
  newsUrl.searchParams.set("pageSize", "20");

  try {
    const upstream = await fetch(newsUrl.toString(), {
      headers: { "X-Api-Key": env.NEWS_API_KEY }
    });

    const data = await upstream.json();

    if (!upstream.ok || data.status !== "ok") {
      return respond({
        success: false,
        error: "News provider request failed"
      }, 502);
    }

    const articles = (data.articles || []).map(article => ({
      title: article.title,
      description: article.description,
      image: article.urlToImage,
      source: article.source?.name || "Unknown",
      publishedAt: article.publishedAt,
      url: article.url
    }));

    return respond({
      success: true,
      category,
      count: articles.length,
      articles
    });
  } catch {
    return respond({
      success: false,
      error: "Unable to connect to the news provider"
    }, 502);
  }
}

