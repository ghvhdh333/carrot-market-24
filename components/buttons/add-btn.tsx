import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

interface AddBtnProps {
  link: string;
}

export default function AddBtn({ link }: AddBtnProps) {
  return (
    <Link
      href={link}
      className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
    >
      <PlusIcon className="size-10" />
    </Link>
  );
}
