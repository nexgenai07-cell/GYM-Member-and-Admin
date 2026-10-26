// src/pages/admin/siteTextLabels.js
// Turns a website text key ("home.pf.s2.d") into words an editor understands:
// section "Proof — stats & testimonial", label "Stat 2 · Description".

// Section codes (2nd part of the key). Digits are stripped first: card3 → card (item 3).
const SECTIONS = {
  '': 'General',
  hero: 'Top banner',
  kicker: 'General',
  cl: 'Live heart-rate / power card',
  stat: 'Headline numbers',
  belt: 'Scrolling word strip',
  caps: 'Capability tiles',
  floor: 'Live from the floor',
  feed: 'Live activity feed',
  why: 'Why people stay',
  fc: 'Facilities preview',
  tel: 'Live telemetry panel',
  svc: 'Services & coaching',
  pr: 'Membership plans',
  pf: 'Proof — stats & testimonial',
  cta: 'Bottom call-to-action',
  dot: 'Side navigation dots',
  filter: 'Filter buttons',
  f: 'Filter buttons / form fields',
  search: 'Search box',
  metric: 'Headline metrics',
  count: 'Results counter',
  card: 'Card',
  empty: '“Nothing found” message',
  rail: 'Side information panel',
  conc: 'Concierge form',
  method: 'The method — steps',
  tab: 'Mobile bottom tabs',
  title: 'Page title',
  sec: 'Header badges',
  step: 'Signup steps',
  hud: 'Progress badge',
  p: 'Form panel',
  vec: 'Training goals',
  node: 'Locations list',
  err: 'Field error messages',
  sum: 'Order summary',
  trust: 'Trust badges',
  paybar: 'Payment bar',
  field: 'Form fields',
  ok: 'Success screen',
  plan: 'Plan picker',
  pass: 'Pass badge',
  gender: 'Gender options',
  photo: 'Live photo',
  fac: 'Facility add-ons',
  map: 'Address hint',
  issue: 'Issue strip',
  feat: 'Featured article',
  m: 'Research metrics',
  arch: 'Article archive',
  news: 'Newsletter box',
  pag: 'Page numbers',
  tax: 'Tags list',
  form: 'Contact form header',
  cat: 'Enquiry categories',
  sub: 'Enquiry topics',
  qa: 'Quick contact buttons',
  hubs: 'Front desks — heading',
  hub: 'Front desk',
  faq: 'Questions & answers',
  safety: 'Safety desk',
  missing: '“Article not found” message',
  verifying: 'Checking payment',
  paid: 'Payment confirmed',
  pending: 'Payment processing',
  failed: 'Payment failed',
  error: 'Something went wrong',
  msg: 'Payment messages',
  note: 'Confirmation note',
  hint: 'Camera hints',
};

// Field codes (last part of the key, digits stripped).
const FIELDS = {
  title: 'Title', t: 'Title', desc: 'Description', d: 'Description', v: 'Value', val: 'Value',
  s: 'Small text', sub: 'Sub-text', l: 'Label', label: 'Label', k: 'Big figure', stag: 'Section tag',
  eyebrow: 'Small heading above the title', kicker: 'Small heading', lede: 'Intro paragraph',
  cta: 'Button text', btn: 'Button text', ghost: 'Second button text', ph: 'Placeholder', placeholder: 'Placeholder',
  tag: 'Tag', f: 'Feature', line: 'Line', h: 'Heading', q: 'Question', a: 'Answer', n: 'Name', badge: 'Badge',
  price: 'Price', per: 'Price period', duration: 'Duration', labName: 'Lab name', lab: 'Top label', unit: 'Unit',
  note: 'Note', meta: 'Details line', inc: 'Included item', o: 'Option', b: 'Bold line', m: 'Line', c: 'Line',
  goal: 'Goal', terms: 'Term', boot: 'Loading screen text', em: 'Highlighted word', short: 'Short text',
  name: 'Name', email: 'Email label', emailPh: 'Email placeholder', phone: 'Phone label', phonePh: 'Phone placeholder',
  iqama: 'Iqama label', open: 'Open text', live: 'Live text', join: 'Join button', home: 'Home', all: '“All” button',
  scroll: 'Scroll hint', reset: 'Reset button', loading: 'Loading text', error: 'Error text', submit: 'Send button',
  sent: 'Sent message', back: 'Back link', alt: 'Image description', url: 'Link', addressPh: 'Address placeholder',
  perMonth: 'Per-month text', add: 'Add button', remove: 'Remove button', whole: '“Whole plan” text', hint: 'Hint',
  pinned: 'After picking an address', status: 'Status label', read: 'Read link', showing: '“Showing” text',
  pre: 'Text before the email', post: 'Text after the email', noRef: 'No payment reference',
};

