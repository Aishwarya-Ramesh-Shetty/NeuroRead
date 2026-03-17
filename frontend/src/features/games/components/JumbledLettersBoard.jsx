import { useMemo, useState } from 'react';

function JumbledLettersBoard({
  letters = [],
  value,
  onChange,
  title = 'Build the word',
  hint = 'Drag letters into the answer row, then rearrange them until the word is correct.'
}) {
  const letterTiles = useMemo(
    () => letters.map((letter, index) => ({ id: `${letter}-${index}`, label: letter })),
    [letters]
  );
  const [internalWord, setInternalWord] = useState([]);
  const [draggedTileId, setDraggedTileId] = useState(null);
  const selectedTileIds = value ?? internalWord;

  const selectedTiles = selectedTileIds
    .map((tileId) => letterTiles.find((tile) => tile.id === tileId))
    .filter(Boolean);

  const remainingTiles = letterTiles.filter((tile) => !selectedTileIds.includes(tile.id));

  const updateWord = (nextWord) => {
    if (onChange) {
      onChange(nextWord);
      return;
    }

    setInternalWord(nextWord);
  };

  const insertAtIndex = (tileId, index) => {
    const currentIndex = selectedTileIds.indexOf(tileId);
    const nextWord = [...selectedTileIds];

    if (currentIndex >= 0) {
      nextWord.splice(currentIndex, 1);
    }

    const safeIndex = Math.max(0, Math.min(index, nextWord.length));
    nextWord.splice(safeIndex, 0, tileId);
    updateWord(nextWord);
    setDraggedTileId(null);
  };

  const removeTile = (tileId) => {
    updateWord(selectedTileIds.filter((currentTileId) => currentTileId !== tileId));
  };

  return (
    <div className="space-y-5 rounded-[2rem] bg-gradient-to-br from-lime-100 via-amber-50 to-orange-100 p-5 shadow-lg sm:p-6">
      <div className="space-y-2">
        <h3 className="text-2xl font-black text-ink">{title}</h3>
        <p className="text-lg leading-8 text-slate-600">{hint}</p>
      </div>

      <div className="rounded-[1.75rem] border-4 border-dashed border-amber-300 bg-white/80 p-4">
        <div
          className="flex min-h-28 flex-wrap items-center gap-3"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            const tileId = event.dataTransfer.getData('text/plain') || draggedTileId;

            if (tileId) {
              insertAtIndex(tileId, selectedTileIds.length);
            }
          }}
        >
          {selectedTiles.length ? (
            selectedTiles.map((tile, index) => (
              <div
                key={tile.id}
                className="relative"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const tileId = event.dataTransfer.getData('text/plain') || draggedTileId;

                  if (tileId) {
                    insertAtIndex(tileId, index);
                  }
                }}
              >
                <button
                  className="flex h-16 min-w-16 items-center justify-center rounded-[1.25rem] bg-amber-400 px-5 text-2xl font-black text-white shadow-md transition hover:-translate-y-0.5"
                  draggable
                  onClick={() => removeTile(tile.id)}
                  onDragEnd={() => setDraggedTileId(null)}
                  onDragStart={(event) => {
                    event.dataTransfer.setData('text/plain', tile.id);
                    event.dataTransfer.effectAllowed = 'move';
                    setDraggedTileId(tile.id);
                  }}
                  type="button"
                >
                  {tile.label}
                </button>
              </div>
            ))
          ) : (
            <p className="text-lg font-bold text-slate-400">Drop letters here to build your word.</p>
          )}
        </div>
      </div>

      <div className="rounded-[1.75rem] bg-white/70 p-4">
        <div
          className="flex min-h-24 flex-wrap gap-3"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            const tileId = event.dataTransfer.getData('text/plain') || draggedTileId;

            if (tileId) {
              removeTile(tileId);
              setDraggedTileId(null);
            }
          }}
        >
          {remainingTiles.map((tile) => (
            <button
              key={tile.id}
              className="flex h-16 min-w-16 items-center justify-center rounded-[1.25rem] border-4 border-white bg-white px-5 text-2xl font-black text-ink shadow-md transition hover:-translate-y-0.5 hover:border-lime-200"
              draggable
              onClick={() => insertAtIndex(tile.id, selectedTileIds.length)}
              onDragEnd={() => setDraggedTileId(null)}
              onDragStart={(event) => {
                event.dataTransfer.setData('text/plain', tile.id);
                event.dataTransfer.effectAllowed = 'move';
                setDraggedTileId(tile.id);
              }}
              type="button"
            >
              {tile.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default JumbledLettersBoard;
