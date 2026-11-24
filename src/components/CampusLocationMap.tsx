import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
  APILoadingStatus,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { AnimatePresence, motion } from 'motion/react';
import { Clock, ExternalLink, MapPin, Phone, RefreshCw, Shuffle, Star } from 'lucide-react';
import { CampusLocation, KARACHI_CAMPUSES } from '../data/consultancyData';

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

interface LiveReviewItem {
  authorName: string;
  authorPhoto?: string;
  authorUrl?: string;
  rating: number;
  relativeTime: string;
  text: string;
  googleMapsUri?: string;
  flagContentUri?: string;
}

interface LivePlaceSnapshot {
  placeId: string;
  displayName?: string;
  formattedAddress?: string;
  phoneNumber?: string;
  rating?: number;
  userRatingCount?: number;
  openNowText?: string;
  googleMapsUri?: string;
  reviews: LiveReviewItem[];
}

function CampusMarker({
  campus,
  isActive,
  infoOpen,
  onSelect,
  onCloseInfo,
}: {
  campus: CampusLocation;
  isActive: boolean;
  infoOpen: boolean;
  onSelect: (campus: CampusLocation) => void;
  onCloseInfo: () => void;
}) {
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: campus.lat, lng: campus.lng }}
        onClick={() => onSelect(campus)}
        title={campus.name}
      >
        <Pin
          background={isActive ? '#DC1E25' : '#0B2249'}
          borderColor="#FFFFFF"
          glyphColor="#FFFFFF"
          scale={isActive ? 1.25 : 1.05}
        />
      </AdvancedMarker>

      {isActive && infoOpen && marker && (
        <InfoWindow anchor={marker} maxWidth={275} onCloseClick={onCloseInfo}>
          <div className="p-1 text-slate-900">
            <p className="font-display text-sm font-bold text-[#0B2249] mb-1">
              {campus.name}
            </p>
            <p className="text-xs text-slate-600 mb-1.5">{campus.address}</p>
            <p className="font-mono text-xs font-semibold text-[#DC1E25] tabular-nums mb-2">
              {campus.phone}
            </p>
            <a
              href={campus.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0B2249] hover:text-[#DC1E25] underline"
            >
              Open in Google Maps
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

function MapCameraController({ activeCampus }: { activeCampus: CampusLocation }) {
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.panTo({ lat: activeCampus.lat, lng: activeCampus.lng });
      map.setZoom(14);
    }
  }, [map, activeCampus]);

  return null;
}

function MapStatusMonitor() {
  const status = useApiLoadingStatus();

  useEffect(() => {
    if (status === APILoadingStatus.AUTH_FAILURE || status === APILoadingStatus.FAILED) {
      window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
    }
  }, [status]);

  return null;
}

function LivePlacesFetcher({
  activeCampus,
  refreshTick,
  onSnapshot,
  onStatusChange,
}: {
  activeCampus: CampusLocation;
  refreshTick: number;
  onSnapshot: (campusId: string, snapshot: LivePlaceSnapshot | null) => void;
  onStatusChange: (status: { loading: boolean; note: string | null }) => void;
}) {
  const placesLib = useMapsLibrary('places');

  useEffect(() => {
    let cancelled = false;
    if (!placesLib) return;

    const fetchLivePlace = async () => {
      onStatusChange({ loading: true, note: null });
      try {
        const { places } = await placesLib.Place.searchByText({
          textQuery: activeCampus.googlePlaceQuery,
          fields: [
            'id',
            'displayName',
            'formattedAddress',
            'nationalPhoneNumber',
            'rating',
            'userRatingCount',
            'reviews',
            'regularOpeningHours',
            'googleMapsURI',
          ],
          locationBias: {
            center: { lat: activeCampus.lat, lng: activeCampus.lng },
            radius: 1500,
          },
          maxResultCount: 1,
        });

        if (cancelled) return;

        const place = places?.[0];
        if (!place) {
          onSnapshot(activeCampus.id, null);
          onStatusChange({
            loading: false,
            note: 'View verified ratings and 5-star written reviews directly on Google Maps for this branch.',
          });
          return;
        }

        interface PlacesReviewShape {
          authorAttribution?: {
            displayName?: string | null;
            photoURI?: string | null;
            uri?: string | null;
          } | null;
          rating?: number | null;
          relativePublishTimeDescription?: string | null;
          text?: string | null;
          googleMapsURI?: string | null;
          flagContentURI?: string | null;
        }

        const rawReviews = (place.reviews ?? []) as PlacesReviewShape[];
        const mappedReviews: LiveReviewItem[] = rawReviews.map((rev) => ({
          authorName: rev.authorAttribution?.displayName || 'Google Reviewer',
          authorPhoto: rev.authorAttribution?.photoURI || undefined,
          authorUrl: rev.authorAttribution?.uri || undefined,
          rating: typeof rev.rating === 'number' ? rev.rating : 5,
          relativeTime: rev.relativePublishTimeDescription || 'Recent review',
          text: (rev.text || '').trim(),
          googleMapsUri: rev.googleMapsURI || place.googleMapsURI || activeCampus.mapsUrl,
          flagContentUri: rev.flagContentURI || undefined,
        }));

        onSnapshot(activeCampus.id, {
          placeId: place.id,
          displayName: place.displayName || activeCampus.name,
          formattedAddress: place.formattedAddress || activeCampus.address,
          phoneNumber: place.nationalPhoneNumber || activeCampus.phone,
          rating: typeof place.rating === 'number' ? place.rating : undefined,
          userRatingCount:
            typeof place.userRatingCount === 'number' ? place.userRatingCount : undefined,
          openNowText: place.regularOpeningHours?.weekdayDescriptions?.[0],
          googleMapsUri: place.googleMapsURI || activeCampus.mapsUrl,
          reviews: mappedReviews,
        });
        onStatusChange({ loading: false, note: null });
      } catch {
        if (cancelled) return;
        onSnapshot(activeCampus.id, null);
        onStatusChange({
          loading: false,
          note: 'Enable Places API (New) on your Maps project key for in-page live review streaming, or view live 5-star reviews directly on Google Maps below.',
        });
      }
    };

    fetchLivePlace();

    return () => {
      cancelled = true;
    };
  }, [placesLib, activeCampus, refreshTick, onSnapshot, onStatusChange]);

  return null;
}

