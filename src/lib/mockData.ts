export interface MockUser {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: "owner" | "admin" | "member";
  currency: string;
  timezone: string;
  familyId: number;
  familyName: string;
}

export interface MockEmi {
  id: number;
  loanName: string;
  bankName: string;
  loanCategory: "Home Loan" | "Vehicle Loan" | "Personal Loan" | "Education Loan" | "Gold Loan" | "Business Loan";
  loanReference: string;
  originalAmount: number;
  emiAmount: number;
  interestRate: number;
  outstandingPrincipal: number;
  loanStartDate: string;
  firstEmiDate: string;
  nextDueDate: string;
  daysLeft: number;
  dueDay: number;
  tenureMonths: number;
  totalEmis: number;
  paidEmis: number;
  remainingEmis: number;
  status: "Active" | "Completed" | "Archived";
  scheduleStatus: "Due Soon" | "Upcoming" | "Due Today" | "Paid" | "Overdue";
  ownershipType: "personal" | "family_shared";
  sharedWithFamily: boolean;
  paymentMethod: string;
  autoDebit: boolean;
  categoryIcon: "home" | "car" | "user" | "bike" | "graduation" | "coins";
  colorClass: string;
  bgClass: string;
}

export interface MockPaymentRecord {
  id: number;
  emiId: number;
  loanName: string;
  bankName: string;
  installmentNo: number;
  dueDate: string;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  transactionReference: string;
  status: "Success" | "Processing" | "Pending";
  receiptUrl?: string;
}

export interface MockNotification {
  id: number;
  title: string;
  message: string;
  timestamp: string;
  type: "urgent" | "reminder" | "success" | "family";
  isRead: boolean;
  emiId?: number;
}

export interface MockFamilyMember {
  id: number;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Member";
  joinedDate: string;
  avatar: string;
  sharedLoansCount: number;
  personalLoansCount: number; // Hidden from others, shown for self
}

// Current Logged-in User
export const currentUser: MockUser = {
  id: 1,
  name: "Rahul Sharma",
  email: "rahul.sharma@myvello.life",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
  role: "owner",
  currency: "INR",
  timezone: "Asia/Kolkata",
  familyId: 101,
  familyName: "Sharma Family",
};

// Family Workspaces
export const familyWorkspaces = [
  { id: 101, name: "Sharma Family", role: "Owner", membersCount: 4 },
  { id: 102, name: "Personal Workspace", role: "Personal", membersCount: 1 },
];

