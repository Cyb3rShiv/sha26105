/**
 * Staggered entrance wrapper. Re-runs whenever the element remounts
 * (App re-keys the page container on tab switch).
 */
export default function Reveal({ delay = 0, className = '', children, as: Tag = 'div' }) {
  return (
    <Tag className={`reveal ${className}`} style={{ '--reveal-delay': `${delay}ms` }}>
      {children}
    </Tag>
  );
}
