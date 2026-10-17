export function CatalogSkeleton() {
  return (
    <div
      className="uf-product-grid"
      role="status"
      aria-label="Carregando cardápio"
    >
      {[1, 2, 3, 4].map((item) => (
        <div className="uf-skeleton" key={item} />
      ))}
    </div>
  );
}
