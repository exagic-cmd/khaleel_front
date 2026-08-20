export const HERO_IMAGE_CONFIG = {
  url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbStP2lAc6byVYksTXcXz5w8IKt_KpUJsjAqWS687yiXpYLAu0JmLTU18kw7BGEW5cn5-T_G9Sak138KT-Ik5sFu9anrSsXGe8D5hvSMypu2R4Xl5fk4VLZ_ECZ2-s7IjHqGE3WvTsAWzxbu5_2CTC5Kk7es4xK07GcASBmPb7BuGcza2Fp7QtnEvXZOGRtrY1E7slDTT6ch_PDb3zzHPBlwnjEPTxuDlcjHOer5EWWb34-0fiynaAVA',
  alt: 'Panoramic view of Masjid al-Haram and the Kaaba in Makkah',
}

export const NAV_LINKS = [
  { label: 'Explore', href: '#explore', active: true },
  { label: 'Fixed', href: '#fixed', active: false },
  { label: 'Custom', href: '#custom', active: false },
]

export const HOW_IT_WORKS_STEPS = [
  {
    step: '1. You ask a question',
    desc: 'Type your query about rituals, rulings, or logistics in natural language.',
    icon: 'help',
  },
  {
    step: '2. System retrieves texts',
    desc: 'We scan authoritative databases of fatwas, resolutions, and approved guidance.',
    icon: 'search',
  },
  {
    step: '3. AI generates answer',
    desc: 'An answer is synthesized strictly grounded in the retrieved sources.',
    icon: 'article',
  },
  {
    step: '4. No Reference Found',
    desc: 'If no authoritative reference exists, the system will clearly say so.',
    icon: 'error',
  },
]

export const FIXED_DEPARTURES = [
  {
    id: 1,
    title: '14-Day Ramadan Special',
    tag: 'SELLING FAST',
    date: 'March 10 - March 24, 2026',
    duration: '14 Nights (7 Makkah / 7 Madinah)',
    guide: 'Led by Sh. Yaser Birjas',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbStP2lAc6byVYksTXcXz5w8IKt_KpUJsjAqWS687yiXpYLAu0JmLTU18kw7BGEW5cn5-T_G9Sak138KT-Ik5sFu9anrSsXGe8D5hvSMypu2R4Xl5fk4VLZ_ECZ2-s7IjHqGE3WvTsAWzxbu5_2CTC5Kk7es4xK07GcASBmPb7BuGcza2Fp7QtnEvXZOGRtrY1E7slDTT6ch_PDb3zzHPBlwnjEPTxuDlcjHOer5EWWb34-0fiynaAVA',
    alt: 'Pilgrims in Makkah',
  },
  {
    id: 2,
    title: 'Shaban Group Tour',
    tag: null,
    date: 'Feb 15 - Feb 25, 2026',
    duration: '10 Nights (5 Makkah / 5 Madinah)',
    guide: 'Bilingual Guides Available',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBP1HiwYjg5MzDxqbM0rjQDxOl3VRUfCST15ve1kq-_5eNDLTE047rLxmaXQJXEz0rwGOZFFgfLJ9-Jhd4zO4kJxGq6yjN2vPGXtxS1O4q3hg-Rq25ic5Pn7QP1g2YHBwxDjehUH3xRsWbqnvhdsu3bJYGjdUXqxAcfH6IJnmsXO3hK_6yKXIye62a-jVQsxCRr7E7wZZ_4Qnyulr3Js1o8_kx1nUjkYayslE61IysOuTtikDY45-q2ow',
    alt: "Prophet's Mosque at sunset",
  },
  {
    id: 3,
    title: 'Shawwal Family Umrah',
    tag: null,
    date: 'April 15 - April 25, 2026',
    duration: '10 Nights (5 Makkah / 5 Madinah)',
    guide: 'Family & Kid Friendly Itinerary',
    iconType: 'child_care',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIw3kXHrpunYZTc7G6vH9aR3niZI6G9JcDngbL9Z9Q_Bl4p5H_PNzY1FVMyYPPzdXeblHKznp3Oy6x3mH_bWOsVpnknf6ypuMOwrOyctr7hqVTI7Lh0YzHOEd27AfTplB0xDEACpXL5Rd_GkWXb786u7f10aqxDRzWrluFHQmiu_jImbATUtZpiMtiYQNlM5eZcKkoBQ_tWBOf94H25Az0jVcA-9u0Gmz6eYSAKELflSsVCFQwQ8ilAw',
    alt: 'Mount Arafat during Hajj',
  },
]

