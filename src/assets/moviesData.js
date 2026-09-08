// src/assets/moviesData.js
//
// SINGLE SOURCE OF TRUTH for all movies in the app.
// Combines the 3 previously-separate files (which had colliding IDs):
//   - dummymoviedata.js  -> ids 1-6   (Fighter, Peddi, Baaghi 4, Kantara, Param Sundari, Maalik)
//   - dummymdata.js      -> ids 7-54  (action/horror/comedy/adventure, already has a default export)
//   - dummyrdata.js      -> re-numbered to ids 55-64 (Jolly LLB 3, Avatar, ... Anaconda, Tron Ares)
//
// Every page (MoviePage, Movies, MovieDetailPage) should import `movies` from THIS file only.
// That's what fixes the "click a movie -> wrong movie/empty details" bug: there is now only
// one array and one ID space, so /movies/:id always resolves to the same movie everywhere.

import featuredRaw from "./dummymoviedata"; // default export, ids 1-6
import catalogRaw from "./dummymdata";      // default export, ids 7-54 (already combined)
import releasesRaw from "./dummyrdata";     // default export, ids 1-10 (needs re-numbering)

// --- 1) Normalize "featured" movies (ids 1-6) ---
// dummymoviedata.js used `img` instead of `image`, and mixed-case categories.
// We normalize both so every movie object has the same shape everywhere.
const featured = featuredRaw.map((m) => ({
  ...m,
  image: m.image || m.img,
  category: (m.category || "").toLowerCase(),
}));

// --- 2) Catalog movies (ids 7-54) are already in the right shape, use as-is ---
const catalog = catalogRaw;

// --- 3) Re-number the "new releases" movies so they don't collide with 1-54 ---
// These originally had NO detail data (no rating/duration/genre/slots/trailer),
// which is exactly why the detail page looked empty/broken for them.
// We give them safe defaults here so the detail page never breaks — but you should
// replace these placeholder values with real data whenever you have it.
const releases = releasesRaw.map((m, index) => ({
  ...m,
  id: 55 + index, // 55, 56, 57 ... avoids clashing with ids 1-54 above
  category: (m.category || "").toLowerCase(),
  rating: m.rating ?? null,
  duration: m.duration ?? null,
  genre: m.genre || m.category,
  synopsis: m.synopsis || "Full details for this movie are coming soon.",
  slots: m.slots || [], // no showtimes yet -> Showtimes section will just show "no showtimes" instead of crashing
  trailer: m.trailer || null,
  isNewRelease: true, // lets Movies.jsx (homepage) pick these out specifically
}));

const movies = [...featured, ...catalog, ...releases];

export default movies;