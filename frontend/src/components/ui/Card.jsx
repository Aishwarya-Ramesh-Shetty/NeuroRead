function Card({ children, className = '', ...props }) {
  return (
    <section className={['panel p-6', className].join(' ')} {...props}>
      {children}
    </section>
  );
}

export default Card;
