import React from 'react';

export function formatINR(val, options = {}) {
  if (val === undefined || val === null || isNaN(val)) return '₹0';
  const num = Number(val);
  const { compact = true, decimals = 2 } = options;

  const isNegative = num < 0;
  const absNum = Math.abs(num);
  const signPrefix = isNegative ? '-' : '';

  if (!compact) {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(absNum);
    return `${signPrefix}${formatted}`;
  }

  if (absNum >= 10000000) {
    return `${signPrefix}₹${(absNum / 10000000).toFixed(decimals)} Cr`;
  }
  if (absNum >= 100000) {
    return `${signPrefix}₹${(absNum / 100000).toFixed(decimals)} L`;
  }
  if (absNum >= 1000) {
    return `${signPrefix}₹${(absNum / 1000).toFixed(decimals)} K`;
  }
  return `${signPrefix}₹${absNum.toFixed(0)}`;
}

export default function CurrencyFormatter({ value, compact = true, decimals = 2, className = "" }) {
  const formatted = formatINR(value, { compact, decimals });
  const exact = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value || 0);

  return (
    <span className={`font-mono font-semibold tracking-tight ${className}`} title={`Exact: ${exact}`}>
      {formatted}
    </span>
  );
}
