import { formatCurrency } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
  salePrice?: number | null;
  size?: 'sm' | 'md' | 'lg';
  showDiscount?: boolean;
}

export default function PriceDisplay({
  price,
  salePrice,
  size = 'md',
  showDiscount = true,
}: PriceDisplayProps) {
  const sizes = {
    sm: { original: 'text-sm', sale: 'text-lg' },
    md: { original: 'text-base', sale: 'text-2xl' },
    lg: { original: 'text-lg', sale: 'text-3xl' },
  };

  const hasDiscount = salePrice && salePrice < price;
  const discountPercentage = hasDiscount
    ? Math.round(((price - salePrice) / price) * 100)
    : 0;

  if (hasDiscount) {
    return (
      <div className="flex items-center gap-3">
        <span className={`font-bold text-primary-600 ${sizes[size].sale}`}>
          {formatCurrency(salePrice)}
        </span>
        <span className={`text-gray-500 line-through ${sizes[size].original}`}>
          {formatCurrency(price)}
        </span>
        {showDiscount && (
          <span className="bg-red-100 text-red-700 text-sm font-medium px-2 py-1 rounded">
            -{discountPercentage}%
          </span>
        )}
      </div>
    );
  }

  return (
    <span className={`font-bold text-primary-600 ${sizes[size].sale}`}>
      {formatCurrency(price)}
    </span>
  );
}
