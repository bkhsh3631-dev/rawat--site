import { Fragment, useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Link, Route, Switch, Router as WouterRouter, useLocation, useParams } from 'wouter';
import {
  ArrowLeft, ArrowUpLeft, Award, BookOpen, Check, ChevronLeft, ChevronRight, CircleHelp,
  Bell, Clock3, FlaskConical, GraduationCap, LayoutDashboard, Leaf, LogIn, LogOut, Mail, Menu,
  MessageCircle, Moon, MoreHorizontal, PenLine, Play, Plus, RefreshCw, Search, Send, Settings2,
  ShieldCheck, Sparkles, Sun, Target, Trash2, Trophy, UserRound, Users, Wifi, X, Zap, ListOrdered
} from 'lucide-react';
import {
  getGetAdminSummaryQueryKey, getGetCurrentUserQueryKey, getGetLessonQueryKey,
  getListAdminQuestionsQueryKey,
  getGetProfileQueryKey, getGetSiteOverviewQueryKey, getListAdminCommentsQueryKey,
  getListContactMessagesQueryKey, getListEncouragementsQueryKey, getListLessonsQueryKey, getListUsersQueryKey,
  useAnswerComment, useCreateComment, useCreateContactMessage, useCreateEncouragement, useCreateLesson,
  useCreateQuestion, useDeleteLesson, useDeleteQuestion, useGetAdminSummary,
  useDeleteContactMessage, useGetCurrentUser, useGetLesson, useGetProfile, useGetSiteOverview, useListAdminComments,
  useListContactMessages,
  useListAdminQuestions,
  useListEncouragements, useListLessons, useListUsers, useLogin, useLogout,
  useRegister, useSubmitQuizAttempt, useUpdateLesson, useUpdateQuestion
} from '@workspace/api-client-react';
import type { AdminQuestion, ContactMessage, Lesson } from '@workspace/api-client-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/hooks/use-toast';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import biologyIllustration from '@assets/biology-illustration-transparent.png';
import './index.css';

const queryClient = new QueryClient();
const rtlDate = (value?: string | null) => value ? new Date(value).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' }) : '—';
const gradeLabel = (grade?: string) => grade === 'first' ? 'الأول الثانوي' : 'الثاني الثانوي';
const termLabel = (term?: string) => term === 'first' ? 'الفصل الأول' : 'الفصل الثاني';

function CellMotif() {
  return <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
    <span className="cell animate-float left-[7%] top-[18%] h-24 w-28" />
    <span className="cell animate-drift right-[8%] top-[20%] h-36 w-40 border-secondary/30" />
    <span className="cell animate-float left-[23%] bottom-[5%] h-16 w-20" />
    <span className="cell animate-drift right-[28%] bottom-[12%] h-20 w-24" />
    <span className="absolute left-[12%] top-[34%] h-2 w-2 rounded-full bg-accent/70" />
    <span className="absolute right-[20%] top-[55%] h-3 w-3 rounded-full bg-primary/30" />
  </div>;
}

function Logo({ compact = false }: { compact?: boolean }) {
  return <Link href="/" data-testid="link-logo" className="flex items-center gap-3">
    <span className="grid h-11 w-11 place-items-center rounded-[17px] bg-primary text-primary-foreground shadow-sm">
      <FlaskConical size={22} strokeWidth={1.7} />
    </span>
    {!compact && <span className="leading-tight"><strong className="display block text-lg">روعة الحياة</strong><small className="text-[11px] text-muted-foreground">علوم الأحياء</small></span>}
  </Link>;
}

function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); localStorage.setItem('rawat-theme', dark ? 'dark' : 'light'); }, [dark]);
  return <button aria-label={dark ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'} data-testid="button-theme-toggle" onClick={() => setDark(value => !value)} className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-primary transition hover:-translate-y-0.5">
    {dark ? <Sun size={17} /> : <Moon size={17} />}
  </button>;
}

