
import { useMemo, useState } from 'react';
import LetterPronounceText from './LetterPronounceText.jsx';

function MatchColumnBoard({
  leftItems = [],
  rightItems = [],
  value,
  onChange,
  title = 'Match the pairs'
}) {
  const [draftLinks, setDraftLinks] = useState({});
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [draggingLeftId, setDraggingLeftId] = useState(null);
  const links = value ?? draftLinks;

  // ✅ FIX: convert right side to lowercase
  const transformedRightItems = useMemo(() => {
    return rightItems.map(item => ({
      ...item,
      label: item.label.toLowerCase()
    }));
  }, [rightItems]);

  const rightById = useMemo(
    () =>
      transformedRightItems.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {}),
    [transformedRightItems]
  );

  const linkedRightIds = useMemo(() => new Set(Object.values(links)), [links]);

  const updateLinks = (nextLinks) => {
    if (onChange) {
      onChange(nextLinks);
      return;
    }
    setDraftLinks(nextLinks);
  };

  const connectPair = (leftId, rightId) => {
    const nextLinks = { ...links };

    Object.entries(nextLinks).forEach(([lId, rId]) => {
      if (rId === rightId && lId !== leftId) {
        delete nextLinks[lId];
      }
    });

    nextLinks[leftId] = rightId;
    updateLinks(nextLinks);
    setSelectedLeft(null);
    setDraggingLeftId(null);
  };

  const handleLeftClick = (id) => {
    setSelectedLeft((curr) => (curr === id ? null : id));
  };

  const handleRightClick = (id) => {
    if (!selectedLeft) return;
    connectPair(selectedLeft, id);
  };

  const clearPair = (leftId) => {
    const nextLinks = { ...links };
    delete nextLinks[leftId];
    updateLinks(nextLinks);
  };

  return (
    <div className="rounded-[2rem] bg-gradient-to-br from-amber-100 via-rose-50 to-sky-100 p-4 shadow-lg sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-2xl font-black text-ink">{title}</h3>
        <p className="rounded-full bg-white/85 px-4 py-2 text-sm font-bold text-slate-600">
          Left: UPPERCASE, Right: lowercase
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="space-y-3">
          {leftItems.map((item, index) => {
            const connectedRight = rightById[links[item.id]];
            const isActive = selectedLeft === item.id || draggingLeftId === item.id;

            return (
              <div
                key={item.id}
                className={[
                  'rounded-[1.75rem] border-4 px-4 py-4 shadow-sm transition',
                  isActive
                    ? 'border-fuchsia-300 bg-fuchsia-100'
                    : 'border-white/90 bg-white hover:border-fuchsia-200'
                ].join(' ')}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', item.id);
                  setDraggingLeftId(item.id);
                }}
                onDragEnd={() => setDraggingLeftId(null)}
              >
                <button
                  className="flex w-full items-center gap-4 text-left"
                  onClick={() => handleLeftClick(item.id)}
                  type="button"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-fuchsia-500 text-white font-black">
                    {index + 1}
                  </span>

                  <div className="flex-1">
                    {/* ✅ UPPERCASE */}
                    <p className="text-xl font-black text-ink">
                      <LetterPronounceText text={item.label} />
                    </p>
                    <p className="text-sm text-slate-500">
                      {connectedRight ? 'Matched' : 'Drag to match'}
                    </p>
                  </div>
                </button>

                {connectedRight && (
                  <button
                    className="mt-3 rounded-full bg-white px-4 py-2 text-sm font-black text-fuchsia-700"
                    onClick={() => clearPair(item.id)}
                  >
                    Clear match
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-3">
          {transformedRightItems.map((item, index) => {
            const isLinked = linkedRightIds.has(item.id);
            const matchingLeft = leftItems.find(l => links[l.id] === item.id);

            return (
              <button
                key={item.id}
                className={[
                  'flex w-full items-center gap-4 rounded-[1.75rem] border-4 px-4 py-4 text-left transition',
                  isLinked
                    ? 'border-sky-300 bg-sky-100'
                    : 'border-white/90 bg-white hover:border-sky-200'
                ].join(' ')}
                onClick={() => handleRightClick(item.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const leftId = e.dataTransfer.getData('text/plain') || draggingLeftId;
                  if (leftId) connectPair(leftId, item.id);
                }}
                type="button"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-white font-black">
                  {String.fromCharCode(65 + index)}
                </span>

                <div>
                  {/* ✅ LOWERCASE */}
                  <p className="text-xl font-black text-ink lowercase">
                    <LetterPronounceText text={item.label} />
                  </p>
                  <p className="text-sm text-slate-500">
                    {matchingLeft ? `Matched: ${matchingLeft.label}` : 'Drop here'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default MatchColumnBoard;

