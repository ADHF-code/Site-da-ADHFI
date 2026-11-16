# Agenda ADHFI

`events.json` is the single public catalogue for this phase. No Airtable table was created. The existing DHFI — Gestão schema was inspected: Serviços ADHFI records individual services/payment operations, not an event catalogue.

Consumers fetch `https://adhfi.site/agenda/events.json` (CORS public; five-minute HTTP cache). No polling or Airtable calls. Only public event information belongs here; never participant/registration data.

- ADHFI and CFI consumers: all events, no label filter.
- IFC consumers: `events.filter(e => e.labels.includes('ifc'))`.
- MBI consumers: `events.filter(e => e.labels.includes('mbi'))`.
- Agenda UI: `/agenda/?valencia=ifc` or `mbi`; optional `origem=cfi` keeps existing return navigation and form attribution.
- ONE and future panels can consume the same feed, never copy the catalogue.

Events have stable IDs; ISO local start/end dates; labels (adhfi/cfi/ifc/mbi); category; time; location; price; includes/excludes; description; image; existing detail URL; registrationStatus (open/closed/soon). Unknown facts remain null. Completion is derived from endDate in Europe/Lisbon, independently of registration status. Multi-day events finish after endDate. Dates without exact hours stay active through their final local day.

Future Airtable migration: replace the feed provider while preserving this JSON contract and stable IDs/URLs. The agenda and homepage already fetch the provider, so no interface rebuild is needed. Individual historical detail pages and existing form markup remain unchanged. Future cross-site integrations have not yet been applied to CFI, IFC, MBI or ONE.

Homepage shows up to three actual upcoming events; it does not invent a third event when only two exist. Historical events remain accessible. `/atividades/` redirects to `/agenda/`; nested detail/form routes remain intact.

Build: `node build.js`.

The Férias quick filter selects events whose category is Férias (case and accent insensitive). It uses the same catalogue; no separate holiday list is required.

November 16 update: Christmas banquet art replaced with a new editorial illustration. Bolinha Christmas party (12 December) and six holiday days were reconciled with the family email and festive poster sent 14 November. The newer communication supersedes the earlier December 20 entry and afternoon closure on December 30; neither is published. Unknown prices and logistics remain unannounced. New detail pages and sitemap are generated from events.json at build time. The 2027 planning calendar remains to be reconciled before public release.
