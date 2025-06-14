import Link from 'next/link';
import { ReactNode } from 'react';

interface PromoCardProps {
  title: string;
  description: string;
  buttonText: string;
  href: string;
  icon?: ReactNode;
  bgColor?: string;
}

export default function PromoCard({
  title,
  description,
  buttonText,
  href,
  icon,
  bgColor = 'bg-white',
}: PromoCardProps) {
  return (
    <div className={`rounded-2xl shadow-sm flex flex-col justify-between p-6 min-h-[160px] ${bgColor}`}>
      <div className="flex items-center gap-3 mb-4">
        {icon && <span className="text-3xl">{icon}</span>}
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600 mb-4 flex-1">{description}</p>
      <Link href={href} className="inline-block px-4 py-2 bg-primary text-white rounded-md font-semibold hover:bg-primary/90 transition text-sm">
        {buttonText}
      </Link>
    </div>
  );
} 