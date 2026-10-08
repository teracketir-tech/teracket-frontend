
import {
    Banknote,
    Building,
    Building2Icon,
    Group,
    LayoutDashboard,
    // Settings,
    Settings2,
    TextInitialIcon,
    User,
    Users,
    BadgeDollarSign,
    Briefcase,
    Building2,
    Calculator,
    ClipboardList,
    FileSpreadsheet,
    FileText,
    FolderKanban,
    HandCoins,
    HeartHandshake,
    Receipt,
    ScrollText, UserMinus,
    ShieldCheck,
    UserCog,
    UserRoundMinus,
    WalletCards,
} from "lucide-react";

import Login from "@/pages/login";
import Layout from "@/components/layout";
import Home from "@/pages/Home";
import CreateGroup from "@/pages/group/create";
import GroupList from "@/pages/group";
import CreateUser from "@/pages/user/create";
import UserList from "@/pages/user";
// import Setting from "@/pages/setting";
import CreateAccountingData from "@/pages/accounting-data/create";
import AccountingDataList from "@/pages/accounting-data";
import CreateCompany from "@/pages/company/create";
import CompanyList from "@/pages/company";
import CreateProject from "@/pages/project/create";
import ProjectList from "@/pages/project";
import CreateCompanyBank from "@/pages/company-bank/create";
import CompanyBankList from "@/pages/company-bank";
import CreateAccounting from "@/pages/accounting/create";
import CreateContact from "@/pages/contact/create";
import ContactList from "@/pages/contact";
import AccountingList from "@/pages/accounting";
import AccountingItemList from "@/pages/accounting/items";
import AccountingDataReport from "@/pages/accounting-data/report";
import AccountingDataReportCalendar from "@/pages/accounting/calendar";
import UserLoginLogList from "@/pages/user/login-log";
import ImportAccountingByExcel from "@/pages/accounting/import-by-excel";
import PaymentList from "@/pages/accounting/payments";
import ReceiveList from "@/pages/accounting/receives";


// کدهای HRM
import FinancialYearSettings from "@/pages/hrm/settings/financial-year";
import WorkingDaysSettings from "@/pages/hrm/settings/working-days";
import CreateAsset from "@/pages/hrm/assets/create";
import PersonnelAssets from "@/pages/hrm/assets/personnel";
import TransferAsset from "@/pages/hrm/assets/transfer";
import BankAccount from "@/pages/hrm/finance/account";
import Insurance from "@/pages/hrm/finance/insurance";
import InsurancePayment from "@/pages/hrm/finance/insurance-payment";

import Advance from "@/pages/hrm/payments/advance";
import Loan from "@/pages/hrm/payments/loan";
import Adjustment from "@/pages/hrm/payments/adjustment";
import DailyAttendance from "@/pages/hrm/performance/daily";
import Vacation from "@/pages/hrm/performance/vacation";
import Missions from "@/pages/hrm/performance/missions";
import Contracts from "@/pages/hrm/contracts";
import Contract from "@/pages/hrm/contract";
import EditTab from "@/pages/hrm/contract/tabs/EditTab";
import ContractTermination from "@/pages/hrm/contracts/termination";
import TerminationReport from "@/pages/hrm/contracts/termination-report";
import MonthlyConvert from "@/pages/hrm/performance/monthly-convert";
import MonthlyReport from "@/pages/hrm/performance/monthly";
import BonusSettlement from "@/pages/hrm/end-year/bonus";
import VacationBuyback from "@/pages/hrm/end-year/vacation";
import SalarySlip from "@/pages/hrm/payments/salary";
import SalaryProcess from "@/pages/hrm/payments/process";
import SalaryReports from "@/pages/hrm/payments/reports";
import PersonnelCreate from "@/pages/hrm/personnel/create";
import PersonnelList from "@/pages/hrm/personnel/list/";
import WorkGroup from "@/pages/hrm/settings/workgroup";
import ContractPrint from '@/pages/hrm/contracts/ContractPrint';

