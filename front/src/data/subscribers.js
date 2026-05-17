export const subscriberTypes = [
  { value: 'trainer', label: 'Trainer' },
  { value: 'trainee', label: 'Trainee' },
  { value: 'company', label: 'Company' },
];

export const subscriberRounds = [
  { value: '', label: 'All Rounds' },
  { value: '1', label: 'Round 1' },
  { value: '2', label: 'Round 2' },
  { value: '3', label: 'Round 3' },
  { value: '4', label: 'Round 4' },
];

export const subscriberStatuses = [
  { value: '', label: 'All Statuses' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'maybe', label: 'Maybe' },
  { value: 'pending', label: 'Pending' },
];

export const statusLabels = {
  accepted: 'Accepted',
  rejected: 'Rejected',
  maybe: 'Maybe',
  pending: 'Pending',
};

export const typeLabels = {
  trainer: 'Trainer',
  trainee: 'Trainee',
  company: 'Company',
};

export const subscribers = [
  {
    id: '101',
    type: 'trainer',
    name: 'Ahmed Al-Masri',
    email: 'ahmed.masri@example.com',
    round: '1',
    status: 'pending',
    date: '2026-05-22T10:00',
    meeting: 'Interview',
    note: 'Available for morning sessions',
  },
  {
    id: '102',
    type: 'trainee',
    name: 'Laila Omar',
    email: 'laila.omar@example.com',
    round: '2',
    status: 'accepted',
    date: '2026-05-24T14:30',
    meeting: 'Interview',
    note: 'Prefers remote meeting',
  },
  {
    id: '103',
    type: 'company',
    name: 'Zain Technologies',
    email: 'contact@zaintech.com',
    round: '1',
    status: 'maybe',
    date: '2026-05-25T16:00',
    meeting: 'Sales Demo',
    note: 'Demo for B2B platform',
  },
  {
    id: '104',
    type: 'trainer',
    name: 'Maha Ahmed',
    email: 'maha.ahmed@example.com',
    round: '3',
    status: 'rejected',
    date: '2026-06-01T11:00',
    meeting: 'Interview',
    note: 'Missing technical portfolio',
  },
  {
    id: '105',
    type: 'trainee',
    name: 'Omar Hassan',
    email: 'omar.hassan@example.com',
    round: '1',
    status: 'pending',
    date: '2026-05-30T09:00',
    meeting: 'Interview',
    note: 'Interested in full stack training',
  },
  {
    id: '106',
    type: 'company',
    name: 'FutureCorp',
    email: 'sales@futurecorp.com',
    round: '2',
    status: 'accepted',
    date: '2026-06-02T15:00',
    meeting: 'Sales Demo',
    note: 'Demo of enterprise package',
  },
  {
    id: '107',
    type: 'trainer',
    name: 'Salma Nabil',
    email: 'salma.nabil@example.com',
    round: '2',
    status: 'maybe',
    date: '2026-06-05T13:30',
    meeting: 'Interview',
    note: 'Needs more information on salary',
  },
  {
    id: '108',
    type: 'trainee',
    name: 'Hassan Adel',
    email: 'hassan.adel@example.com',
    round: '4',
    status: 'accepted',
    date: '2026-06-08T10:00',
    meeting: 'Interview',
    note: 'Available for evening calls',
  },
];
