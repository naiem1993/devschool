import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p className="font-medium">
          © {new Date().getFullYear()} DevSchool — ১০০% ফ্রি লার্নিং প্ল্যাটফর্ম
        </p>
        <p className="mt-1 text-xs">
          ❤️ দান করতে চান?{" "}
          <Link href="/donate" className="text-[#15803d] dark:text-[#4ADE80] hover:underline font-medium">
            এখানে ক্লিক করুন
          </Link>
        </p>
      </div>
    </footer>
  );
}