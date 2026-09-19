import Link from "next/link";
import { DEFAULT_FOOTER, type FooterContent } from "@/lib/footer-content";

export default function Footer({ footer = DEFAULT_FOOTER }: { footer?: FooterContent }) {
  const year = new Date().getFullYear();
  const copyright = footer.copyright.replace(/\{year\}/g, String(year));

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p className="font-medium">{copyright}</p>
        <p className="mt-1 text-xs">
          {footer.donatePrompt}{" "}
          <Link
            href={footer.donateLinkHref}
            className="text-[#15803d] dark:text-[#4ADE80] hover:underline font-medium"
          >
            {footer.donateLinkLabel}
          </Link>
        </p>
      </div>
    </footer>
  );
}