function Header({ user, onLogout }: { user: any; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
    <div className="mx-auto flex h-[76px] max-w-[1340px] items-center justify-between px-5 md:px-10">
      <div className="flex items-center gap-3"><button onClick={() => setOpen(!open)} aria-label="فتح القائمة" data-testid="button-open-menu" className="grid h-10 w-10 place-items-center rounded-full border border-border md:hidden"><Menu size={19} /></button><Logo /></div>
      <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
        <Link data-testid="link-home" href="/">البداية</Link><Link data-testid="link-lessons" href="/lessons">المكتبة</Link>
        {user?.role === 'admin' && <Link data-testid="link-admin" href="/admin">لوحة الإدارة</Link>}<Link data-testid="link-contact" href="/contact">تواصل معنا</Link>
      </nav>
      <div className="flex items-center gap-2"><ThemeToggle />{user ? <div className="hidden items-center gap-2 sm:flex"><Link href="/profile" data-testid="link-profile" className="flex items-center gap-2 rounded-full bg-card px-3 py-2 text-sm font-semibold"><span className="grid h-7 w-7 place-items-center rounded-full bg-secondary text-primary">{user.name?.charAt(0)}</span>{user.name}</Link><button onClick={onLogout} data-testid="button-logout" aria-label="تسجيل الخروج" className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground hover:text-destructive"><LogOut size={17} /></button></div> : <Link data-testid="link-login" href="/login" className="hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground sm:block">دخول المتعلم</Link>}</div>
    </div>
    {open && <nav className="animate-appear border-t border-border px-5 py-4 md:hidden"><div className="grid gap-2 text-sm"><Link onClick={() => setOpen(false)} data-testid="mobile-link-home" href="/" className="rounded-xl px-3 py-3">البداية</Link><Link onClick={() => setOpen(false)} data-testid="mobile-link-lessons" href="/lessons" className="rounded-xl px-3 py-3">مكتبة الدروس</Link>{user?.role === 'admin' && <Link onClick={() => setOpen(false)} data-testid="mobile-link-admin" href="/admin" className="rounded-xl px-3 py-3">لوحة الإدارة</Link>}<Link onClick={() => setOpen(false)} data-testid="mobile-link-contact" href="/contact" className="rounded-xl px-3 py-3">تواصل معنا</Link>{user && <button onClick={onLogout} data-testid="mobile-button-logout" className="border-t border-border px-3 py-3 text-right text-destructive">تسجيل الخروج</button>}</div></nav>}
  </header>;
}

function Footer() {
  return <footer className="mt-20 border-t border-border bg-card/40"><div className="mx-auto flex max-w-[1340px] flex-col gap-8 px-5 py-10 md:flex-row md:items-end md:justify-between md:px-10"><div><Logo /><p className="mt-4 max-w-xs text-sm leading-7 text-muted-foreground">نرافق فضولك العلمي من أول خلية إلى أعقد نظام حي.</p></div><div className="flex gap-6 text-sm text-muted-foreground"><Link href="/lessons" data-testid="footer-link-lessons">الدروس</Link><Link href="/contact" data-testid="footer-link-contact">المساعدة والتواصل</Link></div><p className="text-xs text-muted-foreground">جميع الحقوق محفوظة © 2026 - تم التطوير بواسطة سهام</p></div></footer>;
}

function Shell({ children, user, onLogout, bare = false }: { children: ReactNode; user: any; onLogout: () => void; bare?: boolean }) {
  return bare ? <main>{children}</main> : <div dir="rtl" className="app-shell"><Header user={user} onLogout={onLogout} /><main>{children}</main><Footer /></div>;
}

function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) {
  return <div className="mb-7 flex items-end justify-between gap-4"><div><p className="mb-2 text-xs font-bold tracking-[.16em] text-accent">{eyebrow}</p><h2 className="display text-2xl font-bold md:text-3xl">{title}</h2></div>{action}</div>;
}

function LessonCard({ lesson, featured = false }: { lesson: Lesson; featured?: boolean }) {
  return <Link href={`/lessons/${lesson.id}`} data-testid={`card-lesson-${lesson.id}`} className={`group relative flex flex-col justify-between overflow-hidden rounded-[26px] border border-border bg-card p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md ${featured ? 'min-h-[270px] bg-primary text-primary-foreground' : 'min-h-[230px]'}`}>
    <div><div className="mb-5 flex items-center justify-between"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${featured ? 'bg-primary-foreground/15 text-secondary' : 'bg-secondary/35 text-primary'}`}>{termLabel(lesson.term)}</span><span className={featured ? 'text-primary-foreground/60' : 'text-muted-foreground'}><MoreHorizontal size={19} /></span></div><h3 className="display text-xl font-bold leading-[1.45]">{lesson.title}</h3><p className={`mt-2 line-clamp-2 text-sm leading-6 ${featured ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{lesson.description}</p></div>
    <div className={`mt-6 flex items-center justify-between border-t pt-4 text-xs ${featured ? 'border-primary-foreground/20 text-primary-foreground/70' : 'border-border text-muted-foreground'}`}><span className="flex items-center gap-1.5"><Clock3 size={14} />{lesson.duration}</span><span className="flex items-center gap-1.5"><CircleHelp size={14} />{lesson.questionCount} أسئلة</span>{lesson.completedByMe && <span className="flex items-center gap-1 text-secondary"><Check size={14} />مكتمل</span>}</div>
  </Link>;
}

type HomeRegisteredUser = { id: string; name: string; email: string; age: number };
const homeRegisteredUsersKey = 'rawat-home-registered-users';
const homeCurrentUserKey = 'rawat-home-current-user';

function HomeRegistrationOverlay({ onRegister }: { onRegister: (user: HomeRegisteredUser) => void }) {
  const [form, setForm] = useState({ name: '', email: '', age: '' });
  const [error, setError] = useState('');
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const age = Number(form.age);
    if (!form.name.trim() || !Number.isInteger(age) || age < 10 || age > 100) {
      setError('اكتبي الاسم والعمر الصحيحين للمتابعة.');
      return;
    }
    onRegister({ id: `local-${Date.now()}`, name: form.name.trim(), email: form.email.trim(), age });
  };
  return <div className="fixed inset-0 z-[70] grid place-items-center bg-[#30254f]/45 p-4 backdrop-blur-md">
    <div className="glass w-full max-w-md rounded-[30px] border-white/60 bg-white/80 p-6 shadow-2xl md:p-8">
      <div className="mb-6 text-center"><span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#e8e1ff] text-[#4d397f]"><FlaskConical size={26} /></span><p className="text-xs font-bold tracking-[.16em] text-[#e9795e]">خطوتك الأولى</p><h2 className="display mt-2 text-2xl font-bold text-[#30254f]">اكتشفي عالم الحياة</h2><p className="mt-2 text-sm leading-7 text-[#736b85]">سجّلي بياناتك لبدء رحلتك التعليمية.</p></div>
      <form onSubmit={submit} className="grid gap-4">
        <Field label="الاسم (مطلوب)" test="home-register-name" value={form.name} onChange={value => setForm({ ...form, name: value })} placeholder="اكتبي اسمك" />
        <Field label="البريد الإلكتروني (اختياري)" test="home-register-email" type="email" value={form.email} onChange={value => setForm({ ...form, email: value })} placeholder="you@example.com" />
        <Field label="العمر (مطلوب)" test="home-register-age" type="number" value={form.age} onChange={value => setForm({ ...form, age: value })} placeholder="16" />
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button type="submit" data-testid="home-register-submit" className="mt-2 rounded-2xl bg-[#4d397f] py-3.5 font-bold text-white transition hover:bg-[#3f2f6a]">تسجيل</button>
      </form>
    </div>
  </div>;
}

function HomeUsersOverlay({ users, onClose }: { users: HomeRegisteredUser[]; onClose: () => void }) {
  return <div className="fixed inset-0 z-[75] grid place-items-center bg-[#30254f]/45 p-4 backdrop-blur-md">
    <div className="w-full max-w-4xl rounded-[30px] border border-white/60 bg-white p-5 shadow-2xl md:p-7">
      <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold tracking-[.16em] text-[#e9795e]">إدارة الحسابات المحلية</p><h2 className="display mt-1 text-2xl font-bold text-[#30254f]">المستخدمون المسجلون</h2></div><button type="button" onClick={onClose} aria-label="إغلاق جدول المستخدمين" className="grid h-10 w-10 place-items-center rounded-full bg-[#eee9ff] text-[#4d397f]"><X size={18} /></button></div>
      <div className="mt-5 max-h-[65vh] overflow-auto rounded-2xl border border-[#e5def4]"><table className="w-full min-w-[680px] text-right text-sm"><thead className="sticky top-0 bg-[#f5f2fb] text-xs text-[#736b85]"><tr><th className="px-4 py-3">الاسم</th><th className="px-4 py-3">البريد</th><th className="px-4 py-3">العمر</th><th className="px-4 py-3">كلمة المرور</th><th className="px-4 py-3">حسابه</th></tr></thead><tbody>{users.length ? users.map(user => <tr key={user.id} className="border-t border-[#eeeaf6]"><td className="px-4 py-4 font-bold text-[#30254f]">{user.name}</td><td className="px-4 py-4 text-[#736b85]">{user.email || '—'}</td><td className="px-4 py-4 text-[#736b85]">{user.age}</td><td className="px-4 py-4 text-xs text-[#81798e]">غير محفوظة لأسباب أمنية</td><td className="px-4 py-4 text-xs font-bold text-[#4d397f]">{user.id}</td></tr>) : <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-[#81798e]">لا يوجد مستخدمون مسجلون بعد.</td></tr>}</tbody></table></div>
      <p className="mt-4 text-xs leading-6 text-[#81798e]">لا يتم تخزين أو عرض كلمات المرور داخل المتصفح أو الجدول حفاظاً على أمان الحسابات.</p>
    </div>
  </div>;
}

function HomePage({ user }: { user: any }) {
  const overview = useGetSiteOverview();
  const tracks = overview.data?.tracks ?? [];
  const featured = overview.data?.featuredLessons ?? [];
  const [homeUsers, setHomeUsers] = useState<HomeRegisteredUser[]>([]);
  const [homeUser, setHomeUser] = useState<HomeRegisteredUser | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  useEffect(() => {
    try {
      const users = JSON.parse(localStorage.getItem(homeRegisteredUsersKey) ?? '[]') as HomeRegisteredUser[];
      const current = JSON.parse(localStorage.getItem(homeCurrentUserKey) ?? 'null') as HomeRegisteredUser | null;
      setHomeUsers(Array.isArray(users) ? users : []);
      setHomeUser(current);
      setShowRegistration(!user && !current);
    } catch {
      setShowRegistration(!user);
    }
  }, [user?.id]);
  const registerHomeUser = (newUser: HomeRegisteredUser) => {
    const next = [...homeUsers, newUser];
    setHomeUsers(next);
    setHomeUser(newUser);
    setShowRegistration(false);
    localStorage.setItem(homeRegisteredUsersKey, JSON.stringify(next));
    localStorage.setItem(homeCurrentUserKey, JSON.stringify(newUser));
  };
  const welcomeName = homeUser?.name ?? user?.name;
  return <div>
    <section className="relative overflow-hidden bg-primary text-primary-foreground"><CellMotif /><div className="main-pad relative mx-auto max-w-[1340px] px-5 py-14 md:py-20"><div className="animate-appear mx-auto max-w-4xl text-center"><div className="mb-5 flex flex-wrap items-center justify-center gap-3">{welcomeName && <span className="rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 text-sm font-semibold text-secondary">أهلاً بك {welcomeName}</span>}<button type="button" onClick={() => setShowUsers(true)} aria-label="عرض المستخدمين المسجلين" className="relative grid h-11 w-11 place-items-center rounded-full border border-primary-foreground/30 bg-primary-foreground/10 text-secondary transition hover:scale-105"><span className="grid h-7 w-7 place-items-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">{(welcomeName ?? 'م').charAt(0)}</span>{homeUsers.length > 0 && <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">1</span>}<Bell className="absolute -bottom-1 -left-1 rounded-full bg-primary p-1 text-primary-foreground" size={17} /></button></div><div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 text-xs text-secondary"><Sparkles size={14} />مساحتك لفهم الحياة</div><h1 className="display text-4xl font-bold leading-[1.35] md:text-6xl">علم الأحياء وعلم البيئة</h1><p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-primary-foreground/75">استكشف عالم الحياة الواسع من أصغر خلية إلى أكبر نظام بيئي. افهم الروابط التي تشكل كوكبنا.</p><div className="mt-8 flex flex-wrap justify-center gap-3">{user ? <Link href="/lessons" data-testid="hero-link-lessons" className="flex items-center gap-2 rounded-full bg-secondary px-6 py-3 font-bold text-secondary-foreground">تابع رحلتك <ArrowLeft size={17} /></Link> : <><Link href="/register" data-testid="hero-link-register" className="flex items-center gap-2 rounded-full bg-secondary px-6 py-3 font-bold text-secondary-foreground">ابدأ مجاناً <ArrowLeft size={17} /></Link><Link href="/lessons" data-testid="hero-link-browse" className="rounded-full border border-primary-foreground/25 px-6 py-3 font-semibold">تصفح الدروس</Link></>}</div></div><div className="relative mx-auto mt-8 flex h-[245px] w-full max-w-[560px] items-center justify-center md:mt-10 md:h-[360px]"><div className="absolute inset-[10%] rounded-[44%_56%_48%_52%] border border-secondary/35 bg-secondary/10 backdrop-blur-sm animate-float"></div><img src={biologyIllustration} alt="رسم توضيحي لعلوم الأحياء والبيئة" className="relative z-10 h-full w-full object-contain drop-shadow-[0_18px_24px_rgba(28,20,62,.22)]" /></div></div></section>
    <section className="main-pad mx-auto max-w-[1340px] px-5 py-16"><SectionHeading eyebrow="مسارات التعلّم" title="من أين نبدأ اليوم؟" action={<Link href="/lessons" data-testid="home-link-all-tracks" className="hidden items-center gap-2 text-sm font-bold text-primary sm:flex">كل الدروس <ChevronLeft size={16} /></Link>} /><div className="grid gap-4 md:grid-cols-2">{tracks.length ? tracks.map((track, index) => <Link href={`/lessons?grade=${track.grade}`} data-testid={`card-track-${track.grade}`} key={track.grade} className={`group flex items-center justify-between rounded-[24px] border border-border p-6 transition hover:-translate-y-1 hover:shadow-md ${index === 0 ? 'bg-secondary/25' : 'bg-card'}`}><div className="flex items-center gap-4"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-card text-primary shadow-sm"><GraduationCap size={25} /></span><div><h3 className="display text-lg font-bold">{track.label}</h3><p className="mt-1 text-sm text-muted-foreground">{track.lessonCount} درساً · {track.terms.length} فصلين</p></div></div><ArrowUpLeft className="text-muted-foreground transition group-hover:-translate-x-1 group-hover:-translate-y-1" size={21} /></Link>) : <div className="glass col-span-full rounded-3xl p-8 text-center text-muted-foreground">نجهّز مساراتك العلمية الآن...</div>}</div></section>
    <section className="main-pad mx-auto max-w-[1340px] px-5 pb-16"><SectionHeading eyebrow="مختاراتنا" title="دروس تستحق فضولك" action={<Link href="/lessons" data-testid="home-link-all-lessons" className="flex items-center gap-2 text-sm font-bold text-primary">استعرض المكتبة <ChevronLeft size={16} /></Link>} /><div className="grid gap-4 md:grid-cols-3">{featured.length ? featured.map((lesson, i) => <LessonCard key={lesson.id} lesson={lesson} featured={i === 0} />) : [1,2,3].map(i => <div key={i} className="h-56 animate-pulse rounded-[26px] bg-muted" />)}</div></section>
    <section className="main-pad mx-auto max-w-[1340px] px-5 pb-20"><div className="relative overflow-hidden rounded-[30px] bg-accent px-7 py-10 text-accent-foreground md:px-12"><span className="absolute -left-6 -top-14 h-48 w-48 rounded-full border-[22px] border-accent-foreground/10"></span><div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-center"><div><p className="mb-2 text-xs font-bold tracking-[.14em] opacity-70">رسالة اليوم</p><h2 className="display max-w-xl text-2xl font-bold leading-[1.6]">{overview.data?.encouragement || 'كل سؤال جيد هو بداية اكتشاف جديد.'}</h2></div><Link href="/lessons" data-testid="cta-explore" className="w-fit rounded-full bg-accent-foreground px-5 py-3 text-sm font-bold text-accent">ابدأ الاستكشاف</Link></div></div></section>
    {showRegistration && <HomeRegistrationOverlay onRegister={registerHomeUser} />}
    {showUsers && <HomeUsersOverlay users={homeUsers} onClose={() => setShowUsers(false)} />}
   </div>;
}

function LessonsPage() {
  const [grade, setGrade] = useState<string>('all'); const [term, setTerm] = useState<string>('all'); const [search, setSearch] = useState('');
  const params = { ...(grade !== 'all' ? { grade: grade as 'first' | 'second' } : {}), ...(term !== 'all' ? { term: term as 'first' | 'second' } : {}) };
  const lessons = useListLessons(params); const list = (lessons.data ?? []).filter(l => l.title.includes(search) || l.description.includes(search));
  return <div className="main-pad mx-auto max-w-[1340px] px-5 py-12 md:py-16"><div className="animate-appear mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-2 text-xs font-bold tracking-[.16em] text-accent">المكتبة العلمية</p><h1 className="display text-4xl font-bold">دروس تنمو معك</h1><p className="mt-3 text-muted-foreground">اختر مسارك، ثم اترك الفضول يقودك.</p></div><Link href="/contact" data-testid="lessons-link-help" className="flex w-fit items-center gap-2 text-sm font-semibold text-primary"><MessageCircle size={17} />هل تحتاج مساعدة؟</Link></div><div className="glass mb-8 flex flex-col gap-3 rounded-2xl p-3 md:flex-row"><label className="relative flex-1"><Search className="absolute right-3 top-3 text-muted-foreground" size={17} /><input data-testid="input-search-lessons" aria-label="ابحث عن درس" value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث عن درس أو وحدة..." className="h-11 w-full rounded-xl bg-muted/55 pr-10 pl-3 text-sm outline-none ring-primary focus:ring-2" /></label><div className="flex gap-2 overflow-x-auto"><select data-testid="select-grade" value={grade} onChange={e => setGrade(e.target.value)} className="h-11 rounded-xl bg-muted/55 px-3 text-sm outline-none"><option value="all">كل الصفوف</option><option value="first">الأول الثانوي</option><option value="second">الثاني الثانوي</option></select><select data-testid="select-term" value={term} onChange={e => setTerm(e.target.value)} className="h-11 rounded-xl bg-muted/55 px-3 text-sm outline-none"><option value="all">كل الفصول</option><option value="first">الفصل الأول</option><option value="second">الفصل الثاني</option></select></div></div>{lessons.isLoading ? <div className="grid gap-4 md:grid-cols-3">{[1,2,3,4,5,6].map(i => <div key={i} className="h-56 animate-pulse rounded-[26px] bg-muted" />)}</div> : list.length ? <div className="grid gap-4 md:grid-cols-3">{list.map(lesson => <LessonCard key={lesson.id} lesson={lesson} />)}</div> : <div className="glass rounded-[30px] px-6 py-16 text-center"><Leaf className="mx-auto mb-4 text-secondary" size={40} /><h2 className="display text-xl font-bold">لا توجد دروس بهذا الاختيار</h2><p className="mt-2 text-sm text-muted-foreground">جرّب تغيير الفلاتر أو ابحث بكلمة مختلفة.</p></div>}</div>;
}

function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>(); const id = Number(lessonId); const [, setLocation] = useLocation(); const lesson = useGetLesson(id, { query: { enabled: !!id, queryKey: getGetLessonQueryKey(id) } }); const comment = useCreateComment(); const [body, setBody] = useState('');
  if (lesson.isLoading) return <PageLoader />; if (!lesson.data) return <EmptyState title="لم نعثر على هذا الدرس" />;
  const data = lesson.data;
  const submitComment = (e: FormEvent) => { e.preventDefault(); if (body.trim().length > 1) comment.mutate({ lessonId: id, data: { body } }, { onSuccess: () => setBody('') }); };
  return <div className="main-pad mx-auto max-w-[1120px] px-5 py-10 md:py-14"><button onClick={() => setLocation('/lessons')} data-testid="button-back-lessons" className="mb-8 flex items-center gap-2 text-sm font-semibold text-muted-foreground"><ChevronRight size={17} />العودة إلى الدروس</button><div className="animate-appear rounded-[30px] bg-primary p-7 text-primary-foreground md:p-12"><div className="flex flex-wrap gap-2 text-xs text-secondary"><span>{gradeLabel(data.grade)}</span><span className="opacity-40">/</span><span>{termLabel(data.term)}</span></div><h1 className="display mt-5 max-w-3xl text-3xl font-bold leading-[1.45] md:text-5xl">{data.title}</h1><p className="mt-5 max-w-2xl leading-8 text-primary-foreground/75">{data.description}</p><div className="mt-8 flex flex-wrap items-center gap-3"><Link href={`/lessons/${id}/quiz`} data-testid="button-start-quiz" className="flex items-center gap-2 rounded-full bg-secondary px-5 py-3 font-bold text-secondary-foreground"><Play size={17} fill="currentColor" />ابدأ الاختبار</Link><span className="rounded-full border border-primary-foreground/20 px-4 py-2 text-sm text-primary-foreground/70">{data.questionCount} أسئلة · {data.duration}</span></div></div><div className="mt-8 grid gap-8 md:grid-cols-[1.25fr_.75fr]"><article className="glass rounded-[26px] p-6 md:p-8"><div className="mb-6 flex items-center gap-3 text-primary"><BookOpen size={20} /><h2 className="display text-xl font-bold">عن هذا الدرس</h2></div><p className="leading-9 text-muted-foreground">{data.description}</p>{data.content && <div className="mt-7 border-t border-border pt-7"><h3 className="display mb-3 font-bold">محتوى الدرس</h3><p className="whitespace-pre-line leading-9 text-muted-foreground">{data.content}</p></div>}<div className="mt-8 grid gap-3 sm:grid-cols-2">{['فهم المفاهيم الأساسية','ربط العلم بالحياة','تثبيت المعرفة بالأسئلة','مراجعة ذاتية مرنة'].map((t,i) => <div key={t} className="flex items-center gap-3 rounded-2xl bg-muted/60 p-4 text-sm"><span className="grid h-7 w-7 place-items-center rounded-full bg-secondary text-primary">{i+1}</span>{t}</div>)}</div></article><aside className="rounded-[26px] border border-secondary/50 bg-secondary/20 p-6"><Target className="mb-4 text-primary" size={25} /><h2 className="display text-xl font-bold">جاهز للتحدي؟</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">اختبر فهمك في دقائق واحصل على نتيجة تساعدك على معرفة خطوتك القادمة.</p><Link href={`/lessons/${id}/quiz`} data-testid="aside-start-quiz" className="mt-6 flex items-center justify-between rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground">اذهب إلى الاختبار <ArrowLeft size={17} /></Link></aside></div><section className="mt-10"><SectionHeading eyebrow="مساحة السؤال" title="ما الذي يدور في ذهنك؟" /><form onSubmit={submitComment} className="glass rounded-[26px] p-5"><textarea data-testid="textarea-comment" aria-label="اكتب سؤالك" value={body} onChange={e => setBody(e.target.value)} placeholder="اكتب سؤالاً أو فكرة تريد مناقشتها..." className="min-h-28 w-full resize-none bg-transparent p-2 text-sm leading-7 outline-none" /><div className="mt-3 flex justify-end"><button data-testid="button-submit-comment" disabled={comment.isPending || body.trim().length < 2} className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-40"><Send size={15} />{comment.isPending ? 'جاري الإرسال...' : 'أرسل السؤال'}</button></div></form><div className="mt-5 grid gap-3">{data.comments.length ? data.comments.map(c => <div data-testid={`comment-${c.id}`} key={c.id} className="rounded-2xl border border-border bg-card p-5"><div className="flex justify-between gap-3"><strong className="text-sm">{c.authorName}</strong><span className="text-xs text-muted-foreground">{rtlDate(c.createdAt)}</span></div><p className="mt-3 text-sm leading-7 text-muted-foreground">{c.body}</p>{c.answer && <div className="mt-4 rounded-xl bg-secondary/20 p-3 text-sm leading-7"><strong>إجابة روعة الحياة:</strong> {c.answer}</div>}</div>) : <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">كن أول من يطرح سؤالاً في هذا الدرس.</div>}</div></section></div>;
}

function QuizPage() {
  const { lessonId } = useParams<{ lessonId: string }>(); const id = Number(lessonId); const [, setLocation] = useLocation(); const lesson = useGetLesson(id, { query: { enabled: !!id, queryKey: getGetLessonQueryKey(id) } }); const submit = useSubmitQuizAttempt(); const [index, setIndex] = useState(0); const [answers, setAnswers] = useState<Record<number,string>>({}); const [selected, setSelected] = useState<string | null>(null); const [done, setDone] = useState(false); const [celebrate, setCelebrate] = useState(false); const [message, setMessage] = useState('');
  if (lesson.isLoading) return <PageLoader />; if (!lesson.data) return <EmptyState title="الاختبار غير متاح" />; const questions = lesson.data.questions ?? []; const q = questions[index];
  const choose = (option: string) => { if (selected) return; setSelected(option); setAnswers(a => ({ ...a, [q.id]: option })); if (option === q.correctOptionId) { const phrases = ['رائع! فهمك للمفهوم واضح.', 'أحسنت! استمري بهذا التركيز.', 'إجابة موفقة! أنتِ تتقدمين بثبات.', 'ممتاز! الفضول العلمي يصنع الفرق.']; setMessage(phrases[Math.floor(Math.random() * phrases.length)] ?? phrases[0]); setCelebrate(true); window.setTimeout(() => setCelebrate(false), 1200); } else setMessage('راجعي التوضيح أسفل السؤال ثم جرّبي تطبيق الفكرة من جديد.'); };
  const next = () => { if (index < questions.length - 1) { setIndex(i => i + 1); setSelected(answers[questions[index + 1]?.id] ?? null); setMessage(''); } else { const score = questions.reduce((sum, item) => sum + (answers[item.id] === item.correctOptionId ? 1 : 0), 0); submit.mutate({ data: { lessonId: id, score, total: questions.length } }); setDone(true); } };
  const share = async (text: string) => { try { if (navigator.share) await navigator.share({ title: 'روعة الحياة | علوم الأحياء', text, url: window.location.origin }); else { await navigator.clipboard.writeText(text); window.alert('تم نسخ النص للمشاركة.'); } } catch { /* مشاركة أُغلقت من المستخدم */ } };
  if (done) { const score = questions.reduce((sum, item) => sum + (answers[item.id] === item.correctOptionId ? 1 : 0), 0); return <div className="main-pad mx-auto max-w-2xl px-5 py-16 text-center"><div className="animate-pop mx-auto grid h-28 w-28 place-items-center rounded-full bg-secondary text-primary"><Trophy size={48} /></div><p className="mt-8 text-sm font-bold text-accent">أحسنت، انتهى التحدي</p><h1 className="display mt-2 text-4xl font-bold">نتيجتك {score} من {questions.length}</h1><p className="mt-4 leading-8 text-muted-foreground">المحاولة هي بداية التقدم. راجع إجاباتك وواصل اكتشافك.</p><div className="mt-7 grid gap-3 sm:grid-cols-2"><button onClick={() => share(`حصلت على ${score}/${questions.length} في درس ${lesson.data.title} من منصة روعة الحياة | علوم الأحياء`)} data-testid="button-share-result" className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">مشاركة النتيجة</button><button onClick={() => share('اكتشفي منصة روعة الحياة لمراجعة واختبارات علوم الأحياء: ' + window.location.origin)} data-testid="button-share-site" className="rounded-full border border-border px-5 py-3 text-sm font-bold">مشاركة المنصة</button></div><div className="mt-4 flex justify-center gap-3"><Link href={`/lessons/${id}`} data-testid="quiz-link-review" className="rounded-full border border-border px-5 py-3 text-sm font-bold">مراجعة الدرس</Link><button onClick={() => { setIndex(0); setAnswers({}); setSelected(null); setMessage(''); setDone(false); }} data-testid="button-retry-quiz" className="rounded-full bg-secondary px-5 py-3 text-sm font-bold text-secondary-foreground">أعد الاختبار</button></div></div> }
  if (!q) return <EmptyState title="لا توجد أسئلة بعد" />;
  return <div className="main-pad relative mx-auto max-w-3xl px-5 py-12 md:py-16"><ConfettiBurst active={celebrate} /><button onClick={() => setLocation(`/lessons/${id}`)} data-testid="button-quit-quiz" className="mb-8 flex items-center gap-2 text-sm text-muted-foreground"><X size={17} />الخروج من الاختبار</button><div className="mb-8 flex items-center justify-between"><div><p className="text-xs font-bold tracking-[.14em] text-accent">اختبار سريع</p><h1 className="display mt-2 text-2xl font-bold">{lesson.data.title}</h1></div><span className="rounded-full bg-secondary/35 px-4 py-2 text-sm font-bold text-primary">{index + 1} / {questions.length}</span></div><div className="mb-7 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-accent transition-all" style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div><div className="glass rounded-[30px] p-6 md:p-10"><p className="display text-xl font-bold leading-[1.8] md:text-2xl">{q.prompt}</p><div className="mt-8 grid gap-3">{q.options.map((option, i) => { const correct = selected && option.id === q.correctOptionId; const wrong = selected === option.id && option.id !== q.correctOptionId; return <button key={option.id} onClick={() => choose(option.id)} data-testid={`quiz-option-${option.id}`} className={`flex items-center gap-4 rounded-2xl border p-4 text-right transition ${correct ? 'border-primary bg-primary/10' : wrong ? 'border-destructive bg-destructive/10' : 'border-border hover:border-primary/50 hover:bg-muted/60'}`}><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-bold ${correct ? 'bg-primary text-primary-foreground' : wrong ? 'bg-destructive text-destructive-foreground' : 'bg-muted text-primary'}`}>{String.fromCharCode(65 + i)}</span><span className="text-sm leading-7">{option.text}</span>{correct && <Check className="mr-auto text-primary" size={19} />}</button> })}</div>{selected && <div className={`animate-appear mt-6 rounded-2xl p-4 text-sm leading-7 ${selected === q.correctOptionId ? 'bg-secondary/30' : 'bg-accent/10'}`}><strong>{selected === q.correctOptionId ? message : 'ليست الإجابة الأدق.'}</strong>{selected !== q.correctOptionId && <> {message} {q.explanation}</>}</div>}<button onClick={next} disabled={!selected || submit.isPending} data-testid="button-next-question" className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-bold text-primary-foreground disabled:opacity-40">{index === questions.length - 1 ? 'عرض النتيجة' : 'السؤال التالي'}<ChevronLeft size={17} /></button></div></div>;
}

function ConfettiBurst({ active }: { active: boolean }) {
  if (!active) return null;
  return <div className="confetti-layer" aria-hidden="true">{Array.from({ length: 26 }, (_, index) => <span key={index} style={{ left: `${(index * 37) % 100}%`, animationDelay: `${(index % 7) * 45}ms`, background: ['#f2bd63', '#e9795e', '#2f7667', '#a8c5a0'][index % 4] }} />)}</div>;
}

function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const [, setLocation] = useLocation(); const login = useLogin(); const register = useRegister(); const [form, setForm] = useState({ name: '', email: '', password: '', age: '' }); const isRegister = mode === 'register'; const [error, setError] = useState('');
  const submit = (e: FormEvent) => { e.preventDefault(); setError(''); const onSuccess = () => setLocation('/'); if (isRegister) register.mutate({ data: { name: form.name, email: form.email, password: form.password, age: form.age ? Number(form.age) : null } }, { onSuccess, onError: () => setError('تعذر إنشاء الحساب. تحقق من البيانات وحاول مرة أخرى.') }); else login.mutate({ data: { email: form.email, password: form.password } }, { onSuccess, onError: () => setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.') }); };
  return <div className="app-shell min-h-[100dvh]" dir="rtl"><div className="mx-auto grid min-h-[100dvh] max-w-[1340px] items-center gap-10 px-5 py-10 md:grid-cols-2 md:px-12"><div className="hidden rounded-[34px] bg-primary p-10 text-primary-foreground md:block"><Logo /><div className="relative mt-24"><CellMotif /><p className="text-sm text-secondary">روعة الحياة · علوم الأحياء</p><h1 className="display mt-4 text-5xl font-bold leading-[1.5]">المعرفة تنبت<br />حين نمنحها<br /><span className="text-secondary">وقتاً وفضولاً.</span></h1><p className="mt-6 max-w-sm leading-8 text-primary-foreground/70">مساحة هادئة وملهمة لتفهم الأحياء بطريقتك.</p></div></div><div className="mx-auto w-full max-w-md"><div className="mb-8 flex items-center justify-between"><Logo compact /><Link href="/" data-testid="auth-link-home" className="text-sm text-muted-foreground">العودة للبداية</Link></div><div className="glass rounded-[30px] p-6 md:p-9"><p className="mb-2 text-xs font-bold tracking-[.15em] text-accent">{isRegister ? 'خطوة أولى' : 'مرحباً بعودتك'}</p><h1 className="display text-3xl font-bold">{isRegister ? 'أنشئ مساحتك' : 'سجّل دخولك'}</h1><p className="mt-3 text-sm leading-7 text-muted-foreground">{isRegister ? 'احفظ تقدمك واجعل كل جلسة تعلم تخصك.' : 'أكمل من حيث توقفت، فكل دقيقة تصنع فرقاً.'}</p><form onSubmit={submit} className="mt-8 grid gap-4">{isRegister && <Field label="الاسم الكامل" test="input-name" value={form.name} onChange={v => setForm({...form,name:v})} placeholder="مثال: سارة العتيبي" /> }<Field label="البريد الإلكتروني" test="input-email" type="email" value={form.email} onChange={v => setForm({...form,email:v})} placeholder="you@example.com" /><Field label="كلمة المرور" test="input-password" type="password" value={form.password} onChange={v => setForm({...form,password:v})} placeholder="ستة أحرف على الأقل" />{isRegister && <Field label="العمر (اختياري)" test="input-age" type="number" value={form.age} onChange={v => setForm({...form,age:v})} placeholder="16" />}{error && <p data-testid="status-auth-error" className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}<button data-testid="button-auth-submit" disabled={login.isPending || register.isPending} className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 font-bold text-primary-foreground disabled:opacity-50">{isRegister ? 'إنشاء الحساب' : 'دخول'}<ArrowLeft size={17} /></button></form><p className="mt-6 text-center text-sm text-muted-foreground">{isRegister ? 'لديك حساب؟ ' : 'ليس لديك حساب؟ '}<Link data-testid="auth-link-switch" href={isRegister ? '/login' : '/register'} className="font-bold text-primary">{isRegister ? 'سجّل الدخول' : 'أنشئ حساباً'}</Link></p></div></div></div></div>;
}

function Field({ label, test, value, onChange, placeholder, type = 'text' }: { label: string; test: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string }) {
  return <label className="grid gap-2 text-sm font-semibold"><span>{label}</span><input data-testid={test} aria-label={label} autoComplete={type === 'email' ? 'email' : type === 'password' ? 'current-password' : label.includes('الاسم') ? 'name' : undefined} required={label !== 'العمر (اختياري)'} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="h-12 rounded-xl border border-input bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" /></label>;
}

function ProfilePage({ user }: { user: any }) {
  const profile = useGetProfile({ query: { enabled: !!user, queryKey: getGetProfileQueryKey() } }); const data = profile.data; if (profile.isLoading) return <PageLoader />;
  return <div className="main-pad mx-auto max-w-[1100px] px-5 py-12"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-2 text-xs font-bold tracking-[.15em] text-accent">مساحتي</p><h1 className="display text-4xl font-bold">أهلاً، {data?.user.name || user?.name}</h1><p className="mt-3 text-muted-foreground">هذه آثار رحلتك العلمية حتى الآن.</p></div><div className="grid h-20 w-20 place-items-center rounded-[26px] bg-secondary text-3xl font-bold text-primary">{(data?.user.name || user?.name || 'م').charAt(0)}</div></div><div className="mt-10 grid gap-4 sm:grid-cols-3"><Stat icon={<BookOpen size={20} />} value={data?.completedLessons ?? 0} label="دروس مكتملة" /><Stat icon={<Trophy size={20} />} value={data?.attempts?.length ?? 0} label="محاولات اختبار" /><Stat icon={<Zap size={20} />} value={data?.attempts?.length ? `${Math.round(data.attempts.reduce((a,b) => a + b.percentage, 0) / data.attempts.length)}%` : '—'} label="متوسط النتائج" /></div><section className="mt-12"><SectionHeading eyebrow="السجل" title="محاولاتك الأخيرة" />{data?.attempts?.length ? <div className="grid gap-3">{data.attempts.map(a => <div key={a.id} data-testid={`attempt-${a.id}`} className="flex items-center justify-between rounded-2xl border border-border bg-card p-5"><div><h3 className="font-bold">{a.lessonTitle}</h3><p className="mt-1 text-xs text-muted-foreground">{rtlDate(a.createdAt)}</p></div><span className="rounded-full bg-secondary/35 px-4 py-2 text-sm font-bold text-primary">{a.score}/{a.total} · {a.percentage}%</span></div>)}</div> : <div className="glass rounded-3xl p-12 text-center"><Award className="mx-auto mb-4 text-secondary" size={38} /><p className="font-bold">لم تبدأ أي اختبار بعد</p><Link href="/lessons" data-testid="profile-link-lessons" className="mt-5 inline-block rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">اكتشف الدروس</Link></div>}</section></div>;
}
function Stat({ icon, value, label }: { icon: ReactNode; value: ReactNode; label: string }) { return <div className="rounded-[22px] border border-border bg-card p-5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary/35 text-primary">{icon}</span><p className="mt-4 text-2xl font-bold">{value}</p><p className="mt-1 text-sm text-muted-foreground">{label}</p></div>; }

function ContactPage() {
  const createMessage = useCreateContactMessage();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', body: '' });
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSent(false);
    createMessage.mutate({ data: { name: form.name, email: form.email, message: form.body } }, {
      onSuccess: () => {
        setForm({ name: '', email: '', body: '' });
        setSent(true);
      },
    });
  };
  return <div className="main-pad mx-auto grid max-w-[1000px] gap-10 px-5 py-14 md:grid-cols-[.8fr_1.2fr] md:py-20"><div><p className="mb-2 text-xs font-bold tracking-[.15em] text-accent">نحن قريبون</p><h1 className="display text-4xl font-bold leading-[1.4]">لديك سؤال؟<br /><span className="text-primary">نسمعك.</span></h1><p className="mt-5 leading-8 text-muted-foreground">شاركنا استفسارك أو اقتراحك، وسيصل مباشرة إلى لوحة إدارة روعة الحياة.</p><div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground"><span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary/35 text-primary"><Mail size={18} /></span>يتم حفظ الرسالة مباشرة في قائمة الرسائل الواردة</div></div><div className="glass rounded-[30px] p-6 md:p-9">{sent ? <div className="py-16 text-center"><Check className="mx-auto mb-5 rounded-full bg-secondary p-3 text-primary" size={54} /><h2 className="display text-2xl font-bold">تم حفظ رسالتك</h2><p className="mt-3 text-sm text-muted-foreground">شكراً لتواصلك، سيطلع فريق الإدارة على رسالتك قريباً.</p><button onClick={() => setSent(false)} data-testid="button-send-another" className="mt-7 rounded-full border border-border px-5 py-2.5 text-sm font-bold">إرسال رسالة أخرى</button></div> : <form onSubmit={submit} className="grid gap-4"><Field label="الاسم" test="contact-name" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="اسمك الكريم" /><Field label="البريد الإلكتروني" test="contact-email" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="you@example.com" /><label className="grid gap-2 text-sm font-semibold"><span>رسالتك</span><textarea data-testid="contact-message" required value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} className="min-h-32 resize-none rounded-xl border border-input bg-background p-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" placeholder="كيف يمكننا مساعدتك؟" /></label>{createMessage.isError && <p data-testid="contact-error" className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">تعذر حفظ الرسالة حالياً، حاولي مرة أخرى.</p>}<button disabled={createMessage.isPending} data-testid="button-send-contact" className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 font-bold text-primary-foreground disabled:opacity-50">{createMessage.isPending ? 'جاري الحفظ...' : 'إرسال الرسالة'} <Send size={16} /></button></form>}</div></div>;
}

type AdminSection = 'dashboard' | 'lessons' | 'questions' | 'comments' | 'encouragements' | 'users' | 'units' | 'messages';

function AdminPage() {
  const summary = useGetAdminSummary();
  const users = useListUsers();
  const comments = useListAdminComments();
  const qc = useQueryClient();
  const [section, setSection] = useState<AdminSection>('dashboard');
  const messages = useListContactMessages({ query: { enabled: section === 'messages', queryKey: getListContactMessagesQueryKey() } });
  const refresh = () => {
    qc.invalidateQueries({ queryKey: getGetAdminSummaryQueryKey() });
    qc.invalidateQueries({ queryKey: getListUsersQueryKey() });
    qc.invalidateQueries({ queryKey: getListAdminCommentsQueryKey() });
    qc.invalidateQueries({ queryKey: getListContactMessagesQueryKey() });
    qc.invalidateQueries({ queryKey: getListEncouragementsQueryKey() });
    qc.invalidateQueries({ queryKey: getListLessonsQueryKey() });
  };
  const menu = [
    { id: 'units' as const, label: 'الوحدات', icon: LayoutDashboard },
    { id: 'lessons' as const, label: 'الدروس', icon: BookOpen },
    { id: 'questions' as const, label: 'الأسئلة', icon: CircleHelp },
    { id: 'comments' as const, label: 'التعليقات', icon: MessageCircle },
    { id: 'encouragements' as const, label: 'عبارات التشجيع', icon: Sparkles },
    { id: 'users' as const, label: 'الطلاب', icon: Users },
    { id: 'messages' as const, label: 'الرسائل', icon: Mail },
  ];
  const metrics: Array<{ label: string; value: string | number; Icon: typeof Users }> = [
    { label: 'المتعلمون', value: summary.data?.users ?? '—', Icon: Users },
    { label: 'الزوار', value: summary.data?.visitors ?? '—', Icon: UserRound },
    { label: 'الدروس', value: summary.data?.lessons ?? '—', Icon: BookOpen },
    { label: 'المحاولات', value: summary.data?.attempts ?? '—', Icon: Trophy },
    { label: 'الرسائل', value: summary.data?.messages ?? '—', Icon: Mail },
    { label: 'أسئلة بلا إجابة', value: summary.data?.unansweredComments ?? '—', Icon: MessageCircle },
  ];
  const usersList = (users.data ?? summary.data?.latestVisitors ?? []) as any[];
  return <div className="admin-dashboard min-h-[100dvh] bg-[#eee9ff]/45 px-3 py-5 md:px-8 md:py-8">
    <div className="mx-auto max-w-[1220px]">
      <div className="px-1 py-8 md:px-5 md:py-12">
        <div className="text-center"><span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-[#ded4ff] text-[#4d397f]"><ShieldCheck size={24} /></span><p className="text-xs font-bold tracking-[.18em] text-[#7869a5]">مساحة الإدارة</p><h1 className="display mt-2 text-3xl font-bold text-[#30254f] md:text-5xl">لوحة التحكم</h1><p className="mt-3 text-sm text-[#736b85]">أديري محتوى روعة الحياة وتابعي رحلة الطلاب من مكان واحد.</p></div>
        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-3">
          {menu.map(item => { const Icon = item.icon; return <button key={item.id} onClick={() => setSection(item.id)} data-testid={`admin-tab-${item.id}`} className={`flex min-h-16 items-center justify-center gap-2 rounded-2xl border px-3 text-sm font-bold transition hover:-translate-y-0.5 hover:shadow-md ${section === item.id ? 'border-[#4d397f] bg-[#4d397f] text-white shadow-lg shadow-[#4d397f]/20' : 'border-[#d9ceff] bg-[#e8e1ff] text-[#4d397f]'}`}><Icon size={17} />{item.label}</button>; })}
        </div>
        {section === 'dashboard' && <div className="mt-8 space-y-6">
           <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">{metrics.map(({ label, value, Icon }) => <div key={label} className="rounded-2xl border border-[#ddd5f4] bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-xs text-[#81798e]"><span>{label}</span><Icon size={17} className="text-[#4d397f]" /></div><p className="mt-4 text-3xl font-bold text-[#30254f]">{value}</p></div>)}</div>
          <AdminUsersPanel users={usersList} onRefresh={refresh} />
          <AdminEncouragementPanel onRefresh={refresh} />
          <AdminCommentsPanel comments={(comments.data ?? []) as any[]} onRefresh={refresh} />
        </div>}
        {section === 'lessons' && <AdminContentTools mode="lessons" />}
        {section === 'questions' && <AdminContentTools mode="questions" />}
        {section === 'users' && <AdminUsersPanel users={usersList} onRefresh={refresh} />}
        {section === 'comments' && <AdminCommentsPanel comments={(comments.data ?? []) as any[]} onRefresh={refresh} />}
        {section === 'encouragements' && <AdminEncouragementPanel onRefresh={refresh} />}
        {section === 'units' && <div className="mt-8 rounded-3xl border border-[#d9ceff] bg-white p-8 text-center shadow-sm"><LayoutDashboard className="mx-auto mb-4 text-[#4d397f]" size={34} /><h2 className="display text-2xl font-bold text-[#30254f]">الوحدات مرتبطة بالدروس</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#736b85]">اختاري الدروس من القائمة، ثم حددي الوحدة من نموذج الإضافة أو التعديل. ستظهر الوحدة للطلاب ضمن بطاقة الدرس.</p><button onClick={() => setSection('lessons')} className="mt-6 rounded-full bg-[#4d397f] px-5 py-3 text-sm font-bold text-white">إدارة الدروس</button></div>}
         {section === 'messages' && <AdminMessagesPanel messages={(messages.data ?? []) as ContactMessage[]} loading={messages.isLoading} onRefresh={refresh} />}
      </div>
    </div>
  </div>;
}

function AdminUsersPanel({ users, onRefresh }: { users: any[]; onRefresh: () => void }) {
  return <section className="rounded-3xl border border-[#d9ceff] bg-white p-5 shadow-sm md:p-6"><div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-bold tracking-[.14em] text-[#7869a5]">النشاط الأخير</p><h2 className="display mt-1 text-xl font-bold text-[#30254f]">الطلاب والزيارات</h2></div><button onClick={onRefresh} data-testid="button-refresh-admin" className="grid h-10 w-10 place-items-center rounded-xl bg-[#eee9ff] text-[#4d397f] transition hover:bg-[#ded4ff]"><RefreshCw size={16} /></button></div>{users.length ? <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-right text-sm"><thead className="border-b border-[#e7e1f4] text-xs text-[#81798e]"><tr><th className="pb-3">الطالب</th><th className="pb-3">الزيارات</th><th className="pb-3">الاختبارات</th><th className="pb-3">آخر زيارة</th></tr></thead><tbody>{users.slice(0, 8).map(u => <tr key={u.id} data-testid={`admin-user-${u.id}`} className="border-b border-[#eeeaf6]"><td className="py-4"><strong className="text-[#30254f]">{u.name}</strong><span className="block text-xs text-[#81798e]">{u.email}</span></td><td>{u.visits}</td><td>{u.attempts}</td><td className="text-xs text-[#81798e]">{rtlDate(u.lastVisitedAt)}</td></tr>)}</tbody></table></div> : <p className="py-8 text-center text-sm text-[#81798e]">لا يوجد نشاط بعد.</p>}</section>;
}

function AdminMessagesPanel({ messages, loading, onRefresh }: { messages: ContactMessage[]; loading: boolean; onRefresh: () => void }) {
  const remove = useDeleteContactMessage();
  const [openId, setOpenId] = useState<number | null>(null);
  return <section className="mt-8 rounded-3xl border border-[#d9ceff] bg-white p-5 shadow-sm md:p-7"><div className="mb-5 flex items-start justify-between gap-3"><div><p className="text-xs font-bold tracking-[.14em] text-[#7869a5]">صندوق الوارد</p><h2 className="display mt-1 text-2xl font-bold text-[#30254f]">الرسائل الواردة</h2><p className="mt-2 text-sm text-[#81798e]">رسائل صفحة التواصل محفوظة هنا مباشرة.</p></div><button type="button" onClick={onRefresh} data-testid="button-refresh-messages" className="grid h-10 w-10 place-items-center rounded-xl bg-[#eee9ff] text-[#4d397f]"><RefreshCw size={16} /></button></div>{loading ? <div className="flex items-center justify-center gap-2 py-12 text-sm text-[#81798e]"><Spinner />جاري تحميل الرسائل...</div> : messages.length ? <div className="overflow-x-auto rounded-2xl border border-[#eeeaf6]"><table className="w-full min-w-[760px] text-right text-sm"><thead className="bg-[#f5f2fb] text-xs text-[#81798e]"><tr><th className="px-4 py-3">المرسل</th><th className="px-4 py-3">البريد</th><th className="px-4 py-3">التاريخ</th><th className="px-4 py-3">الإجراء</th></tr></thead><tbody>{messages.map(message => <Fragment key={message.id}><tr className="border-t border-[#eeeaf6]"><td className="px-4 py-4 font-bold text-[#30254f]">{message.name}</td><td className="px-4 py-4 text-[#736b85]">{message.email}</td><td className="px-4 py-4 text-xs text-[#81798e]">{rtlDate(message.createdAt)}</td><td className="px-4 py-4"><div className="flex gap-2"><button type="button" onClick={() => setOpenId(openId === message.id ? null : message.id)} data-testid={`button-view-message-${message.id}`} className="rounded-xl bg-[#eee9ff] px-3 py-2 text-xs font-bold text-[#4d397f]">{openId === message.id ? 'إخفاء' : 'عرض الرسالة'}</button><button type="button" disabled={remove.isPending} onClick={() => { if (window.confirm('حذف هذه الرسالة؟')) remove.mutate({ messageId: message.id }, { onSuccess: onRefresh }); }} data-testid={`button-delete-message-${message.id}`} className="rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-600 disabled:opacity-50">حذف</button></div></td></tr>{openId === message.id && <tr className="border-t border-[#eeeaf6] bg-[#fbfaff]"><td colSpan={4} className="px-4 py-5"><p className="whitespace-pre-wrap text-sm leading-8 text-[#514b61]">{message.message}</p></td></tr>}</Fragment>)}</tbody></table></div> : <div className="rounded-2xl border border-dashed border-[#cfc3f1] p-12 text-center text-sm text-[#81798e]"><Mail className="mx-auto mb-3 text-[#4d397f]" size={28} />لا توجد رسائل واردة بعد.</div>}</section>;
}

function AdminEncouragementPanel({ onRefresh }: { onRefresh: () => void }) {
  const encouragements = useListEncouragements();
  const create = useCreateEncouragement();
  const [text, setText] = useState('');
  return <section className="rounded-3xl border border-[#d9ceff] bg-[#e8e1ff] p-5 shadow-sm md:p-6"><p className="text-xs font-bold tracking-[.14em] text-[#7869a5]">نبرة المنصة</p><h2 className="display mt-1 text-xl font-bold text-[#30254f]">عبارات التشجيع</h2><div className="my-5 grid gap-2 md:grid-cols-3">{(encouragements.data ?? []).map(item => <div key={item.id} className="rounded-xl bg-white/80 p-3 text-sm text-[#4d397f]">{item.text}</div>)}</div><form onSubmit={e => { e.preventDefault(); if (text.trim()) create.mutate({ data: { text } }, { onSuccess: () => { setText(''); onRefresh(); } }); }} className="flex gap-2"><input data-testid="input-encouragement" value={text} onChange={e => setText(e.target.value)} placeholder="أضيفي عبارة مشجعة..." className="h-11 min-w-0 flex-1 rounded-xl border border-[#d9ceff] bg-white px-3 text-sm outline-none focus:border-[#4d397f]" /><button data-testid="button-add-encouragement" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#4d397f] text-white"><Plus size={18} /></button></form></section>;
}

function AdminCommentsPanel({ comments, onRefresh }: { comments: any[]; onRefresh: () => void }) {
  const answer = useAnswerComment();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const pending = comments.filter(comment => !comment.answer);
  return <section className="rounded-3xl border border-[#d9ceff] bg-white p-5 shadow-sm md:p-6"><p className="text-xs font-bold tracking-[.14em] text-[#7869a5]">الإشراف</p><h2 className="display mt-1 text-xl font-bold text-[#30254f]">تعليقات تنتظر الرد</h2>{pending.length ? <div className="mt-5 grid gap-3 md:grid-cols-2">{pending.map(comment => <div key={comment.id} data-testid={`admin-comment-${comment.id}`} className="rounded-2xl bg-[#f5f2fb] p-4"><div className="flex justify-between gap-3 text-xs"><strong className="text-[#30254f]">{comment.authorName}</strong><span className="text-[#81798e]">{comment.lessonTitle}</span></div><p className="mt-3 text-sm leading-7 text-[#514b61]">{comment.body}</p><div className="mt-4 flex gap-2"><input value={answers[comment.id] ?? ''} onChange={e => setAnswers({ ...answers, [comment.id]: e.target.value })} data-testid={`input-answer-${comment.id}`} placeholder="اكتبي رداً..." className="min-w-0 flex-1 rounded-xl border border-[#ded7f3] bg-white px-3 text-sm outline-none" /><button onClick={() => { if (answers[comment.id]?.trim()) answer.mutate({ commentId: comment.id, data: { answer: answers[comment.id] } }, { onSuccess: onRefresh }); }} data-testid={`button-answer-${comment.id}`} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#4d397f] text-white"><Send size={15} /></button></div></div>)}</div> : <div className="mt-5 rounded-2xl bg-[#e8e1ff] p-8 text-center text-sm text-[#736b85]"><Check className="mx-auto mb-2 text-[#4d397f]" size={22} />كل التعليقات حظيت بعناية.</div>}</section>;
}

type LessonDraft = { title: string; description: string; content: string; grade: 'first' | 'second'; term: 'first' | 'second'; unit: string; duration: string; sortOrder: number };
type QuestionDraft = { prompt: string; a: string; b: string; c: string; d: string; correct: 'a' | 'b' | 'c' | 'd'; explanation: string };

const emptyLessonDraft: LessonDraft = { title: '', description: '', content: '', grade: 'first', term: 'first', unit: '', duration: '20 دقيقة', sortOrder: 1 };
const emptyQuestionDraft: QuestionDraft = { prompt: '', a: '', b: '', c: '', d: '', correct: 'a', explanation: '' };
const questionDraftStorageKey = 'rawat-admin-question-draft';

function getMutationErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  return 'حدث خطأ غير متوقع. تحققي من الاتصال وحاولي مرة أخرى.';
}

function isApiUnavailable(error: unknown) {
  if (error instanceof TypeError) return true;
  if (!error || typeof error !== 'object') return false;
  const status = (error as { status?: unknown }).status;
  return status === 404;
}

function AdminContentTools({ mode }: { mode: 'lessons' | 'questions' }) {
  const lessons = useListLessons();
  const createLesson = useCreateLesson();
  const updateLesson = useUpdateLesson();
  const deleteLesson = useDeleteLesson();
  const createQuestion = useCreateQuestion();
  const updateQuestion = useUpdateQuestion();
  const deleteQuestion = useDeleteQuestion();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [lessonDraft, setLessonDraft] = useState<LessonDraft>(emptyLessonDraft);
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const [numberLessons, setNumberLessons] = useState(false);
  const [questionDraft, setQuestionDraft] = useState<QuestionDraft>(emptyQuestionDraft);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [questionSearch, setQuestionSearch] = useState('');
  const [questionSearchQuery, setQuestionSearchQuery] = useState('');
  const [draftStatus, setDraftStatus] = useState('');
  const [localQuestions, setLocalQuestions] = useState<AdminQuestion[]>([]);
  const adminQuestions = useListAdminQuestions(
    { search: questionSearchQuery.trim() || undefined },
    { query: { enabled: mode === 'questions', queryKey: getListAdminQuestionsQueryKey({ search: questionSearchQuery.trim() || undefined }) } },
  );
  const lessonList = lessons.data ?? [];
  const orderedLessonList = [...lessonList].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
  const visibleLocalQuestions = localQuestions.filter(question => !questionSearchQuery.trim() || question.lessonTitle.toLocaleLowerCase().includes(questionSearchQuery.trim().toLocaleLowerCase()));
  const displayedQuestions = [...visibleLocalQuestions, ...(adminQuestions.data ?? [])];
  const resetLesson = () => { setLessonDraft(emptyLessonDraft); setEditingLessonId(null); };
  const resetQuestion = (clearSavedDraft = false) => {
    setQuestionDraft(emptyQuestionDraft);
    setEditingQuestionId(null);
    if (clearSavedDraft) {
      localStorage.removeItem(questionDraftStorageKey);
      setDraftStatus('');
    }
  };
  const refreshLessons = () => qc.invalidateQueries({ queryKey: getListLessonsQueryKey() });
  useEffect(() => {
    const timer = window.setTimeout(() => setQuestionSearchQuery(questionSearch), 250);
    return () => window.clearTimeout(timer);
  }, [questionSearch]);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(questionDraftStorageKey);
      if (!saved) return;
      const parsed = JSON.parse(saved) as {
        lessonId?: number | null;
        editingQuestionId?: number | null;
        draft?: Partial<QuestionDraft>;
      };
      if (!parsed.draft) return;
      setQuestionDraft({ ...emptyQuestionDraft, ...parsed.draft });
      setActiveLessonId(parsed.lessonId ?? null);
      setEditingQuestionId(parsed.editingQuestionId ?? null);
      setDraftStatus('تم استرجاع المسودة المحلية');
    } catch {
      localStorage.removeItem(questionDraftStorageKey);
    }
  }, []);
  useEffect(() => {
    try {
      const saved = localStorage.getItem('rawat-admin-local-questions');
      if (saved) setLocalQuestions(JSON.parse(saved) as AdminQuestion[]);
    } catch {
      localStorage.removeItem('rawat-admin-local-questions');
    }
  }, []);
  useEffect(() => {
    const hasDraft = Boolean(
      questionDraft.prompt.trim() ||
      questionDraft.a.trim() ||
      questionDraft.b.trim() ||
      questionDraft.c.trim() ||
      questionDraft.d.trim() ||
      questionDraft.explanation.trim(),
    );
    if (!hasDraft) return;
    setDraftStatus('سيتم حفظ المسودة تلقائياً');
    const timer = window.setTimeout(() => {
      try {
        localStorage.setItem(questionDraftStorageKey, JSON.stringify({
          lessonId: activeLessonId,
          editingQuestionId,
          draft: questionDraft,
        }));
        setDraftStatus('تم حفظ المسودة محلياً');
      } catch {
        setDraftStatus('تعذر حفظ المسودة محلياً');
      }
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [activeLessonId, editingQuestionId, questionDraft]);
  const submitLesson = (event: FormEvent) => {
    event.preventDefault();
    const data = { ...lessonDraft, unit: lessonDraft.unit || undefined };
    const onSuccess = () => { resetLesson(); refreshLessons(); };
    if (editingLessonId) updateLesson.mutate({ lessonId: editingLessonId, data }, { onSuccess });
    else createLesson.mutate({ data }, { onSuccess });
  };
  const submitQuestion = (event: FormEvent) => {
    event.preventDefault();
    if (!activeLessonId) return;
    const data = { lessonId: activeLessonId, prompt: questionDraft.prompt, optionA: questionDraft.a, optionB: questionDraft.b, optionC: questionDraft.c, optionD: questionDraft.d, correctOptionId: questionDraft.correct, explanation: questionDraft.explanation };
    const lessonTitle = lessonList.find(lesson => lesson.id === activeLessonId)?.title ?? 'درس غير معروف';
    const localQuestion = (id: number): AdminQuestion => ({
      id,
      lessonId: activeLessonId,
      lessonTitle,
      prompt: questionDraft.prompt,
      options: [
        { id: 'a', text: questionDraft.a },
        { id: 'b', text: questionDraft.b },
        { id: 'c', text: questionDraft.c },
        { id: 'd', text: questionDraft.d },
      ],
      correctOptionId: questionDraft.correct,
      explanation: questionDraft.explanation,
    });
    const saveLocally = (id: number) => {
      setLocalQuestions(previous => {
        const next = previous.some(question => question.id === id)
          ? previous.map(question => question.id === id ? localQuestion(id) : question)
          : [localQuestion(id), ...previous];
        try {
          localStorage.setItem('rawat-admin-local-questions', JSON.stringify(next));
        } catch {
          setDraftStatus('تم تحديث القائمة مؤقتاً، وتعذر التخزين المحلي');
        }
        return next;
      });
    };
    if (editingQuestionId && editingQuestionId < 0) {
      saveLocally(editingQuestionId);
      toast({ title: 'تم حفظ السؤال محلياً', description: 'سيبقى السؤال متاحاً حتى يتوفر اتصال الخادم.' });
      return;
    }
    const onSuccess = () => {
      setLocalQuestions(previous => {
        const next = previous.filter(question => !(question.lessonId === activeLessonId && question.prompt === questionDraft.prompt));
        try {
          localStorage.setItem('rawat-admin-local-questions', JSON.stringify(next));
        } catch {
          // The server save succeeded; local cleanup is best effort.
        }
        return next;
      });
      resetQuestion(true);
      qc.invalidateQueries({ queryKey: getListAdminQuestionsQueryKey() });
      toast({ title: 'نجح حفظ السؤال', description: 'تم حفظ السؤال والإجابة والشرح.' });
    };
    const onError = (error: unknown) => {
      if (isApiUnavailable(error)) {
        saveLocally(editingQuestionId ?? -Date.now());
        toast({ title: 'تعذر الوصول إلى الخادم — حُفظ السؤال محلياً', description: 'تم تحديث القائمة محلياً، وبقيت البيانات داخل النموذج. يمكنك إعادة المحاولة عند عودة الخادم.', variant: 'destructive' });
        return;
      }
      toast({ title: 'تعذر حفظ السؤال', description: getMutationErrorMessage(error), variant: 'destructive' });
    };
    if (editingQuestionId) updateQuestion.mutate({ questionId: editingQuestionId, data }, { onSuccess, onError });
    else createQuestion.mutate({ data }, { onSuccess, onError });
  };
  const questionSaving = createQuestion.isPending || updateQuestion.isPending;
  const questionDeleting = deleteQuestion.isPending;
  const editQuestion = (question: AdminQuestion) => {
    const values = Object.fromEntries(question.options.map(option => [option.id, option.text]));
    setActiveLessonId(question.lessonId);
    setEditingQuestionId(question.id);
    setQuestionDraft({
      prompt: question.prompt,
      a: String(values.a ?? ''),
      b: String(values.b ?? ''),
      c: String(values.c ?? ''),
      d: String(values.d ?? ''),
      correct: question.correctOptionId as QuestionDraft['correct'],
      explanation: question.explanation,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const removeQuestion = (question: AdminQuestion) => {
    if (!window.confirm('حذف هذا السؤال؟')) return;
    if (question.id < 0) {
      setLocalQuestions(previous => {
        const next = previous.filter(item => item.id !== question.id);
        localStorage.setItem('rawat-admin-local-questions', JSON.stringify(next));
        return next;
      });
      if (editingQuestionId === question.id) resetQuestion(true);
      toast({ title: 'تم حذف السؤال المحلي', description: 'تم تحديث القائمة المحلية.' });
      return;
    }
    deleteQuestion.mutate({ questionId: question.id }, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListAdminQuestionsQueryKey() });
        if (editingQuestionId === question.id) resetQuestion(true);
        toast({ title: 'تم حذف السؤال', description: 'تم حذف السؤال من بنك الأسئلة.' });
      },
      onError: (error) => toast({ title: 'تعذر حذف السؤال', description: getMutationErrorMessage(error), variant: 'destructive' }),
    });
  };
  return <div className="mt-8 space-y-6">
    {mode === 'lessons' && <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
      <section className="rounded-3xl border border-[#d9ceff] bg-white p-5 shadow-sm md:p-8"><div className="mb-6 flex items-start justify-between gap-3"><div><p className="text-xs font-bold tracking-[.14em] text-[#7869a5]">إدارة المحتوى</p><h2 className="display mt-1 text-2xl font-bold text-[#30254f]">{editingLessonId ? 'تعديل الدرس' : 'إضافة درس جديد'}</h2></div><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#e8e1ff] text-[#4d397f]"><BookOpen size={20} /></span></div><form onSubmit={submitLesson} className="grid gap-4"><label className="grid gap-2 text-sm font-bold text-[#514b61]">عنوان الدرس<input data-testid="admin-lesson-title" required value={lessonDraft.title} onChange={e => setLessonDraft({ ...lessonDraft, title: e.target.value })} placeholder="عنوان الدرس" className="h-12 rounded-xl border border-[#ded7f3] bg-[#fbfaff] px-4 text-sm font-normal outline-none focus:border-[#4d397f]" /></label><label className="grid gap-2 text-sm font-bold text-[#514b61]">وصف مختصر<input data-testid="admin-lesson-description" required value={lessonDraft.description} onChange={e => setLessonDraft({ ...lessonDraft, description: e.target.value })} placeholder="وصف مختصر" className="h-12 rounded-xl border border-[#ded7f3] bg-[#fbfaff] px-4 text-sm font-normal outline-none focus:border-[#4d397f]" /></label><label className="grid gap-2 text-sm font-bold text-[#514b61]">محتوى الدرس<textarea data-testid="admin-lesson-content" required value={lessonDraft.content} onChange={e => setLessonDraft({ ...lessonDraft, content: e.target.value })} placeholder="اكتبي محتوى الدرس هنا..." className="min-h-36 resize-y rounded-xl border border-[#ded7f3] bg-[#fbfaff] p-4 text-sm font-normal leading-7 outline-none focus:border-[#4d397f]" /></label><div className="grid gap-3 sm:grid-cols-4"><label className="grid gap-2 text-sm font-bold text-[#514b61]">الصف<select data-testid="admin-lesson-grade" value={lessonDraft.grade} onChange={e => setLessonDraft({ ...lessonDraft, grade: e.target.value as LessonDraft['grade'] })} className="h-12 rounded-xl border border-[#ded7f3] bg-[#fbfaff] px-3 text-sm font-normal outline-none"><option value="first">أول ثانوي</option><option value="second">ثاني ثانوي</option></select></label><label className="grid gap-2 text-sm font-bold text-[#514b61]">الفصل<select data-testid="admin-lesson-term" value={lessonDraft.term} onChange={e => setLessonDraft({ ...lessonDraft, term: e.target.value as LessonDraft['term'] })} className="h-12 rounded-xl border border-[#ded7f3] bg-[#fbfaff] px-3 text-sm font-normal outline-none"><option value="first">الأول</option><option value="second">الثاني</option></select></label><label className="grid gap-2 text-sm font-bold text-[#514b61]">المدة<input data-testid="admin-lesson-duration" required value={lessonDraft.duration} onChange={e => setLessonDraft({ ...lessonDraft, duration: e.target.value })} placeholder="20 دقيقة" className="h-12 rounded-xl border border-[#ded7f3] bg-[#fbfaff] px-3 text-sm font-normal outline-none focus:border-[#4d397f]" /></label><label className="grid gap-2 text-sm font-bold text-[#514b61]">رقم الترتيب<input data-testid="admin-lesson-sort-order" type="number" min="1" required value={lessonDraft.sortOrder} onChange={e => setLessonDraft({ ...lessonDraft, sortOrder: Math.max(1, Number(e.target.value) || 1) })} placeholder="1" className="h-12 rounded-xl border border-[#ded7f3] bg-[#fbfaff] px-3 text-sm font-normal outline-none focus:border-[#4d397f]" /></label></div><label className="grid gap-2 text-sm font-bold text-[#514b61]">الوحدة<select data-testid="admin-lesson-unit" value={lessonDraft.unit} onChange={e => setLessonDraft({ ...lessonDraft, unit: e.target.value })} className="h-12 rounded-xl border border-[#ded7f3] bg-[#fbfaff] px-3 text-sm font-normal outline-none"><option value="">بدون وحدة</option><option value="الوحدة الأولى">الوحدة الأولى</option><option value="الوحدة الثانية">الوحدة الثانية</option><option value="الوحدة الثالثة">الوحدة الثالثة</option><option value="الوحدة الرابعة">الوحدة الرابعة</option></select></label><div className="flex gap-2"><button data-testid="admin-create-lesson" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#49337a] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#49337a]/20">{editingLessonId ? <PenLine size={16} /> : <Plus size={16} />}{editingLessonId ? 'حفظ التعديلات' : 'إضافة الدرس +'}</button>{editingLessonId && <button type="button" onClick={resetLesson} className="rounded-xl border border-[#ded7f3] px-5 text-sm font-bold text-[#4d397f]">إلغاء</button>}</div></form></section>
       <section className="rounded-3xl border border-[#d9ceff] bg-[#e8e1ff] p-5 shadow-sm md:p-6"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold tracking-[.14em] text-[#7869a5]">المكتبة الحالية</p><h2 className="display mt-1 text-xl font-bold text-[#30254f]">الدروس المضافة</h2></div><button type="button" onClick={() => setNumberLessons(true)} data-testid="admin-number-lessons" className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition ${numberLessons ? 'bg-[#4d397f] text-white' : 'bg-white text-[#4d397f] hover:bg-[#eee9ff]'}`}><ListOrdered size={16} />ترتيب بالأرقام</button></div><div className="mt-5 space-y-2">{orderedLessonList.length ? orderedLessonList.map((lesson) => <div key={lesson.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white/80 p-3"><div className="flex min-w-0 items-center gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#4d397f] text-xs font-bold text-white">{lesson.sortOrder}</span><div className="min-w-0"><strong className="block truncate text-sm text-[#30254f]">{lesson.title}</strong><span className="text-xs text-[#81798e]">{gradeLabel(lesson.grade)} · {termLabel(lesson.term)}</span></div></div><div className="flex shrink-0 gap-1"><button onClick={() => { setEditingLessonId(lesson.id); setLessonDraft({ title: lesson.title, description: lesson.description, content: lesson.content ?? '', grade: lesson.grade, term: lesson.term, unit: lesson.unit ?? '', duration: lesson.duration, sortOrder: lesson.sortOrder }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} data-testid={`admin-edit-lesson-${lesson.id}`} className="grid h-9 w-9 place-items-center rounded-xl bg-[#eee9ff] text-[#4d397f]"><PenLine size={15} /></button><button onClick={() => { if (window.confirm('حذف هذا الدرس وجميع أسئلته؟')) deleteLesson.mutate({ lessonId: lesson.id }, { onSuccess: refreshLessons }); }} data-testid={`admin-delete-lesson-${lesson.id}`} className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-600"><Trash2 size={15} /></button></div></div>) : <p className="py-8 text-center text-sm text-[#81798e]">لا توجد دروس بعد.</p>}</div></section>
    </div>}
     {mode === 'questions' && <div className="grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
       <section className="rounded-3xl border border-[#d9ceff] bg-white p-5 shadow-sm md:p-7">
         <div className="mb-6 flex items-start justify-between gap-3">
           <div><p className="text-xs font-bold tracking-[.14em] text-[#7869a5]">بنك الأسئلة</p><h2 className="display mt-1 text-2xl font-bold text-[#30254f]">{editingQuestionId ? 'تعديل السؤال' : 'إضافة سؤال جديد'}</h2></div>
           <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#e8e1ff] text-[#4d397f]"><CircleHelp size={20} /></span>
         </div>
         <div className="mb-4 flex items-center justify-between gap-3 rounded-xl bg-[#f5f2fb] px-3 py-2 text-xs text-[#7869a5]">
           <span>المسودة تُحفظ محلياً كل 5 ثوانٍ أثناء الكتابة.</span>
           {draftStatus && <span className="font-bold">{draftStatus}</span>}
         </div>
         <label className="mb-4 grid gap-2 text-sm font-bold text-[#514b61]">عنوان الدرس / الفصل
           <select data-testid="admin-question-lesson" value={activeLessonId ?? ''} onChange={e => { setActiveLessonId(Number(e.target.value) || null); setQuestionDraft(emptyQuestionDraft); setEditingQuestionId(null); setDraftStatus(''); }} className="h-12 rounded-xl border border-[#ded7f3] bg-[#fbfaff] px-3 text-sm font-normal outline-none">
             <option value="">اختاري درساً</option>{orderedLessonList.map(lesson => <option key={lesson.id} value={lesson.id}>{lesson.title}</option>)}
           </select>
         </label>
         <form onSubmit={submitQuestion} className="grid gap-3">
           <textarea data-testid="admin-question-prompt" required value={questionDraft.prompt} onChange={e => setQuestionDraft({ ...questionDraft, prompt: e.target.value })} placeholder="نص السؤال" className="min-h-28 resize-y rounded-xl border border-[#ded7f3] bg-[#fbfaff] p-4 text-sm leading-7 outline-none focus:border-[#4d397f]" />
           <div className="grid gap-3 sm:grid-cols-2">
             {(['a', 'b', 'c', 'd'] as const).map((key, index) => <input key={key} required data-testid={`admin-question-${key}`} value={questionDraft[key]} onChange={e => setQuestionDraft({ ...questionDraft, [key]: e.target.value })} placeholder={`الخيار ${['أ', 'ب', 'ج', 'د'][index]}`} className="h-11 rounded-xl border border-[#ded7f3] bg-[#fbfaff] px-3 text-sm outline-none focus:border-[#4d397f]" />)}
           </div>
           <fieldset className="rounded-xl border border-[#ded7f3] bg-[#fbfaff] p-3">
             <legend className="px-1 text-sm font-bold text-[#514b61]">حددي الإجابة الصحيحة</legend>
             <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
               {(['a', 'b', 'c', 'd'] as const).map((key, index) => <label key={key} className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm ${questionDraft.correct === key ? 'bg-[#e8e1ff] font-bold text-[#4d397f]' : 'text-[#514b61]'}`}><input type="radio" name="question-correct-option" value={key} checked={questionDraft.correct === key} onChange={() => setQuestionDraft({ ...questionDraft, correct: key })} />{`الخيار ${['أ', 'ب', 'ج', 'د'][index]}`}</label>)}
             </div>
           </fieldset>
           <textarea data-testid="admin-question-explanation" required value={questionDraft.explanation} onChange={e => setQuestionDraft({ ...questionDraft, explanation: e.target.value })} placeholder="التوضيح / شرح الإجابة" className="min-h-28 resize-y rounded-xl border border-[#ded7f3] bg-[#fbfaff] p-4 text-sm outline-none focus:border-[#4d397f]" />
           <div className="flex gap-2">
             <button type="submit" disabled={!activeLessonId || questionSaving} data-testid="admin-create-question" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#49337a] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#49337a]/20 disabled:cursor-not-allowed disabled:opacity-40">
               {questionSaving ? <><Spinner />جاري حفظ السؤال...</> : <>{editingQuestionId ? <PenLine size={16} /> : <Plus size={16} />}{editingQuestionId ? 'حفظ السؤال' : 'إضافة السؤال +'}</>}
             </button>
             {editingQuestionId && <button type="button" onClick={() => resetQuestion(true)} className="rounded-xl border border-[#ded7f3] px-5 text-sm font-bold text-[#4d397f]">إلغاء</button>}
           </div>
         </form>
       </section>
       <section className="rounded-3xl border border-[#d9ceff] bg-[#e8e1ff] p-5 shadow-sm md:p-7">
         <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold tracking-[.14em] text-[#7869a5]">الأسئلة المضافة</p><h2 className="display mt-1 text-xl font-bold text-[#30254f]">بنك الأسئلة</h2></div><span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-[#4d397f]">{displayedQuestions.length} سؤال</span></div>
         <div className="relative mt-5"><Search className="absolute right-3 top-3 text-[#81798e]" size={17} /><input data-testid="admin-question-search" value={questionSearch} onChange={e => setQuestionSearch(e.target.value)} placeholder="ابحثي باسم الدرس..." className="h-11 w-full rounded-xl border border-[#d9ceff] bg-white pr-10 pl-3 text-sm outline-none focus:border-[#4d397f]" /></div>
         {adminQuestions.isLoading && !displayedQuestions.length ? <div className="flex items-center justify-center gap-2 py-12 text-sm text-[#81798e]"><Spinner />جاري تحميل الأسئلة...</div> : adminQuestions.isError && !displayedQuestions.length ? <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">تعذر تحميل الأسئلة من الخادم، لكن يمكنك إضافة أسئلة وحفظها محلياً.</div> : displayedQuestions.length ? <div className="mt-5 overflow-x-auto rounded-2xl bg-white/80"><table className="w-full min-w-[620px] text-right text-sm"><thead className="border-b border-[#eeeaf6] text-xs text-[#81798e]"><tr><th className="px-4 py-3">الدرس</th><th className="px-4 py-3">نص السؤال</th><th className="px-4 py-3">الصحيح</th><th className="px-4 py-3">إجراء</th></tr></thead><tbody>{displayedQuestions.map(question => <tr key={question.id} className="border-b border-[#eeeaf6] last:border-0"><td className="px-4 py-4 text-xs font-bold text-[#4d397f]">{question.lessonTitle}{question.id < 0 && <span className="mr-1 rounded-full bg-[#fff0c9] px-2 py-0.5 text-[10px]">محلي</span>}</td><td className="max-w-[280px] px-4 py-4 font-semibold leading-6 text-[#30254f]">{question.prompt}</td><td className="px-4 py-4 text-xs font-bold text-[#7869a5]">{question.correctOptionId.toUpperCase()}</td><td className="px-4 py-4"><div className="flex gap-1"><button type="button" onClick={() => editQuestion(question)} data-testid={`admin-edit-question-${question.id}`} className="grid h-9 w-9 place-items-center rounded-xl bg-[#eee9ff] text-[#4d397f]"><PenLine size={15} /></button><button type="button" disabled={questionDeleting} onClick={() => removeQuestion(question)} data-testid={`admin-delete-question-${question.id}`} className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-600 disabled:opacity-40"><Trash2 size={15} /></button></div></td></tr>)}</tbody></table></div> : <div className="mt-8 rounded-2xl border border-dashed border-[#cfc3f1] p-10 text-center text-sm text-[#81798e]">{questionSearch ? 'لا توجد نتائج بهذا البحث.' : 'لا توجد أسئلة بعد.'}</div>}
       </section>
     </div>}
  </div>;
}

function PageLoader() { return <div className="main-pad mx-auto max-w-4xl px-5 py-20"><div className="animate-pulse space-y-4"><div className="h-12 w-2/3 rounded-xl bg-muted" /><div className="h-5 w-full rounded bg-muted" /><div className="h-48 rounded-[28px] bg-muted" /></div></div>; }
function EmptyState({ title }: { title: string }) { return <div className="main-pad mx-auto max-w-xl px-5 py-24 text-center"><div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-secondary/35 text-primary"><Leaf size={28} /></div><h1 className="display text-2xl font-bold">{title}</h1><Link href="/lessons" data-testid="empty-link-lessons" className="mt-6 inline-block rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">العودة إلى المكتبة</Link></div>; }

function Router() {
  const auth = useGetCurrentUser(); const logout = useLogout(); const user = auth.data?.user; const [, setLocation] = useLocation();
  const onLogout = () => logout.mutate(undefined, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetCurrentUserQueryKey() }); setLocation('/'); } });
  return <Shell user={user} onLogout={onLogout}><Switch><Route path="/" component={() => <HomePage user={user} />} /><Route path="/login" component={() => <AuthPage mode="login" />} /><Route path="/register" component={() => <AuthPage mode="register" />} /><Route path="/lessons" component={LessonsPage} /><Route path="/lessons/:lessonId/quiz" component={QuizPage} /><Route path="/lessons/:lessonId" component={LessonPage} /><Route path="/profile" component={() => user ? <ProfilePage user={user} /> : <AuthPage mode="login" />} /><Route path="/contact" component={ContactPage} /><Route path="/admin" component={() => user?.role === 'admin' ? <AdminPage /> : <EmptyState title="هذه المساحة للإدارة فقط" />} /><Route component={NotFound} /></Switch></Shell>;
}

function App() {
  useEffect(() => { const saved = localStorage.getItem('rawat-theme'); if (saved === 'dark') document.documentElement.classList.add('dark'); }, []);
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><ErrorBoundary><Router /></ErrorBoundary></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;