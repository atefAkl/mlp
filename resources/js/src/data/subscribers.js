export const subscriberTypes = [
  { value: 'trainer', label: 'Trainer' },
  { value: 'trainee', label: 'Trainee' },
  { value: 'company', label: 'Company Demo' },
];

export const typeLabels = {
  trainer: 'Trainer',
  trainee: 'Trainee',
  company: 'Company Demo',
};

export const subscriberRounds = [
  { value: '', label: 'All Rounds' },
  { value: 'Round 1', label: 'Round 1' },
  { value: 'Round 2', label: 'Round 2' },
  { value: 'Final Round', label: 'Final Round' },
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

export const subscribers = [
  {
    id: '1',
    type: 'trainer',
    name: 'Amina Hassan',
    email: 'amina.hassan@example.com',
    date: '2026-06-18T10:30',
    round: 'Round 1',
    meeting: 'Interview',
    status: 'pending',
    note: 'Needs an updated portfolio review before the next interview.',
  },
  {
    id: '2',
    type: 'trainee',
    name: 'Karim Adel',
    email: 'karim.adel@example.com',
    date: '2026-06-20T14:00',
    round: 'Round 2',
    meeting: 'Demo',
    status: 'accepted',
    note: 'Follow up on project brief and confirm demo environment.',
  },
  {
    id: '3',
    type: 'company',
    name: 'Nour Supply Co.',
    email: 'contact@noursupply.co',
    date: '2026-06-22T16:00',
    round: 'Final Round',
    meeting: 'Company Demo',
    status: 'maybe',
    note: 'Awaiting final scheduling details from the product team.',
  },
  {
    id: '4',
    type: 'trainer',
    name: 'Youssef El-Sayed',
    email: 'youssef.elsayed@example.com',
    date: '2026-06-24T11:00',
    round: 'Round 2',
    meeting: 'Interview',
    status: 'rejected',
    note: 'Rejected due to schedule conflict; recommend future intake.',
  },
  {
    id: '5',
    type: 'trainee',
    name: 'Dina Nabil',
    email: 'dina.nabil@example.com',
    date: '2026-06-26T09:30',
    round: 'Round 1',
    meeting: 'Interview',
    status: 'pending',
    note: 'Candidate has strong backend experience; verify availability.',
  },
  {
    id: '6',
    type: 'company',
    name: 'Falcon Technologies',
    email: 'hello@falcontech.io',
    date: '2026-06-28T13:00',
    round: 'Final Round',
    meeting: 'Demo',
    status: 'accepted',
    note: 'Demo confirmed; prepare internal review notes before presentation.',
  },
];
