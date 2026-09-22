import AdminShell from '@/components/admin/AdminShell'

// সব admin page force-dynamic — কারণ প্রতিটা request-এ fresh DB data দরকার।
// এটা না থাকলে admin নতুন tutorial যোগ করলে rebuild ছাড়া list-এ দেখাবে না।
// এটা layout-এ দেওয়া — তাই সব admin child pages (dashboard, categories, tutorials,
// challenges, quizzes, references, donations) automatic dynamic হয়ে যাবে।
export const dynamic = 'force-dynamic'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