export const HOTEL_TIERS = [
  {
    id: 'budget',
    title: 'Budget (3-Star)',
    stars: 3,
    isPopular: false,
    distance: '800m - 1.5km (Shuttle usually provided)',
    features: [
      { text: 'Free WiFi', available: true },
      { text: 'Basic Breakfast Included', available: true },
      { text: 'Haram View', available: false },
    ],
    price: 850,
    buttonText: 'Select Tier',
  },
  {
    id: 'comfort',
    title: 'Comfort (4-Star)',
    stars: 4,
    isPopular: true,
    badge: 'MOST POPULAR',
    distance: '250m - 800m (Short walk)',
    features: [
      { text: 'High-Speed WiFi', available: true },
      { text: 'Full Buffet Breakfast', available: true },
      { text: 'Partial Haram Views Available', available: true },
    ],
    price: 1500,
    buttonText: 'Select Tier',
  },
  {
    id: 'luxury',
    title: 'Luxury (5-Star)',
    stars: 5,
    isPopular: false,
    distance: '0m - 250m (Direct Haram access)',
    features: [
      { text: 'Premium Amenities & Concierge', available: true },
      { text: 'Gourmet Dining Options', available: true },
      { text: 'Direct/Full Haram Views', available: true },
    ],
    price: 3000,
    buttonText: 'Select Tier',
  },
]

export const HOLY_SITES = [
  {
    id: 'makkah',
    name: 'Makkah',
    tag: 'HOLY CITY',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbStP2lAc6byVYksTXcXz5w8IKt_KpUJsjAqWS687yiXpYLAu0JmLTU18kw7BGEW5cn5-T_G9Sak138KT-Ik5sFu9anrSsXGe8D5hvSMypu2R4Xl5fk4VLZ_ECZ2-s7IjHqGE3WvTsAWzxbu5_2CTC5Kk7es4xK07GcASBmPb7BuGcza2Fp7QtnEvXZOGRtrY1E7slDTT6ch_PDb3zzHPBlwnjEPTxuDlcjHOer5EWWb34-0fiynaAVA',
  },
  {
    id: 'madinah',
    name: 'Madinah',
    tag: 'CITY OF THE PROPHET',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfQeddK7_-n5haJBpkTE3s1Axxfi_jp4n2oa-pZpfgwWglza1DJMc-U22QrsxoTPoBO7gr76fIfga6FkdkUUZyS7KEIShywfSVhcAQ_5Z1DQCfbW1JGacZu1cbL32E4snVt0tAxyFHh-MU-3OrqOKwul5dAYJ43fuWkdIVTRaKnd9JZSjN91kocNayvlKUJ_PsSGSU-qSL9AA18Bk6ciTymlHWt67ijU2X6KkeLQtPmi_CjSnDGuHwUw',
  },
  {
    id: 'taif',
    name: 'Taif',
    tag: 'HISTORICAL LANDMARK',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5ZOm-zCjIgy8_pmp0Avg8Ue4kUPYLRShX3G8vFo1jEflYKbqIjPT0tluD1YFB8d7NL_KPJPF35ABZNd8-NZeBv6NPKucfxN6IwvPY7Yj5LRT7iFn_QOq0G-qwRUN0dALuN_c0oHh2s4lEUcfFI-1Jztyr0QaFew2TAfaECSSR6GCpF0JJAZWtXPMKW10-gAqNO4oVFRvZywaPFqlCXmfp4vO5EilD0wilKDPptM3COrlXHgC5VwHNFg',
  },
  {
    id: 'badr',
    name: 'Badr',
    tag: 'BATTLE SITE',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeqm6PMXG1HU2C4O2KDz94VDm44ks_HrVfELwqhk9dnOnWk9lQBnoQZcfYYKcO4az26vnD5GBCwU9KWXEgv6-_6nscgTiL8jv8ItBoQM4sTRK_CNNYdNZGKfQKqiIWTeAlZRKXgQrJweMM35BO_lELdOPFfUE8JyVnGeNxgAs0LONMzL7REGUV7KYILLwbaSwBsVgTUFBH6LRXDU5GzW_ECHIqQep0_BKksFJcsuT8Xg5HBbx-n6e-Dg',
  },
  {
    id: 'khyber',
    name: 'Khyber',
    tag: 'ANCIENT FORTRESS',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDM-oyx98NWnt9Xf6sMsRp37L9vJeRHDWsUPDqU_jFNiMMzgkjlizG3oBwL6L956mUka3Cz_g1D4g7Lk5eoxxvkC1dtnr9juieCOTV2d_n3HmEzSvzhs7fAEZF6vEF8vIBfyHnQ5zIjXnRbzBfYMXQBh01I7ParZUVKc9NOsu1Zq9xsRuGJ4Fjwao6-h3Lgfqo_11IoL-zv9n-Zav-nu0WhF2SVsAa0Nt8lGFpKeGxyP2XakaNWVSfSw',
  },
]