export function CampusLocationMap() {
  const [activeCampus, setActiveCampus] = useState<CampusLocation>(KARACHI_CAMPUSES[0]);
  const [infoOpen, setInfoOpen] = useState(true);
  const [refreshTick, setRefreshTick] = useState(0);
  const [reviewOffset, setReviewOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [snapshotsById, setSnapshotsById] = useState<Record<string, LivePlaceSnapshot | null>>({});
  const [placesStatus, setPlacesStatus] = useState<{ loading: boolean; note: string | null }>({
    loading: false,
    note: null,
  });

  const handleSelectCampus = useCallback((campus: CampusLocation) => {
    setActiveCampus(campus);
    setInfoOpen(true);
    setReviewOffset(0);
  }, []);

  const handleCloseInfo = useCallback(() => {
    setInfoOpen(false);
  }, []);

  const handleSnapshot = useCallback((campusId: string, snapshot: LivePlaceSnapshot | null) => {
    setSnapshotsById((prev) => ({ ...prev, [campusId]: snapshot }));
    if (snapshot && snapshot.reviews.length > 1) {
      setReviewOffset(Math.floor(Math.random() * snapshot.reviews.length));
    }
  }, []);

  const activeLive = snapshotsById[activeCampus.id] ?? null;
  const activeGoogleUrl = activeLive?.googleMapsUri || activeCampus.mapsUrl;

  // Prioritize 5-star written Google Maps reviews; fall back gracefully to any written reviews
  const fiveStarWrittenReviews = useMemo(() => {
    const source = activeLive?.reviews ?? [];
    const fiveStarWithText = source.filter(
      (r) => r.rating >= 4.5 && r.text.trim().length > 0
    );
    if (fiveStarWithText.length > 0) return fiveStarWithText;

    const anyWithText = source.filter((r) => r.text.trim().length > 0);
    if (anyWithText.length > 0) return anyWithText;

    return source;
  }, [activeLive]);

  // Auto-cycle live 5-star Google reviews every 6s so fresh written feedback rotates continuously
  useEffect(() => {
    if (isPaused || fiveStarWrittenReviews.length <= 1) return;
    const timer = window.setInterval(() => {
      setReviewOffset((prev) => (prev + 1) % fiveStarWrittenReviews.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [isPaused, fiveStarWrittenReviews.length]);

  const visibleReviews = useMemo(() => {
    const count = fiveStarWrittenReviews.length;
    if (count === 0) return [];
    const displayCount = Math.min(3, count);
    const rotated: LiveReviewItem[] = [];
    for (let i = 0; i < displayCount; i += 1) {
      rotated.push(fiveStarWrittenReviews[(reviewOffset + i) % count]);
    }
    return rotated;
  }, [fiveStarWrittenReviews, reviewOffset]);

  const handleCycleReviews = () => {
    if (fiveStarWrittenReviews.length <= 1) {
      setRefreshTick((t) => t + 1);
      return;
    }
    setReviewOffset((prev) => (prev + 1) % fiveStarWrittenReviews.length);
  };

  return (
    <section className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-bold text-[#DC1E25] mb-2">
              Verified Google Maps Pins &amp; 5-Star Written Google Reviews
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B2249] [text-wrap:balance]">
              Explore Our 3 Karachi Campuses &amp; Live 5-Star Google Reviews
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
            {MAPS_API_KEY && (
              <button
                type="button"
                onClick={() => setRefreshTick((t) => t + 1)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-[#0B2249] bg-[#F5F7FB] hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors cursor-pointer"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${placesStatus.loading ? 'animate-spin' : ''}`}
                />
                Sync Google Reviews
              </button>
            )}

            <a
              href={activeGoogleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#DC1E25] hover:bg-[#B9151B] rounded-xl transition-colors whitespace-nowrap"
            >
              Open Pin &amp; Directions
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-8">
          <div className="lg:col-span-4 space-y-3">
            {KARACHI_CAMPUSES.map((campus) => {
              const selected = campus.id === activeCampus.id;
              const live = snapshotsById[campus.id];
              return (
                <motion.button
                  key={campus.id}
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSelectCampus(campus)}
                  className={`w-full text-left p-5 rounded-2xl border transition-colors cursor-pointer ${
                    selected
                      ? 'bg-[#0B2249] text-white border-[#0B2249] shadow-md'
                      : 'bg-[#F5F7FB] text-[#0B2249] border-slate-200 hover:border-[#0B2249]/40 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs font-bold mb-1">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin
                        className={`w-3.5 h-3.5 ${
                          selected ? 'text-[#FBBF24]' : 'text-[#DC1E25]'
                        }`}
                      />
                      <span className={selected ? 'text-[#FBBF24]' : 'text-[#DC1E25]'}>
                        {campus.role}
                      </span>
                    </span>
                    {live?.rating && (
                      <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                        <Star className="w-3.5 h-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                        {live.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-base font-bold mb-1.5">
                    {live?.displayName || campus.name}
                  </h3>
                  <p
                    className={`text-xs leading-relaxed mb-1.5 ${
                      selected ? 'text-slate-200' : 'text-slate-600'
                    }`}
                  >
                    {live?.formattedAddress || campus.address}
                  </p>
                  <p
                    className={`text-[11px] font-semibold mb-1.5 ${
                      selected ? 'text-[#FBBF24]' : 'text-[#0B2249]'
                    }`}
                  >
                    Hours: {campus.hours}
                  </p>
                  <p className="font-mono text-xs font-semibold flex items-center gap-1.5 tabular-nums">
                    <Phone className="w-3.5 h-3.5" />
                    {live?.phoneNumber || campus.phone}
                  </p>
                </motion.button>
              );
            })}
          </div>

          <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-[390px] lg:h-[460px] shadow-sm">
            {MAPS_API_KEY ? (
              <APIProvider
                apiKey={MAPS_API_KEY}
                libraries={['marker', 'places']}
                language="en"
                region="PK"
              >
                <MapStatusMonitor />
                <LivePlacesFetcher
                  activeCampus={activeCampus}
                  refreshTick={refreshTick}
                  onSnapshot={handleSnapshot}
                  onStatusChange={setPlacesStatus}
                />
                <GoogleMap
                  mapId="DEMO_MAP_ID"
                  defaultCenter={{ lat: KARACHI_CAMPUSES[0].lat, lng: KARACHI_CAMPUSES[0].lng }}
                  defaultZoom={12}
                  gestureHandling="greedy"
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  style={{ width: '100%', height: '100%' }}
                >
                  <MapCameraController activeCampus={activeCampus} />
                  {KARACHI_CAMPUSES.map((campus) => (
                    <CampusMarker
                      key={campus.id}
                      campus={campus}
                      isActive={campus.id === activeCampus.id}
                      infoOpen={infoOpen}
                      onSelect={handleSelectCampus}
                      onCloseInfo={handleCloseInfo}
                    />
                  ))}
                </GoogleMap>
              </APIProvider>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#F5F7FB]">
                <MapPin className="w-10 h-10 text-[#DC1E25] mb-3" />
                <p className="font-display text-lg font-bold text-[#0B2249] mb-2">
                  {activeCampus.name}
                </p>
                <p className="text-sm text-slate-600 max-w-md mb-4">{activeCampus.address}</p>
                <a
                  href={activeCampus.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#0B2249] hover:bg-[#DC1E25] rounded-xl transition-colors"
                >
                  Open Verified Google Maps Listing
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Rotating 5-Star Google Maps Written Reviews Bar */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="bg-[#F5F7FB] border border-slate-200 rounded-2xl p-6 sm:p-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-200">
            <div>
              <p className="text-xs font-bold text-[#DC1E25] uppercase tracking-wide mb-1">
                Google Maps Reviews · {activeLive?.displayName || activeCampus.name}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {activeLive?.rating ? (
                  <>
                    <span className="font-mono text-2xl font-extrabold text-[#0B2249] tabular-nums">
                      {activeLive.rating.toFixed(1)}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`w-4 h-4 ${
                            n <= Math.round(activeLive.rating ?? 5)
                              ? 'fill-[#FBBF24] text-[#FBBF24]'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    {activeLive.userRatingCount !== undefined && (
                      <span className="text-xs sm:text-sm text-slate-600 font-medium">
                        ({activeLive.userRatingCount.toLocaleString()} Google reviews)
                      </span>
                    )}
                  </>
                ) : (
                  <p className="text-sm font-bold text-[#0B2249] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#DC1E25]" />
                    {placesStatus.loading
                      ? 'Fetching live 5-star written Google Maps reviews...'
                      : 'Verified Google Maps Profile'}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {fiveStarWrittenReviews.length > 1 && (
                <button
                  type="button"
                  onClick={handleCycleReviews}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#0B2249] bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Shuffle className="w-3.5 h-3.5 text-[#DC1E25]" />
                  Next 5-Star Review
                </button>
              )}

              <a
                href={activeCampus.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0B2249] hover:bg-[#DC1E25] rounded-xl transition-colors whitespace-nowrap"
              >
                Read All Reviews on Google Maps
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {visibleReviews.length > 0 ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
                <span>
                  Filtered &amp; ordered: 5-star written reviews from Google Maps (rotating view ·{' '}
                  {reviewOffset + 1}/{fiveStarWrittenReviews.length})
                </span>
                <a
                  href="https://support.google.com/contributionpolicy/answer/7422880"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[#0B2249]"
                >
                  Reviews are not verified by Google; Google checks for &amp; removes fake content
                </a>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeCampus.id}-${reviewOffset}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  {visibleReviews.map((review, idx) => (
                    <motion.article
                      key={`${review.authorName}-${reviewOffset}-${idx}`}
                      whileHover={{ y: -3 }}
                      className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-4 shadow-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {review.authorPhoto ? (
                              <img
                                src={review.authorPhoto}
                                alt={review.authorName}
                                className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-[#0B2249] text-white text-xs font-bold flex items-center justify-center shrink-0">
                                {review.authorName.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="min-w-0">
                              {review.authorUrl ? (
                                <a
                                  href={review.authorUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block text-xs font-bold text-[#0B2249] hover:text-[#DC1E25] truncate"
                                >
                                  {review.authorName}
                                </a>
                              ) : (
                                <p className="text-xs font-bold text-[#0B2249] truncate">
                                  {review.authorName}
                                </p>
                              )}
                              <p className="text-[11px] text-slate-500">{review.relativeTime}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-0.5 shrink-0" aria-label={`${review.rating} out of 5 stars`}>
                            {[1, 2, 3, 4, 5].map((starIdx) => (
                              <Star
                                key={starIdx}
                                className={`w-3.5 h-3.5 ${
                                  starIdx <= Math.round(review.rating)
                                    ? 'fill-[#FBBF24] text-[#FBBF24]'
                                    : 'text-slate-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <blockquote className="text-xs sm:text-sm text-slate-700 leading-relaxed line-clamp-5">
                          “{review.text || 'Rated on Google Maps.'}”
                        </blockquote>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px]">
                        <a
                          href={review.googleMapsUri || activeCampus.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-[#DC1E25] hover:underline"
                        >
                          Google Maps Review
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        {review.flagContentUri && (
                          <a
                            href={review.flagContentUri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-slate-600 underline"
                          >
                            Report
                          </a>
                        )}
                      </div>
                    </motion.article>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {KARACHI_CAMPUSES.map((branch) => (
                <a
                  key={branch.id}
                  href={branch.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border border-slate-200 hover:border-[#DC1E25] rounded-xl p-5 flex flex-col justify-between gap-3 transition-colors group"
                >
                  <div>
                    <p className="text-xs font-bold text-[#DC1E25] mb-1">Google Maps Listing</p>
                    <p className="font-display text-sm font-bold text-[#0B2249] mb-1">
                      {branch.name}
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-2">{branch.address}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2249] group-hover:text-[#DC1E25]">
                    View Verified 5-Star Ratings &amp; Written Reviews
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </a>
              ))}
              {placesStatus.note && (
                <p className="md:col-span-3 text-xs text-slate-500 pt-1">{placesStatus.note}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
