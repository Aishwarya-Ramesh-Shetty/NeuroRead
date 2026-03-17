import Card from '../../../components/ui/Card.jsx';

function QuestionCard({
  title = 'Question',
  prompt,
  helperText,
  imageUrl,
  audio,
  children,
  className = ''
}) {
  return (
    <Card className={['space-y-5 rounded-[2rem] bg-white/90 p-7 sm:p-8', className].join(' ')}>
      <div className="space-y-2">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-sea">{title}</p>
        {prompt ? (
          <h2 className="text-2xl font-black leading-snug text-ink sm:text-3xl">{prompt}</h2>
        ) : null}
        {helperText ? <p className="text-lg leading-8 text-slate-600">{helperText}</p> : null}
      </div>
      {imageUrl ? (
        <div className="overflow-hidden rounded-[1.75rem] border-4 border-sky-100 bg-sky-50 p-3">
          <img
            alt={prompt || 'Question illustration'}
            className="h-56 w-full rounded-[1.25rem] object-cover sm:h-72"
            src={imageUrl}
          />
        </div>
      ) : null}
      {audio ? <div>{audio}</div> : null}
      {children ? <div className="space-y-4">{children}</div> : null}
    </Card>
  );
}

export default QuestionCard;
