import { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa6';

export default function Accordion({ items, defaultOpen = 0 }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="divide-y divide-ink/10 border-y border-ink/10">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.title}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`accordion-panel-${index}`}
                onClick={() => setOpen(isOpen ? -1 : index)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left font-sans text-[12px] font-medium uppercase tracking-wide2 text-ink transition-colors hover:text-vermilion"
              >
                {item.title}
                {isOpen ? <FaMinus aria-hidden="true" /> : <FaPlus aria-hidden="true" />}
              </button>
            </h3>
            <div
              id={`accordion-panel-${index}`}
              hidden={!isOpen}
              className="pb-6 text-[14px] leading-7 text-charcoal/75"
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
