export function LoadingState() {
  return (
    <div className="loading" role="status">
      <span />
      Curating the collection…
    </div>
  );
}

export function ErrorState({
  message,
  retry,
}: {
  message: string;
  retry?: () => void;
}) {
  return (
    <section className="page-state" role="alert">
      <h2>We hit a small snag.</h2>
      <p>{message}</p>
      {retry && (
        <button className="button" onClick={retry}>
          Try again
        </button>
      )}
    </section>
  );
}
