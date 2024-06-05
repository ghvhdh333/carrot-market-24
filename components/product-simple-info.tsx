import { formatToTimeAgo, formatToWon } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ProductSimpleInfoProps {
  title: string;
  price: number;
  created_at: Date;
  photo: string;
  id: number;
}

export default function ProductSimpleInfo({
  title,
  price,
  created_at,
  photo,
  id,
}: ProductSimpleInfoProps) {
  return (
    <Link href={`/products/${id}`} className="flex gap-5">
      <div className="relative size-28 rounded-md overflow-hidden">
        <Image
          fill
          priority
          sizes="112px"
          src={`${photo}/avatar`}
          alt={title}
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-1 *:text-white">
        <span className="text-lg">{title}</span>
        <span className="text-sm text-neutral-500">
          {formatToTimeAgo(created_at.toString())}
        </span>
        <span className="text-lg font-semibold">{formatToWon(price)} 원</span>
      </div>
    </Link>
  );
}
