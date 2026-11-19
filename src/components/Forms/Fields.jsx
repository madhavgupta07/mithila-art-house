import { cn } from '../../lib/utils';

const inputClass =
  'w-full border border-ink/20 bg-transparent px-4 py-3 font-sans text-[13px] text-ink outline-none transition-colors placeholder:text-charcoal/40 focus:border-vermilion';

export function FieldError({ error, id }) {
  if (!error) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 font-sans text-[11px] text-vermilion">
      {error.message}
    </p>
  );
}

export function TextField({ label, name, register, error, required, type = 'text', className, rules, ...props }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-2 block font-sans text-[10px] uppercase tracking-wide2 text-charcoal/70">
        {label} {required && <span className="text-vermilion">*</span>}
      </label>
      <input
        id={name}
        type={type}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn(inputClass, error && 'border-vermilion')}
        {...register(name, rules)}
        {...props}
      />
      <FieldError error={error} id={`${name}-error`} />
    </div>
  );
}

export function TextArea({ label, name, register, error, required, rows = 5, className, rules, ...props }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-2 block font-sans text-[10px] uppercase tracking-wide2 text-charcoal/70">
        {label} {required && <span className="text-vermilion">*</span>}
      </label>
      <textarea
        id={name}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn(inputClass, 'resize-y', error && 'border-vermilion')}
        {...register(name, rules)}
        {...props}
      />
      <FieldError error={error} id={`${name}-error`} />
    </div>
  );
}

export function SelectField({ label, name, register, error, required, options = [], className, rules, ...props }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-2 block font-sans text-[10px] uppercase tracking-wide2 text-charcoal/70">
        {label} {required && <span className="text-vermilion">*</span>}
      </label>
      <select
        id={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn(inputClass, error && 'border-vermilion')}
        {...register(name, rules)}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldError error={error} id={`${name}-error`} />
    </div>
  );
}

export function CheckboxField({ label, name, register, error, className, rules }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="flex cursor-pointer items-start gap-3 text-[13px] text-charcoal/75">
        <input
          id={name}
          type="checkbox"
          className="mt-0.5 h-4 w-4 shrink-0 accent-vermilion"
          {...register(name, rules)}
        />
        <span>{label}</span>
      </label>
      <FieldError error={error} id={`${name}-error`} />
    </div>
  );
}
