
// Note: This is a reference implementation for future automation
// To be used with Node.js when we implement server-side report generation

const archetypes = [
  { id: 'a1', name: 'Savvy Healthcare Navigators', family: 'a' },
  { id: 'a2', name: 'Complex Condition Managers', family: 'a' },
  { id: 'a3', name: 'Proactive Care Consumers', family: 'a' },
  { id: 'b1', name: 'Resourceful Adapters', family: 'b' },
  { id: 'b2', name: 'Healthcare Pragmatists', family: 'b' },
  { id: 'b3', name: 'Care Channel Optimizers', family: 'b' },
  { id: 'c1', name: 'Scalable Access Architects', family: 'c' },
  { id: 'c2', name: 'Care Adherence Advocates', family: 'c' },
  { id: 'c3', name: 'Engaged Healthcare Consumers', family: 'c' }
];

/**
 * Future implementation:
 * 1. Fetch data from Supabase for each archetype
 * 2. Generate static HTML reports
 * 3. Save to /public/static-reports/{archetype_id}/{type}.html
 * 4. Update links in admin-reports.html to point to static files
 */