export const CUSTOM_PACKAGES = [
  {
    id: 1,
    title: 'Premium Umrah\nExperience',
    badge: 'LUXURY',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfQeddK7_-n5haJBpkTE3s1Axxfi_jp4n2oa-pZpfgwWglza1DJMc-U22QrsxoTPoBO7gr76fIfga6FkdkUUZyS7KEIShywfSVhcAQ_5Z1DQCfbW1JGacZu1cbL32E4snVt0tAxyFHh-MU-3OrqOKwul5dAYJ43fuWkdIVTRaKnd9JZSjN91kocNayvlKUJ_PsSGSU-qSL9AA18Bk6ciTymlHWt67ijU2X6KkeLQtPmi_CjSnDGuHwUw',
    inclusions: [
      { icon: 'flight', label: 'FLIGHT', active: true },
      { icon: 'hotel', label: 'HOTEL', active: true },
      { icon: 'directions_bus', label: 'TRANSPORT', active: true },
      { icon: 'badge', label: 'VISA', active: true },
    ],
    locations: [
      'Makkah: 50m from Haram',
      'Madinah: 100m from Haram',
    ],
    price: 'PKR4,250',
  },
  {
    id: 2,
    title: 'Budget Family\nPackage',
    badge: null,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBP1HiwYjg5MzDxqbM0rjQDxOl3VRUfCST15ve1kq-_5eNDLTE047rLxmaXQJXEz0rwGOZFFgfLJ9-Jhd4zO4kJxGq6yjN2vPGXtxS1O4q3hg-Rq25ic5Pn7QP1g2YHBwxDjehUH3xRsWbqnvhdsu3bJYGjdUXqxAcfH6IJnmsXO3hK_6yKXIye62a-jVQsxCRr7E7wZZ_4Qnyulr3Js1o8_kx1nUjkYayslE61IysOuTtikDY45-q2ow',
    inclusions: [
      { icon: 'flight', label: 'FLIGHT', active: false },
      { icon: 'hotel', label: 'HOTEL', active: true },
      { icon: 'directions_bus', label: 'TRANSPORT', active: true },
      { icon: 'badge', label: 'VISA', active: true },
    ],
    locations: [
      'Makkah: 500m from Haram',
      'Madinah: 300m from Haram',
    ],
    price: 'PKR2,800',
  },
]
