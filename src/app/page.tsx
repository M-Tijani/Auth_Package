import Link from "next/link";
import { FaUserAlt } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center gap-2">
      <Link
        href="/sign-in"
        className="box-border relative z-30 inline-flex items-center justify-center w-auto px-8 py-3 overflow-hidden font-bold text-white transition-all duration-300 bg-neutral-700 rounded-md cursor-pointer group ring-offset-2 ring-1 ring-indigo-300 ring-offset-indigo-200 hover:ring-offset-neutral-500 ease focus:outline-none"
      >
        <span className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
        <span className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
        <span className="relative z-20 flex items-center text-sm gap-2">
          <FaUserAlt size={15} />
          Sign in
        </span>
      </Link>
    </div>
  );
}
