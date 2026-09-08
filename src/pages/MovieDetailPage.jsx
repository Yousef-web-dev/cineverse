import React, { useEffect, useMemo, useState } from "react";
import { movieDetailCSS, movieDetailStyles } from "../assets/dummyStyles";
import movies from "../assets/moviesData";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, Calendar, Play, Star, Clock, X, User } from "lucide-react";
import PageTransition from "../components/PageTransition";

const ROWS = [
  { id: "A", type: "standard", count: 8 },
  { id: "B", type: "standard", count: 8 },
  { id: "C", type: "standard", count: 8 },
  { id: "D", type: "recliner", count: 8 },
  { id: "E", type: "recliner", count: 8 },
];

const TOTAL_SEATS = ROWS.reduce((s, r) => s + r.count, 0);

const FallbackAvatar = ({ className = "w-12 h-12" }) => (
  <div
    className={`${className} bg-gray-700 rounded-full flex items-center justify-center text-sm text-gray-300`}
    aria-hidden="true"
  >
    ?
  </div>
);

/** Utility: extract a YouTube ID from either an ID or a full URL */
function extractYouTubeId(urlOrId) {
  if (!urlOrId) return null;
  if (/^[A-Za-z0-9_-]{6,}$/.test(urlOrId)) return urlOrId;

  const re =
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.*[?&]v=)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i;
  const m = urlOrId.match(re);
  return m ? m[1] : null;
}

