export const SearchBy = [
  {name: 'Country', code: 'Country'}
];

export const SearchByTag = [
  {name: 'Subject Area', code: 'Tags'}
];

export const MappedCombinedCountryKey = 'Combine Country'

export const RegionSearch = {name: 'Region', code: 'Region'};


export const PAGE_SIZE = 8;
export const SEPARATE_PAGE_SIZE = 12;


export const SearchByLaw = [
  {name: 'Law', code: 'Law'},
  {name: 'Full Citation', code: 'Full Citation'},
  {name: 'Sector', code: 'Sector'},
  {name: 'Class', code: 'Class'}
]

export const SearchByRegulator = [
  {name: 'Regulator Details', code: 'RegulatorInfo'}
]

export interface ICommunityDetails {
  sidebarLabel: string;
  id: string;
  sidebarIcon: string;
  faIcon: string;
  sidebarRoute: string;
  header: string;
  description: string;
  image: string;
  sidebarIconDesc: string;
  navigation: string;
  redirectLink: string;
  collapseIcon: string;
  numberOfButtons: number;
  buttonText?: string; // it is buttonText-1, buttonText-2 and so on
  buttonLink?: string;
  featuredHeader?: string;
  featuredDescription?: string;
  filterHeader?: string;
  filterDescription?: string;
  [key: string|number]: any;
}