const GOALS = { hyp: 'Hypertrophy', fat: 'Fat shred', end: 'Endurance', com: 'Combat / MMA', bio: 'Biomechanics', rec: 'Recovery' };

const words = (code) => code.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]/g, ' ')
  .replace(/^./, (c) => c.toUpperCase());

// Section name for keys that sit directly on a page (nav.home, foot.desc…).
const PAGE_SECTION = {
  meta: 'Browser tab & search results', nav: 'Menu links', boot: 'Loading screen', tab: 'Mobile bottom tabs',
  foot: 'Footer', art: 'Article page', nf: 'Page not found', pay: 'Payment result', cam: 'Camera',
};
const ITEM_WORD = {
  stat: 'Stat', pf: 'Stat', faq: 'Q&A', caps: 'Tile', trust: 'Badge', node: 'Location', m: 'Metric', hub: 'Desk',
  why: 'Point', sub: 'Topic', method: 'Step', feed: 'Entry', floor: 'Tile', hero: 'Line', tel: 'Reading',
  pr: 'Plan', svc: 'Service', fc: 'Facility', cl: 'Reading', ins: 'Article',
};

/** { section, label } for a website text key. */
export function describeKey(key) {
  const [page, ...rest] = key.split('.');
  const sectionCode = rest.length > 1 ? rest[0] : '';
  const secBase = sectionCode.replace(/\d+$/, '');
  const secNum = (sectionCode.match(/(\d+)$/) || [])[1];

  let section = sectionCode ? (SECTIONS[secBase] || words(secBase)) : (PAGE_SECTION[page] || 'General');
  if (secBase === 'card') section = page === 'svc' ? `Service card ${secNum || ''}`.trim() : `Card ${secNum || ''}`.trim();
  else if (secBase === 'p' && page === 'en') section = `Step ${secNum} form`;
  else if (secNum && ['sec', 'step'].includes(secBase)) section = `${section} ${secNum}`;

  // item numbers from the middle parts (s2 in pf.s2.d, 1 in caps.1.k) or the section (stat2, m3)
  const tail = rest.slice(sectionCode ? 1 : 0);
  const itemNums = [];
  if (secNum && ['stat', 'm'].includes(secBase)) itemNums.push(secNum);
  const itemNames = [];
  tail.slice(0, -1).forEach((p) => {
    const m = p.match(/(\d+)/);
    if (m) itemNums.push(m[1]);
    else itemNames.push(GOALS[p] || words(p));     // en.vec.hyp.t → "Hypertrophy"
  });

  // the field: last part, maybe with its own number ("tag3", "h1a", "inc3")
  let fieldCode = tail[tail.length - 1] || rest[0] || page;
  let fieldNum = '';
  let part = '';
  const fm = fieldCode.match(/^([a-zA-Z]+?)(\d+)([a-z]?)$/);
  if (fm) { [, fieldCode, fieldNum, part] = fm; }
  if (/^\d+$/.test(fieldCode)) { fieldNum = fieldCode; fieldCode = ''; }

  let field = fieldCode ? (FIELDS[fieldCode] || words(fieldCode)) : 'Text';
  if (secBase === 'err') field = `${words(fieldCode || 'field')} — error message`;
  if (page === 'nav' || page === 'tab' || secBase === 'tab' || secBase === 'dot') field = `“${words(fieldCode)}” link`;
  if (fieldNum) field = itemNums.length ? `${field} ${fieldNum}` : `${field} ${fieldNum}`;
  if (part) field += ` (part ${part === 'a' ? 1 : part === 'b' ? 2 : part})`;

  const prefix = [itemNums.length ? `${ITEM_WORD[secBase] || 'Item'} ${itemNums.join('.')}` : '', ...itemNames].filter(Boolean);
  const label = prefix.length ? `${prefix.join(' · ')} · ${field}` : field;
  return { section, label };
}

const PAGE_NAMES = {
  meta: 'Site', nav: 'Navigation', boot: 'Loading screen', foot: 'Footer', tab: 'Mobile tab bar', home: 'Home',
  fac: 'Facilities', svc: 'Services', ins: 'Insights', ct: 'Contact', en: 'Membership signup', cam: 'Signup camera',
  pay: 'Payment result', art: 'Article page', nf: 'Page not found',
};

/**
 * Rows grouped by section, in the order they come from the API: [[sectionName, rows], …].
 * With withPage, section names are prefixed by the page ("Home — Top banner").
 */
export function groupBySection(rows, withPage = false) {
  const groups = new Map();
  rows.forEach((row) => {
    const d = describeKey(row.key);
    const name = withPage ? `${PAGE_NAMES[row.page] || row.page} — ${d.section}` : d.section;
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name).push({ ...row, _label: d.label, _section: d.section });
  });
  return [...groups.entries()];
}
