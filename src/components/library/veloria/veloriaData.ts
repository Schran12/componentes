/** Veloria — private yacht charter catalogue data (mirrors public/veloria/index.html). */

export const VL_ASSET_BASE = 'https://thinkingods.com/demos/veloria-yacht/assets'

export const VL_YACHT_VIDEO = `${VL_ASSET_BASE}/yacht.mp4`
export const VL_YACHT_POSTER = `${VL_ASSET_BASE}/yacht-poster.jpg`

export const VL_ONBOARD_IMAGES = {
  t1: `${VL_ASSET_BASE}/t1.jpg`,
  t2: `${VL_ASSET_BASE}/t2.jpg`,
  t3: `${VL_ASSET_BASE}/t3.jpg`,
  t4: `${VL_ASSET_BASE}/t4.jpg`,
} as const

export const PRICE = '[PRICE]'
export const RESPONSE_TIME = '[RESPONSE TIME]'
export const EMAIL_ADDRESS = '[EMAIL ADDRESS]'
export const PHONE_NUMBER = '[PHONE NUMBER]'

export type VlNavLink = { label: string; href: string }

export const VL_NAV_LINKS: readonly VlNavLink[] = [
  { label: 'Onboard', href: '#onboard' },
  { label: 'The voyage', href: '#voyage' },
  { label: 'Destinations', href: '#destinations' },
  { label: 'Reserve', href: '#reserve' },
] as const

export type VlSectionIndexItem = { num: string; label: string; href: string }

export const VL_SECTION_INDEX: readonly VlSectionIndexItem[] = [
  { num: '01', label: 'Home', href: '#hero' },
  { num: '02', label: 'Onboard', href: '#onboard' },
  { num: '03', label: 'Voyage', href: '#voyage' },
  { num: '04', label: 'Destinations', href: '#destinations' },
  { num: '05', label: 'Reserve', href: '#reserve' },
] as const

export type VlOnboardCard = {
  id: string
  image: string
  alt: string
  title: string
  positionClass: string
  animClass: string
}

export const VL_ONBOARD_CARDS: readonly VlOnboardCard[] = [
  {
    id: 'swim',
    image: VL_ONBOARD_IMAGES.t1,
    alt: "The yacht's stern swim platform over its wake",
    title: 'Swim\nplatform',
    positionClass: 'vl-fcard-c1',
    animClass: 'vl-inl',
  },
  {
    id: 'sun',
    image: VL_ONBOARD_IMAGES.t2,
    alt: 'Upper sun deck with loungers above open water',
    title: 'Sun\ndeck',
    positionClass: 'vl-fcard-c2',
    animClass: 'vl-inl2',
  },
  {
    id: 'hull',
    image: VL_ONBOARD_IMAGES.t3,
    alt: 'The bow cutting through calm water at golden hour',
    title: 'Silent\nhull',
    positionClass: 'vl-fcard-c3',
    animClass: 'vl-inr',
  },
  {
    id: 'golden',
    image: VL_ONBOARD_IMAGES.t4,
    alt: 'The yacht in profile on open sea at sunset',
    title: 'Golden\nhour runs',
    positionClass: 'vl-fcard-c4',
    animClass: 'vl-inr2',
  },
] as const

export type VlDestination = {
  num: string
  season: string
  name: string
  description: string
  animClass: string
}

export const VL_DESTINATIONS: readonly VlDestination[] = [
  {
    num: '01',
    season: 'May – Oct',
    name: 'Amalfi Coast',
    description: 'Positano at dusk, lunch anchored off Li Galli.',
    animClass: 'vl-rv',
  },
  {
    num: '02',
    season: 'Jun – Sep',
    name: 'Cyclades',
    description: 'Whitewashed harbours from Mykonos to Milos.',
    animClass: 'vl-rv2',
  },
  {
    num: '03',
    season: 'Nov – Apr',
    name: 'Maldives',
    description: 'Atoll to atoll, sandbank dinners after dark.',
    animClass: 'vl-rv3',
  },
  {
    num: '04',
    season: 'Nov – May',
    name: 'Andaman Islands',
    description: 'Quiet anchorages off Havelock and Neil.',
    animClass: 'vl-rv3',
  },
] as const

export const VL_DESTINATION_OPTIONS = [
  'Amalfi Coast',
  'Cyclades',
  'Maldives',
  'Andaman Islands',
  'Not sure yet',
] as const

export const VL_YACHT_OPTIONS = ['Aurelle · 38 m', 'Any motor yacht', 'Any sailing yacht'] as const

export const VL_GUEST_OPTIONS = ['2', '4', '6', '8', '10'] as const

export const VL_FEATURED_CHARTER = {
  name: 'Aurelle',
  lengthM: 38,
  note: 'Summer dates filling · Amalfi Coast',
  guests: 10,
  cabins: 5,
  crew: 7,
} as const