// Active EMIs exactly matching the user's design image
export const mockEmis: MockEmi[] = [
  {
    id: 1,
    loanName: "Home Loan",
    bankName: "HDFC Bank",
    loanCategory: "Home Loan",
    loanReference: "HDFC-HL-98231",
    originalAmount: 4200000,
    emiAmount: 18500,
    interestRate: 8.5,
    outstandingPrincipal: 3820000,
    loanStartDate: "2023-08-10",
    firstEmiDate: "2023-09-10",
    nextDueDate: "10 Nov, 2025",
    daysLeft: 2,
    dueDay: 10,
    tenureMonths: 240,
    totalEmis: 240,
    paidEmis: 28,
    remainingEmis: 212,
    status: "Active",
    scheduleStatus: "Due Soon",
    ownershipType: "family_shared",
    sharedWithFamily: true,
    paymentMethod: "Auto Debit",
    autoDebit: true,
    categoryIcon: "home",
    colorClass: "text-indigo-600",
    bgClass: "bg-indigo-50",
  },
  {
    id: 2,
    loanName: "Car Loan",
    bankName: "SBI",
    loanCategory: "Vehicle Loan",
    loanReference: "SBI-VL-45129",
    originalAmount: 850000,
    emiAmount: 14000,
    interestRate: 8.9,
    outstandingPrincipal: 590000,
    loanStartDate: "2024-06-15",
    firstEmiDate: "2024-07-15",
    nextDueDate: "15 Nov, 2025",
    daysLeft: 7,
    dueDay: 15,
    tenureMonths: 60,
    totalEmis: 60,
    paidEmis: 16,
    remainingEmis: 44,
    status: "Active",
    scheduleStatus: "Upcoming",
    ownershipType: "personal",
    sharedWithFamily: false,
    paymentMethod: "UPI Transfer",
    autoDebit: false,
    categoryIcon: "car",
    colorClass: "text-blue-600",
    bgClass: "bg-blue-50",
  },
  {
    id: 3,
    loanName: "Personal Loan",
    bankName: "ICICI Bank",
    loanCategory: "Personal Loan",
    loanReference: "ICICI-PL-88310",
    originalAmount: 250000,
    emiAmount: 8000,
    interestRate: 11.2,
    outstandingPrincipal: 195000,
    loanStartDate: "2025-02-20",
    firstEmiDate: "2025-03-20",
    nextDueDate: "20 Nov, 2025",
    daysLeft: 12,
    dueDay: 20,
    tenureMonths: 36,
    totalEmis: 36,
    paidEmis: 8,
    remainingEmis: 28,
    status: "Active",
    scheduleStatus: "Upcoming",
    ownershipType: "personal",
    sharedWithFamily: false,
    paymentMethod: "NetBanking",
    autoDebit: true,
    categoryIcon: "user",
    colorClass: "text-pink-600",
    bgClass: "bg-pink-50",
  },
  {
    id: 4,
    loanName: "Bike Loan",
    bankName: "Axis Bank",
    loanCategory: "Vehicle Loan",
    loanReference: "AXIS-BL-11294",
    originalAmount: 50000,
    emiAmount: 2000,
    interestRate: 9.8,
    outstandingPrincipal: 38000,
    loanStartDate: "2025-04-25",
    firstEmiDate: "2025-05-25",
    nextDueDate: "25 Nov, 2025",
    daysLeft: 17,
    dueDay: 25,
    tenureMonths: 24,
    totalEmis: 24,
    paidEmis: 6,
    remainingEmis: 18,
    status: "Active",
    scheduleStatus: "Upcoming",
    ownershipType: "family_shared",
    sharedWithFamily: true,
    paymentMethod: "UPI",
    autoDebit: false,
    categoryIcon: "bike",
    colorClass: "text-emerald-600",
    bgClass: "bg-emerald-50",
  },
  {
    id: 5,
    loanName: "Education Loan",
    bankName: "Bank of Baroda",
    loanCategory: "Education Loan",
    loanReference: "BOB-EL-30018",
    originalAmount: 300000,
    emiAmount: 7500,
    interestRate: 7.8,
    outstandingPrincipal: 0,
    loanStartDate: "2022-01-05",
    firstEmiDate: "2022-02-05",
    nextDueDate: "Completed",
    daysLeft: 0,
    dueDay: 5,
    tenureMonths: 36,
    totalEmis: 36,
    paidEmis: 36,
    remainingEmis: 0,
    status: "Completed",
    scheduleStatus: "Paid",
    ownershipType: "personal",
    sharedWithFamily: false,
    paymentMethod: "Bank Transfer",
    autoDebit: true,
    categoryIcon: "graduation",
    colorClass: "text-purple-600",
    bgClass: "bg-purple-50",
  },
];

// Summary Statistics Matching Screenshot
export const emiSummaryStats = {
  activeEmis: 4,
  monthlyEmi: 32500, // 18500 + 14000 + 8000 + 2000
  totalOutstanding: 845000, // Matching the screenshot card value ₹8,45,000
  paidEmis: 28, // Matching screenshot
  completedLoans: 1,
  archivedLoans: 0,
};

// Next EMI Payment Card (Home Loan)
export const nextPaymentHighlight = {
  loanId: 1,
  loanName: "Home Loan",
  bankName: "HDFC Bank",
  amount: 18500,
  dueDate: "10 Nov, 2025",
  daysLeft: 2,
  status: "Due Soon",
  urgency: "warning",
};

// Calendar Highlighted Dates for November 2025
export const calendarDaysNovember2025 = [
  { day: 10, status: "due_soon", label: "Home Loan ₹18,500" },
  { day: 15, status: "upcoming", label: "Car Loan ₹14,000" },
  { day: 20, status: "upcoming", label: "Personal Loan ₹8,000" },
  { day: 25, status: "upcoming", label: "Bike Loan ₹2,000" },
  { day: 28, status: "paid", label: "Advance Paid" },
];

