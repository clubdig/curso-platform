'use client';

import Link from 'next/link';
import { BookOpen, Users } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface CourseCardProps {
  id: string;
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  salePrice?: number | null;
  coverUrl?: string;
  producer?: { name: string };
  enrollmentCount?: number;
  moduleCount?: number;
}

export default function CourseCard({
  title,
  slug,
  description,
  shortDescription,
  price,
  salePrice,
  coverUrl,
  producer,
  enrollmentCount = 0,
  moduleCount = 0,
}: CourseCardProps) {
  return (
    <Link href={`/course/${slug}`} className="card hover:shadow-lg transition-all group block">
      <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="h-16 w-16 text-gray-400" />
          </div>
        )}
      </div>

      {producer && (
        <div className="flex items-center gap-2 mb-3">
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-sm font-medium text-primary-600">
              {producer.name.charAt(0)}
            </span>
          </div>
          <span className="text-sm text-gray-600">{producer.name}</span>
        </div>
      )}

      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors text-lg">
        {title}
      </h3>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {shortDescription || description}
      </p>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <span className="flex items-center gap-1">
          <BookOpen className="h-4 w-4" />
          {moduleCount} módulos
        </span>
        <span className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          {enrollmentCount} alunos
        </span>
      </div>

      <div className="pt-4 border-t">
        {salePrice ? (
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary-600">
              {formatCurrency(salePrice)}
            </span>
            <span className="text-sm text-gray-500 line-through">
              {formatCurrency(price)}
            </span>
          </div>
        ) : (
          <span className="text-2xl font-bold text-primary-600">
            {formatCurrency(price)}
          </span>
        )}
      </div>
    </Link>
  );
}
