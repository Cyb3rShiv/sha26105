import React from 'react';

export function formatINR(val, options = {}) {
  if (val === undefined || val === null || isNaN(val)) return '₹0';
  const num = Number(val);
  const { compact = true, decimals = 2 } = options;

  if (!compact) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  }

  if (Math.abs(num) >= 10000000) {
    return `₹${(num / 10000000).toFixed(decimals)} Cr`;
  }
  if (Math.abs(num) >= 100000) {
    return `₹${(num / 100000).toFixed(decimals)} L`;
  }
  if (Math.abs(num) >= 1000) {
    return `₹${(num / 1000).toFixed(decimals)} K`;
  }
  return `₹${num.toFixed(0)}`;
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