// Recent Payment History
export const mockPaymentHistory: MockPaymentRecord[] = [
  {
    id: 101,
    emiId: 1,
    loanName: "Home Loan",
    bankName: "HDFC Bank",
    installmentNo: 27,
    dueDate: "2025-10-10",
    paymentDate: "2025-10-09",
    amount: 18500,
    paymentMethod: "Auto Debit",
    transactionReference: "HDFC-TXN-902341",
    status: "Success",
  },
  {
    id: 102,
    emiId: 2,
    loanName: "Car Loan",
    bankName: "SBI",
    installmentNo: 15,
    dueDate: "2025-10-15",
    paymentDate: "2025-10-14",
    amount: 14000,
    paymentMethod: "UPI Transfer",
    transactionReference: "UPI-SBI-881239",
    status: "Success",
  },
  {
    id: 103,
    emiId: 3,
    loanName: "Personal Loan",
    bankName: "ICICI Bank",
    installmentNo: 7,
    dueDate: "2025-10-20",
    paymentDate: "2025-10-20",
    amount: 8000,
    paymentMethod: "NetBanking",
    transactionReference: "ICICI-IMPS-77401",
    status: "Success",
  },
  {
    id: 104,
    emiId: 4,
    loanName: "Bike Loan",
    bankName: "Axis Bank",
    installmentNo: 5,
    dueDate: "2025-10-25",
    paymentDate: "2025-10-24",
    amount: 2000,
    paymentMethod: "UPI",
    transactionReference: "UPI-AXIS-33109",
    status: "Success",
  },
  {
    id: 105,
    emiId: 5,
    loanName: "Education Loan",
    bankName: "Bank of Baroda",
    installmentNo: 36,
    dueDate: "2025-01-05",
    paymentDate: "2025-01-04",
    amount: 7500,
    paymentMethod: "Bank Transfer",
    transactionReference: "BOB-NEFT-12903",
    status: "Success",
  },
];

// Family Members
export const mockFamilyMembers: MockFamilyMember[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul.sharma@myvello.life",
    role: "Owner",
    joinedDate: "Owner (Creator)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    sharedLoansCount: 2,
    personalLoansCount: 2,
  },
  {
    id: 2,
    name: "Sunita Sharma",
    email: "sunita.sharma@example.com",
    role: "Admin",
    joinedDate: "12 Jan, 2025",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250",
    sharedLoansCount: 2,
    personalLoansCount: 0,
  },
  {
    id: 3,
    name: "Rohan Sharma",
    email: "rohan.sharma@example.com",
    role: "Member",
    joinedDate: "15 Feb, 2025",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
    sharedLoansCount: 2,
    personalLoansCount: 0,
  },
  {
    id: 4,
    name: "Pooja Sharma",
    email: "pooja.sharma@example.com",
    role: "Member",
    joinedDate: "20 Mar, 2025",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250",
    sharedLoansCount: 2,
    personalLoansCount: 0,
  },
];

// In-App Notifications
export const mockNotifications: MockNotification[] = [
  {
    id: 1,
    title: "Home Loan EMI Due Soon",
    message: "₹18,500 due on 10 Nov, 2025 (2 days remaining). Ensure sufficient balance in HDFC Bank account.",
    timestamp: "2 hours ago",
    type: "urgent",
    isRead: false,
    emiId: 1,
  },
  {
    id: 2,
    title: "Upcoming Car Loan Instalment",
    message: "₹14,000 scheduled for 15 Nov, 2025 from SBI account.",
    timestamp: "Yesterday",
    type: "reminder",
    isRead: false,
    emiId: 2,
  },
  {
    id: 3,
    title: "Payment Recorded Successfully",
    message: "₹18,500 for October instalment has been verified and logged into payment history.",
    timestamp: "3 days ago",
    type: "success",
    isRead: false,
    emiId: 1,
  },
  {
    id: 4,
    title: "Family Workspace Invitation Accepted",
    message: "Pooja Sharma accepted your invitation to join Sharma Family workspace.",
    timestamp: "1 week ago",
    type: "family",
    isRead: true,
  },
  {
    id: 5,
    title: "Personal Loan Due in 12 Days",
    message: "₹8,000 for ICICI Personal Loan due on 20 Nov, 2025.",
    timestamp: "1 week ago",
    type: "reminder",
    isRead: true,
    emiId: 3,
  },
  {
    id: 6,
    title: "Bike Loan Scheduled",
    message: "₹2,000 due on 25 Nov, 2025 via Axis Bank UPI.",
    timestamp: "2 weeks ago",
    type: "reminder",
    isRead: true,
    emiId: 4,
  },
];