export const routes = [
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                active: false,
                path: "/login",
                element: <Login />,
            },
            {
                active: true,
                title: "داشبورد",
                path: "/",
                icon: LayoutDashboard,
                element: <Home />,
                children: [],
            },
            {
                active: true,
                title: "شرکت",
                icon: Settings2,
                children: [
                    {
                        active: true,
                        title: "شرکت جدید",
                        path: "/company/create",
                        element: <CreateCompany />,
                        role: [101],
                    },
                    {
                        active: true,
                        title: "لیست شرکت ها",
                        path: "/company",
                        element: <CompanyList />,
                        role: [102],
                    },
                    {
                        title: "ویرایش شرکت",
                        path: "/company/edit/:id",
                        element: <CreateCompany editMode={1} />,
                    },
                ],
                role: [102],
            },
            {
                active: true,
                title: "پروژه",
                icon: Building2Icon,
                children: [
                    {
                        active: true,
                        title: "پروژه جدید",
                        path: "/project/create",
                        element: <CreateProject />,
                        role: [201],
                    },
                    {
                        active: true,
                        title: "لیست پروژه ها",
                        path: "/project",
                        element: <ProjectList />,
                        role: [202],
                    },
                    {
                        title: "ویرایش پروژه",
                        path: "/project/edit/:id",
                        element: <CreateProject editMode={1} />,
                    },
                ],
                role: [202],
            },
            {
                active: true,
                title: "حساب داری",
                icon: Banknote,
                children: [
                    {
                        active: true,
                        seperator: "بانک ها",
                        seperatorIcon: Building,
                        title: "بانک جدید",
                        path: "/company-bank/create",
                        element: <CreateCompanyBank />,
                        role: [301],
                    },
                    {
                        active: true,
                        title: "لیست بانک ها",
                        path: "/company-bank",
                        element: <CompanyBankList />,
                        role: [302],
                    },
                    {
                        title: "ویرایش بانک",
                        path: "/company-bank/edit/:id",
                        element: <CreateCompanyBank editMode={1} />,
                    },

                    // contact

                    {
                        active: true,
                        seperator: "اشخاص",
                        seperatorIcon: User,
                        title: "شخص جدید",
                        path: "/contact/create",
                        element: <CreateContact />,
                        role: [401],
                    },
                    {
                        active: true,
                        title: "لیست اشخاص",
                        path: "/contact",
                        element: <ContactList />,
                        role: [402],
                    },
                    {
                        title: "ویرایش شخص",
                        path: "/contact/edit/:id",
                        element: <CreateContact editMode={1} />,
                    },

                    // accounting data

                    {
                        active: true,
                        seperator: "حساب ها",
                        seperatorIcon: Banknote,
                        title: "حساب جدید",
                        path: "/accounting-data/create",
                        element: <CreateAccountingData />,
                        role: [501],
                    },
                    {
                        active: true,
                        title: "لیست حساب ها",
                        path: "/accounting-data",
                        element: <AccountingDataList />,
                        role: [502],
                    },
                    {
                        active: true,
                        title: "گزارش حساب ها",
                        path: "/accounting-data/report",
                        element: <AccountingDataReport />,
                        role: [502],
                    },
                    {
                        title: "ویرایش حساب",
                        path: "/accounting-data/edit/:id",
                        element: <CreateAccountingData editMode={1} />,
                    },

                    // accounting
                    {
                        active: true,
                        seperator: "سند ها",
                        seperatorIcon: TextInitialIcon,
                        title: "سند جدید",
                        path: "/accounting/create",
                        element: <CreateAccounting />,
                        role: [601],
                    },
                    {
                        active: true,
                        title: "لیست سند ها",
                        path: "/accounting",
                        element: <AccountingList />,
                        role: [602],
                    },
                    {
                        active: true,
                        title: "لیست آیتم های حسابداری",
                        path: "/accounting/items",
                        element: <AccountingItemList />,
                        role: [605],
                    },
                    {
                        active: true,
                        title: "لیست پرداخت ها",
                        path: "/accounting/payments",
                        element: <PaymentList />,
                        role: [605],
                    },
                    {
                        active: true,
                        title: "لیست دریافت ها",
                        path: "/accounting/receives",
                        element: <ReceiveList />,
                        role: [605],
                    },
                    {
                        active: true,
                        title: "افزودن سند با اکسل",
                        path: "/accounting/import-by-excel",
                        element: <ImportAccountingByExcel />,
                        role: [605],
                    },
                    {
                        active: true,
                        title: "تقویم",
                        path: "/accounting/calendar",
                        element: <AccountingDataReportCalendar />,
                        role: [502],
                    },
                ],
                role: [302, 402, 502, 602, 605],
            },
            {
                active: true,
                title: "کاربران",
                icon: Users,
                children: [
                    {
                        active: true,
                        seperator: "کاربران",
                        seperatorIcon: Users,
                        title: "کاربر جدید",
                        path: "/user/create",
                        element: <CreateUser />,
                        role: [701],
                    },
                    {
                        active: true,
                        title: "لیست کاربران",
                        path: "/user",
                        element: <UserList />,
                        role: [702],
                    },
                    {
                        title: "ویرایش کاربر",
                        path: "/user/edit/:id",
                        element: <CreateUser editMode={1} />,
                    },
                    {
                        title: "لاگ ورود کاربر",
                        path: "/user/:id/login-log",
                        element: <UserLoginLogList />,
                    },

                    // group

                    {
                        active: true,
                        seperator: "گروه کاربران",
                        seperatorIcon: Group,
                        title: "گروه جدید",
                        path: "/group/create",
                        element: <CreateGroup />,
                        role: [801],
                    },
                    {
                        active: true,
                        title: "لیست گروه ها",
                        path: "/group",
                        element: <GroupList />,
                        role: [802],
                    },
                    {
                        title: "ویرایش گروه",
                        path: "/group/edit/:id",
                        element: <CreateGroup editMode={1} />,
                    },
                ],
                role: [702, 802],
            }
            ,
            {
                active: true,
                title: "مدیریت منابع انسانی",
                icon: Users,
                children: [ 
                    {
                       active: true,
                        seperator: "امور قراردادها ",
                        seperatorIcon: FileText,
                        title: " تدوین / مدیریت",
                        path: "/hrm/contract/create",
                        element: <Contract />,
                        role: [702],
                    },
                    {
                        path: "/hrm/contract/edit/:id",
                        element: <EditTab />,
                    },

                    {
                        path: '/hrm/contracts/print/:id',
                        element: <ContractPrint />,
                    }
                    ,
                    {
                        active: true,
                        seperator: "اطلاعات پرسنل",
                        seperatorIcon: User,
                        title: "ثبت / ویرایش",
                        path: "/hrm/personnel/create",
                        element: <PersonnelCreate />,
                        role: [702],
                    },
                    {
                        active: true,
                        title: "گزارش پرسنل",

                        path: "/hrm/personnel",
                        element: <PersonnelList />,


                        role: [702],
                    },

                    {
                        active: true,
                        seperator: "گروه کاری",
                        seperatorIcon: Users,
                        title: "مدیریت گروه کاری",
                        path: "/workgroup/create",
                        element: <WorkGroup />,
                        role: [702],
                    },

                    {
                          active: true,
                        seperator: "اطلاعات مالی / بیمه",
                        seperatorIcon: WalletCards,
                        title: "ثبت حساب",
                        path: "/hrm/finance/account",
                        element: <BankAccount />,
                        role: [702],
                    },
                    {
                           active: true,
                        title: "ثبت بیمه",
                        path: "/hrm/finance/insurance",
                        element: <Insurance />,
                        role: [702],
                    },
                    {
                           active: true,
                        title: "ثبت پرداختی حق بیمه",
                        path: "/hrm/finance/insurance-payment",
                        element: <InsurancePayment />,
                        role: [702],
                    },

                    {
                          active: true,
                        seperator: "عملکرد پرسنل",
                        seperatorIcon: LayoutDashboard,
                        title: "کارکرد روزانه",
                        path: "/hrm/performance/daily",
                        element: <DailyAttendance />,
                        role: [702],
                    },

                    {
                           active: true,
                        title: "مرخصی",
                        path: "/hrm/performance/vacation",
                        element: <Vacation />,
                        role: [702],
                    },
                    {
                           active: true,
                        title: "ماموریت",
                        path: "/hrm/performance/missions",
                        element: <Missions />,
                        role: [702],
                    },
                    {
                            active: true,
                        title: "تبدیل کارکرد / مرخصی روزانه به ماهیانه",
                        path: "/hrm/performance/monthly-convert",
                        element: <MonthlyConvert />,
                        role: [702],
                    },
                    {
                            active: true,
                        title: "کارکرد ماهانه",
                        path: "/hrm/performance/monthly",
                        element: <MonthlyReport />,
                        role: [702],
                    },
                    {
                            active: true,
                        seperator: "پرداخت",
                        seperatorIcon: Banknote,
                        title: "مساعده",
                        path: "/hrm/payments/advance",
                        element: <Advance />,
                        role: [702],
                    },
                    {
                            active: true,
                        title: "وام",
                        path: "/hrm/payments/loan",
                        element: <Loan />,
                        role: [702],
                    },
                    {
                           active: true,
                        title: "اضافه / کسر از حقوق",
                        path: "/hrm/payments/adjustment",
                        element: <Adjustment />,
                        role: [702],
                    },
                    {
                            active: true,
                        title: "صورت حساب کلی حقوق و دستمزد",
                        path: "/hrm/payments/salary",
                        element: <SalarySlip />,
                        role: [702],
                    },
 {
                            active: true,
                        title: "محاسبه فرایند",
                        path: "/hrm/payments/process",
                        element: <SalaryProcess />,
                        role: [702],
                    },

 {
                            active: true,
                        title: "گزارشات  ",
                        path: "/hrm/payments/reports",
                        element: <SalaryReports />,
                        role: [702],
                    },
                    {
                           active: false,
                        seperator: "تسویه حساب آخر سال",
                        seperatorIcon: Receipt,
                        title: "تسویه حساب عیدی",
                        path: "/hrm/end-year/bonus",
                        element: <BonusSettlement />,
                        role: [702],
                    },
                    {
                          active: false,
                        title: "بازخرید مانده مرخصی",
                        path: "/hrm/end-year/vacation",
                        element: <VacationBuyback />,
                        role: [702],
                    },

                    {
                          active: false,
                        seperator: "قطع همکاری",
                        seperatorIcon: UserMinus,
                        title: "قطع همکاری",
                        path: "/hrm/termination/create",
                        element: <ContractTermination />,
                        role: [702],
                    },
                    {
                           active: false,
                        title: "گزارش",
                        path: "/hrm/termination/report",
                        element: <TerminationReport />,
                        role: [702],
                    },

                    {
                           active: false,
                        seperator: "مدیریت کاربران",
                        seperatorIcon: Users,
                        title: "کاربران",
                        path: "/user",
                        element: null,
                        role: [702],
                    },
                    {
                           active: false,
                        title: "نقش ها",
                        path: "/group",
                        element: null,
                        role: [702],
                    },

                    {
                            active: true,
                        seperator: "مدیریت اموال",
                        seperatorIcon: Building,
                        title: "تعریف اموال جدید",
                        path: "/hrm/assets/create",
                        element: <CreateAsset />,
                        role: [702],
                    },
                    {
                          active: true,
                        title: "اموال در اختیار پرسنل",
                        path: "/hrm/assets/personnel",
                        element: <PersonnelAssets />,
                        role: [702],
                    },
                    {
                             active: true,
                        title: "واگذاری اموال",
                        path: "/hrm/assets/assign",
                        element: <TransferAsset />,
                        role: [702],
                    },
                    {
                            active: true,
                        seperator: "تنظیمات مالی",
                        seperatorIcon: Settings2,
                        title: "سال مالی",
                        path: "/hrm/settings/financial-year",
                        element: <FinancialYearSettings />,
                        role: [702],
                    },
                    {
                            active: true,
                        title: "روز کاری در ماه",
                        path: "/hrm/settings/working-days",
                        element: <WorkingDaysSettings />,
                        role: [702],
                    },
                ],
                role: [702],
            },
            // {
            //     active: true,
            //     title: "تنظیمات",
            //     path: "/setting",
            //     icon: Settings,
            //     element: <Setting />,
            //     children: [],
            //     role: [501],
            // },
        ],
    },
];
