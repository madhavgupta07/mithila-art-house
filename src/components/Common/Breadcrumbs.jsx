import { Link } from 'react-router-dom';
import { FaAngleRight } from 'react-icons/fa6';

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 font-sans text-[11px] text-charcoal/60">
        <li>
          <Link to="/" className="transition-colors hover:text-vermilion">
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            <FaAngleRight aria-hidden="true" className="text-[9px]" />
            {item.to ? (
              <Link to={item.to} className="transition-colors hover:text-vermilion">
                {item.label}
              </Link>
            ) : (
              <span aria-current={index === items.length - 1 ? 'page' : undefined} className="text-ink">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
