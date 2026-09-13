'use client';

import React, { useState, useRef, useId } from 'react';
import { X } from 'lucide-react';

/**
 * Chip/tag input — press Enter or comma to add a tag, click × to remove.
 * Used for materials, colours, customisation_options.
 */
export default function TagInput({
  label,
  helper,
  tags = [],
  onChange,
  placeholder = 'Type and press Enter to add',
  error,
}) {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const id = useId();

  const addTag = (value) => {
    const trimmed = value.trim().replace(/,\s*$/, '').trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput('');
  };

  const removeTag = (index) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handleBlur = () => {
    if (input) addTag(input);
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-xs uppercase tracking-wider text-white/60">
          {label}
        </label>
      )}
      <div
        className={`min-h-[44px] flex flex-wrap items-center gap-2 p-2 border cursor-text transition-colors focus-within:border-accent-orange
          ${error ? 'border-red-400' : 'border-white/15 bg-navy-deep hover:border-white/25'}`}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 bg-navy-panel border border-white/20 pl-2.5 pr-1.5 py-0.5 text-xs text-white/80"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(i); }}
              className="text-white/40 hover:text-white/80 transition-colors p-0.5"
              aria-label={`Remove ${tag}`}
            >
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          id={id}
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[140px] bg-transparent text-sm text-white outline-none placeholder:text-white/25"
        />
      </div>
      {helper && !error && (
        <p className="text-[11px] text-white/30">{helper}</p>
      )}
      {error && (
        <p className="text-[11px] text-red-400">{error}</p>
      )}
    </div>
  );
}