/** Builds embed URL with autoplay and minimal related-video noise */
const getEmbedUrl = (id) =>
  id
    ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`
    : null;

/** Helpers to format dates/times in a target timezone */
const getParts = (dateLike, timeZone) => {
  const dt = typeof dateLike === "string" ? new Date(dateLike) : dateLike;
  const parts = new Intl.DateTimeFormat("en", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(dt);

  const map = {};
  for (const p of parts) {
    if (p.type !== "literal") map[p.type] = p.value;
  }
  map.dayPeriod = map.dayPeriod || map.ampm || map.AMPM;
  return map;
};

/** Returns date key 'YYYY-MM-DD' for the given date/ISO in given timezone */
const formatDateKey = (dateLike, timeZone = "Asia/Kolkata") => {
  const p = getParts(dateLike, timeZone);
  return `${p.year}-${p.month}-${p.day}`;
};

/** Returns a human time string like "1:30 PM" (12-hour) for the given ISO in timezone */
const formatTimeInTZ = (dateLike, timeZone = "Asia/Kolkata") => {
  const p = getParts(dateLike, timeZone);
  const hour = String(Number(p.hour));
  return `${hour}:${p.minute} ${String(
    p.dayPeriod ?? p.ampm ?? "",
  ).toUpperCase()}`;
};

const MovieDetailPage = () => {
  const { id } = useParams();

  const movie = useMemo(
    () => movies.find((m) => String(m.id) === String(id)),
    [id],
  );

  const navigate = useNavigate();

  // Trailer-related state
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedTrailerId, setSelectedTrailerId] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    if (!movie) {
      toast.error("Movie not found");
    }
  }, [movie]);

  /** Grouping slots by date */
  const showtimeDays = useMemo(() => {
    if (!movie) return [];

    const TZ = "Asia/Kolkata";
    const slotsByDate = {};

    (movie.slots || []).forEach((slot) => {
      try {
        let iso = null;
        let audi = null;

        if (!slot) return;

        if (typeof slot === "string") {
          iso = slot;
        } else if (typeof slot === "object") {
          iso =
            slot.time ||
            slot.datetime ||
            slot.iso ||
            slot.date ||
            slot.datetimeISO ||
            null;
          audi =
            slot.audi ||
            slot.audiName ||
            slot.auditorium ||
            slot.auditoriumName ||
            null;
        }

        if (!iso) return;
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return;

        const dateKey = formatDateKey(d, TZ);
        if (!slotsByDate[dateKey]) slotsByDate[dateKey] = [];
        slotsByDate[dateKey].push({ iso, audi });
      } catch (err) {
        // ignore invalid slot
      }
    });

    const dateKeys = Object.keys(slotsByDate).sort();

    return dateKeys.map((key) => {
      const [yy, mm, dd] = key.split("-").map(Number);
      const asDate = new Date(Date.UTC(yy, mm - 1, dd));
      const dayName = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        timeZone: TZ,
      }).format(asDate);
      const shortDay = new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        timeZone: TZ,
      }).format(asDate);
      const dateStr = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        timeZone: TZ,
      }).format(asDate);

      const rawSlots = slotsByDate[key] || [];

      const showtimes = rawSlots
        .map(({ iso, audi }) => {
          const d = new Date(iso);
          if (Number.isNaN(d.getTime())) return null;
          const timeLabel = formatTimeInTZ(iso, TZ);
          return {
            time: timeLabel,
            datetime: iso,
            timestamp: d.getTime(),
            audi: audi ?? null,
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.timestamp - b.timestamp)
        .map(({ time, datetime, audi }) => ({ time, datetime, audi }));

      return {
        date: key,
        dayName,
        shortDay,
        dateStr,
        showtimes,
      };
    });
  }, [movie]);

  // Reset selected day index safely
  useEffect(() => {
    if (showtimeDays.length === 0) {
      setSelectedDay(0);
      setSelectedTime(null);
      return;
    }
    setSelectedDay((cur) => (cur >= 0 && cur < showtimeDays.length ? cur : 0));
    setSelectedTime(null);
  }, [showtimeDays]);

  // Trailer handlers
  const openTrailer = (movieObj) => {
    const idFromField = movieObj?.trailerId ?? null;
    const id = idFromField || extractYouTubeId(movieObj?.trailer || "");
    if (!id) {
      toast.info("Trailer not available for this movie.");
      return;
    }
    setSelectedMovie(movieObj);
    setSelectedTrailerId(id);
    setShowTrailer(true);
  };

  const closeTrailer = () => {
    setShowTrailer(false);
    setSelectedTrailerId(null);
    setSelectedMovie(null);
  };

  if (!movie) {
    return (
      <div className={movieDetailStyles.notFoundContainer}>
        <div className={movieDetailStyles.notFoundContent}>
          <h2 className={movieDetailStyles.notFoundTitle}>Movie not found.</h2>
          <Link to="/movies" className={movieDetailStyles.notFoundLink}>
            Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  const handleTimeSelect = (datetime, isSoldOut) => {
    if (isSoldOut) {
      toast.warning("This showtime is completely booked.");
      return;
    }
    setSelectedTime(datetime);
    const key = encodeURIComponent(datetime);
    navigate(`/movies/${movie.id}/seat-selector/${key}`);
  };

  const handleBookNow = () => {
    if (selectedTime) {
      const key = encodeURIComponent(selectedTime);
      navigate(`/movies/${movie.id}/seat-selector/${key}`);
    } else {
      toast.error("Please select a showtime first");
    }
  };

  const getBookedCountFor = (datetime) => {
    try {
      const key = `bookings_${movie.id}_${datetime}`;
      const raw = localStorage.getItem(key);
      if (!raw) return 0;
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.length : 0;
    } catch (err) {
      return 0;
    }
  };

  return (
    <PageTransition>
      <div className={movieDetailStyles.container}>
        {showTrailer && selectedTrailerId && (
          <div className={movieDetailStyles.modalOverlay}>
            <div className={movieDetailStyles.modalContainer}>
              <button
                onClick={closeTrailer}
                className={movieDetailStyles.closeButton}
              >
                <X size={36} />
              </button>

              <div className={movieDetailStyles.videoContainer}>
                <iframe
                  key={selectedTrailerId}
                  width="100%"
                  height="100%"
                  src={getEmbedUrl(selectedTrailerId)}
                  title={`${selectedMovie?.title || "Trailer"} Trailer`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className={movieDetailStyles.videoIframe}
                />
              </div>
            </div>
          </div>
        )}

        <div className={movieDetailStyles.wrapper}>
          <div className={movieDetailStyles.header}>
            <Link to="/movies" className={movieDetailStyles.backButton}>
              <ArrowLeft size={18} />
              <span className={movieDetailStyles.backText}>Back</span>
            </Link>
          </div>

          {/* MOVIE TITLE */}
          <div className={movieDetailStyles.titleContainer}>
            <h1
              className={movieDetailStyles.movieTitle}
              style={{
                fontFamily: "'Cinzel', 'Times New Roman', serif",
                textShadow: "0 4px 20px rgba(220, 38, 38, 0.6)",
                letterSpacing: "0.08em",
              }}
            >
              {movie.title}
            </h1>

            <div className={movieDetailStyles.movieMeta}>
              <span className={movieDetailStyles.metaItem}>
                <Star
                  className={`${movieDetailStyles.metaIcon} ${movieDetailStyles.ratingIcon}`}
                />
                {movie.rating}/10
              </span>

              {movie.duration && (
                <span className={movieDetailStyles.metaItem}>
                  <Clock className={movieDetailStyles.metaIcon} />
                  {movie.duration}
                </span>
              )}

              {movie.genre && (
                <span className={movieDetailStyles.genreTag}>
                  {Array.isArray(movie.genre)
                    ? movie.genre.join(", ")
                    : movie.genre}
                </span>
              )}
            </div>
          </div>

          {/* MAIN LAYOUT */}
          <div className={movieDetailStyles.mainLayout}>
            {/* Left Column: Poster & Trailer Button */}
            <div className={movieDetailStyles.leftColumn}>
              <div className={movieDetailStyles.posterCard}>
                <div
                  className={movieDetailStyles.posterImage}
                  style={{ maxWidth: "320px" }}
                >
                  <img
                    src={movie.image || movie.poster || movie.img}
                    alt={movie.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "https://via.placeholder.com/320x480?text=No+Image";
                    }}
                    className={movieDetailStyles.posterImg}
                  />
                </div>

                <button
                  onClick={() => openTrailer(movie)}
                  className={movieDetailStyles.trailerButton}
                >
                  <Play size={18} />
                  <span>Watch Trailer</span>
                </button>
              </div>
            </div>

            {/* Right Column: Showtimes & Cast */}
            <div className={movieDetailStyles.rightColumns}>
              {/* Showtimes Section */}
              <div className={movieDetailStyles.showtimesCard}>
                <h3
                  className={movieDetailStyles.showtimesTitle}
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <Calendar className={movieDetailStyles.showtimesIcon} />
                  <span>Showtimes</span>
                </h3>

                <div className={movieDetailStyles.daySelection}>
                  {showtimeDays.map((day, index) => (
                    <button
                      key={day.date}
                      onClick={() => {
                        setSelectedDay(index);
                        setSelectedTime(null);
                      }}
                      className={`${movieDetailStyles.dayButton?.base} ${
                        selectedDay === index
                          ? movieDetailStyles.dayButton?.active
                          : movieDetailStyles.dayButton?.inactive
                      }`}
                    >
                      <div className={movieDetailStyles.dayName}>
                        {day.shortDay}
                      </div>
                      <div className={movieDetailStyles.dayDate}>
                        {day.dateStr}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Showtimes Grid */}
                <div className={movieDetailStyles.showtimesGrid}>
                  {showtimeDays[selectedDay]?.showtimes.map(
                    (showtime, index) => {
                      const bookedCount = getBookedCountFor(showtime.datetime);
                      const isSoldOut = bookedCount >= TOTAL_SEATS;

                      return (
                        <button
                          key={index}
                          onClick={() =>
                            handleTimeSelect(showtime.datetime, isSoldOut)
                          }
                          className={`${movieDetailStyles.timeButton?.base} ${
                            selectedTime === showtime.datetime
                              ? movieDetailStyles.timeButton?.active
                              : movieDetailStyles.timeButton?.inactive
                          }`}
                          title={
                            isSoldOut
                              ? "All seats booked for this showtime"
                              : `Seats available: ${Math.max(
                                  0,
                                  TOTAL_SEATS - bookedCount,
                                )}`
                          }
                          disabled={isSoldOut}
                        >
                          <span>{showtime.time}</span>
                          {isSoldOut && (
                            <span className={movieDetailStyles.soldOutBadge}>
                              Sold Out
                            </span>
                          )}
                        </button>
                      );
                    },
                  )}
                </div>

                {selectedTime && (
                  <div className={movieDetailStyles.proceedButton}>
                    <button
                      onClick={handleBookNow}
                      className={movieDetailStyles.bookButton}
                    >
                      Proceed to Seat Selection
                    </button>
                  </div>
                )}
              </div>

              {/* Cast Section */}
              <div className={movieDetailStyles.castCard}>
                <h3
                  className={movieDetailStyles.castTitle}
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <User className={movieDetailStyles.castIcon} />
                  <span>Cast</span>
                </h3>

                <div className={movieDetailStyles.castGrid}>
                  {movie.cast && movie.cast.length ? (
                    movie.cast.map((c, idx) => (
                      <div key={idx} className={movieDetailStyles.castItem}>
                        <div className={movieDetailStyles.castImageContainer}>
                          {c.img ? (
                            <img
                              src={c.img}
                              alt={c.name}
                              className={movieDetailStyles.castImage}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src =
                                  "https://via.placeholder.com/80?text=A";
                              }}
                            />
                          ) : (
                            <FallbackAvatar className="w-20 h-20 mx-auto" />
                          )}
                        </div>
                        <div className={movieDetailStyles.castName}>
                          {c.name}
                        </div>
                        <div className={movieDetailStyles.castRole}>
                          {c.role}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={movieDetailStyles.noCast}>
                      No Cast data available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* STORY SECTION */}
          <div className={movieDetailStyles.storyCard}>
            <h2
              className={movieDetailStyles.storyTitle}
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Story
            </h2>
            <p className={movieDetailStyles.storyText}>{movie.synopsis}</p>
          </div>

          {/* Director & Producer Section */}
          <div className={movieDetailStyles.crewGrid}>
            {/* Director */}
            <div className={movieDetailStyles.crewCard}>
              <div className={movieDetailStyles.crewHeader}>
                <User className={movieDetailStyles.crewIcon} />
                <h3
                  className={movieDetailStyles.crewTitle}
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Director
                </h3>
              </div>
              <div className={movieDetailStyles.crewContent}>
                {(() => {
                  const directors = Array.isArray(movie.director)
                    ? movie.director
                    : movie.director
                      ? [movie.director]
                      : [];

                  return (
                    <div className={movieDetailStyles.crewImageGrid}>
                      {directors.length ? (
                        directors.slice(0, 2).map((d, i) => (
                          <div key={i} className="flex flex-col items-center">
                            {d?.img ? (
                              <img
                                src={d.img}
                                alt={d.name || `Director ${i + 1}`}
                                className={movieDetailStyles.crewImage}
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src =
                                    "https://via.placeholder.com/96?text=D";
                                }}
                              />
                            ) : (
                              <div className={movieDetailStyles.fallbackAvatar}>
                                ?
                              </div>
                            )}
                            <div className={movieDetailStyles.crewName}>
                              {d?.name ?? "N/A"}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className={movieDetailStyles.fallbackAvatar}>
                            ?
                          </div>
                          <div className={movieDetailStyles.crewName}>N/A</div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Producer */}
            <div className={movieDetailStyles.crewCard}>
              <div className={movieDetailStyles.crewHeader}>
                <User className={movieDetailStyles.crewIcon} />
                <h3
                  className={movieDetailStyles.crewTitle}
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Producer
                </h3>
              </div>
              <div className={movieDetailStyles.crewContent}>
                {movie.producer?.img ? (
                  <img
                    src={movie.producer.img}
                    alt={movie.producer.name}
                    className={movieDetailStyles.crewImage}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "https://via.placeholder.com/96?text=P";
                    }}
                  />
                ) : (
                  <FallbackAvatar className="w-20 h-20 sm:w-24 sm:h-24 mb-3 sm:mb-4" />
                )}
                <div className={movieDetailStyles.crewName}>
                  {movie.producer?.name ?? "N/A"}
                </div>
              </div>
            </div>
          </div>
          <style>{movieDetailCSS}</style>
        </div>
      </div>
    </PageTransition>
  );
};

export default MovieDetailPage;