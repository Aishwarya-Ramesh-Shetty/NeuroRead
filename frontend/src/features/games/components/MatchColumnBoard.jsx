import { useMemo, useState } from 'react';

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

  const rightById = useMemo(
    () =>
      rightItems.reduce((accumulator, item) => {
        accumulator[item.id] = item;
        return accumulator;
      }, {}),
    [rightItems]
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

    Object.entries(nextLinks).forEach(([currentLeftId, currentRightId]) => {
      if (currentRightId === rightId && currentLeftId !== leftId) {
        delete nextLinks[currentLeftId];
      }
    });

    nextLinks[leftId] = rightId;
    updateLinks(nextLinks);
    setSelectedLeft(null);
    setDraggingLeftId(null);
  };

  const handleLeftClick = (itemId) => {
    setSelectedLeft((current) => (current === itemId ? null : itemId));
  };

  const handleRightClick = (itemId) => {
    if (!selectedLeft) {
      return;
    }

    connectPair(selectedLeft, itemId);
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
          Drag left cards onto the right column
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
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
                onDragStart={(event) => {
                  event.dataTransfer.setData('text/plain', item.id);
                  event.dataTransfer.effectAllowed = 'move';
                  setDraggingLeftId(item.id);
                }}
                onDragEnd={() => setDraggingLeftId(null)}
              >
                <button
                  className="flex w-full items-center gap-4 text-left"
                  onClick={() => handleLeftClick(item.id)}
                  type="button"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-fuchsia-500 text-lg font-black text-white">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xl font-black text-ink">{item.label}</p>
                    <p className="text-sm font-bold text-slate-500">
                      {connectedRight ? `Matched with ${connectedRight.label}` : 'Drag to match'}
                    </p>
                  </div>
                </button>
                {connectedRight ? (
                  <button
                    className="mt-3 rounded-full bg-white px-4 py-2 text-sm font-black text-fuchsia-700 shadow-sm"
                    onClick={() => clearPair(item.id)}
                    type="button"
                  >
                    Clear match
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
        <div className="space-y-3">
          {rightItems.map((item, index) => {
            const isLinked = linkedRightIds.has(item.id);
            const matchingLeft = leftItems.find((leftItem) => links[leftItem.id] === item.id);

            return (
              <button
                key={item.id}
                className={[
                  'flex w-full items-center gap-4 rounded-[1.75rem] border-4 px-4 py-4 text-left shadow-sm transition',
                  isLinked
                    ? 'border-sky-300 bg-sky-100'
                    : 'border-white/90 bg-white hover:border-sky-200'
                ].join(' ')}
                onClick={() => handleRightClick(item.id)}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = 'move';
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  const leftId = event.dataTransfer.getData('text/plain') || draggingLeftId;

                  if (leftId) {
                    connectPair(leftId, item.id);
                  }
                }}
                type="button"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-500 text-lg font-black text-white">
                  {String.fromCharCode(65 + index)}
                </span>
                <div className="min-w-0">
                  <p className="text-xl font-black text-ink">{item.label}</p>
                  <p className="text-sm font-bold text-slate-500">
                    {matchingLeft ? `Dropped: ${matchingLeft.label}` : 'Drop a left card here'}
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
