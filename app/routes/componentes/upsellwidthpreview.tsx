import React, { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  variants: string[];
  image?: string;
};

type ViewMode = "desktop" | "mobile";

export type PreviewProduct = {
  id: string;
  title: string;
  image?: string;
  variants?: string[];
};

const products: Product[] = [
  {
    id: 1,
    name: "Product 1",
    price: 90,
    oldPrice: 100,
    variants: ["Small", "Medium", "Large"],
  },
  {
    id: 2,
    name: "Product 2",
    price: 94.5,
    oldPrice: 105,
    variants: ["Black", "Blue", "Gray"],
  },
  {
    id: 3,
    name: "Product 3",
    price: 99,
    oldPrice: 110,
    variants: ["Pack of 1", "Pack of 2", "Pack of 3"],
  },
  {
    id: 4,
    name: "Product 4",
    price: 88,
    oldPrice: 120,
    variants: ["250 ml", "500 ml", "1 L"],
  },
  {
    id: 5,
    name: "Product 5",
    price: 70,
    oldPrice: 95,
    variants: ["Red", "Green", "White"],
  },
  {
    id: 6,
    name: "Product 6",
    price: 120,
    oldPrice: 150,
    variants: ["Single", "Duo", "Family"],
  },
];

type YouMayAlsoLikeProps = {
  // Products received from the editor's "Customer gets" selection.
  selectedProducts?: PreviewProduct[];
};

export default function YouMayAlsoLike({
  selectedProducts = [],
}: YouMayAlsoLikeProps): React.JSX.Element {
  // If editor data exists use that, otherwise fall back to local mock products.
  const previewProducts: Product[] =
    selectedProducts.length > 0
      ? selectedProducts.map((product, index) => ({
          id: index + 1,
          name: product.title,
          price: 90 + index * 5,
          oldPrice: 100 + index * 5,
          variants: product.variants ?? [],
          image: product.image,
        }))
      : products;

  // Slider page, frame type, and currently selected variant per preview card.
  const [page, setPage] = useState<number>(0);
  const [view, setView] = useState<ViewMode>("desktop");
  const [selectedVariants, setSelectedVariants] = useState<
    Record<number, string>
  >(
    Object.fromEntries(
      previewProducts.map((product) => [product.id, product.variants[0] ?? ""]),
    ),
  );

  // Reset preview state when selected products coming from the editor change.
  useEffect(() => {
    setSelectedVariants(
      Object.fromEntries(
        previewProducts.map((product) => [product.id, product.variants[0] ?? ""]),
      ),
    );
    setPage(0);
  }, [selectedProducts]);

  // Basic pagination math for showing 3 preview cards at a time.
  const visibleCount = 3;
  const totalPages = Math.ceil(previewProducts.length / visibleCount);

  const next = (): void => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const prev = (): void => {
    if (page > 0) setPage(page - 1);
  };

  // Updates a single card's currently chosen variant.
  const selectVariant = (productId: number, variant: string): void => {
    setSelectedVariants((current) => ({ ...current, [productId]: variant }));
  };

  // Breaks the product list into pages for the slider track.
  const pages: Product[][] = [];
  for (let i = 0; i < totalPages; i++) {
    const start = i * visibleCount;
    pages.push(previewProducts.slice(start, start + visibleCount));
  }

  // Small decorative blocks used above and below the preview.
  const PreviewContanier = (): React.JSX.Element => (
    <div className="preview-container">
      <div className="header-box dark-box">
        <div className="line long-line"></div>
      </div>
      <div className="header-box light-box">
        <div className="line short-line"></div>
      </div>
    </div>
  );

  // Preview title and previous/next controls.
  const Header = (): React.JSX.Element => (
    <div>
      <PreviewContanier />

      <div className="header">
        <h2 className="title">You may also like</h2>
        <div className="nav">
          <button className="nav-btn" onClick={prev} disabled={page === 0}>
            {"<"}
          </button>
          <button
            className="nav-btn"
            onClick={next}
            disabled={page === totalPages - 1}
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );

  // Main sliding preview list.
  const Slider = (): React.JSX.Element => (
    <div className="viewport">
      <div
        className="track"
        style={{ transform: `translate3d(-${page * 100}%, 0, 0)` }}
      >
        {pages.map((group, index) => (
          <div key={index} className="page">
            {group.map((product) => (
              <div key={product.id} className="card">
                {/* Real product image if available, otherwise placeholder. */}
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                ) : (
                  <div className="image-placeholder" />
                )}
                <div className="info">
                  <p className="name">{product.name}</p>

                  {/* Variant dropdown should only appear when real variants exist. */}
                  {product.variants.length > 0 ? (
                    <div style={{ width: "40%" }} className="variant-select">
                      <s-select
                        value={selectedVariants[product.id]}
                        onChange={(event) =>
                          selectVariant(
                            product.id,
                            (
                              event.currentTarget as HTMLElement & {
                                value?: string;
                              }
                            ).value ?? product.variants[0],
                          )
                        }
                      >
                        {product.variants.map((variant) => (
                          <s-option key={variant} value={variant}>
                            {variant}
                          </s-option>
                        ))}
                      </s-select>
                    </div>
                  ) : null}

                  <div className="price-row">
                    <span className="price">${product.price.toFixed(2)}</span>
                    <span className="old-price">
                      ${product.oldPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button className="add-btn">+ Add</button>
              </div>
            ))}
          </div>
        ))}
      </div>

      <PreviewContanier />
    </div>
  );

  return (
    <div className="container">
      {/* Desktop/mobile frame switcher */}
      <div className="top-bar">
        <div className="view-toggle">
          <div style={{ display: "flex", gap: "10px" }}>
            <div
              onClick={() => setView("desktop")}
              style={{
                background: "#ffff",
                padding: "10px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              <s-icon type="desktop" size="base" />
            </div>

            <div
              onClick={() => setView("mobile")}
              style={{
                background: "#ffff",
                padding: "10px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              <s-icon type="mobile" size="base" />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop frame */}
      {view === "desktop" ? (
        <div className="desktop-wrapper">
          <Header />
          <Slider />
        </div>
      ) : (
        /* Mobile phone frame */
        <div className="phone-frame">
          <div className="notch" />
          <div className="screen">
            <Header />
            <Slider />
          </div>
        </div>
      )}

      <style>{`
        :root {
          --bg: #f5f5f5;
          --card-bg: #ffffff;
          --border: #e5e5e5;
          --muted: #777;
          --green: #1a9c5a;
          --btn-bg: #000;
          --btn-text: #fff;
        }

        .container {
          background: var(--bg);
          padding: 20px;
          max-width: 900px;
          margin: auto;
          font-family: Arial, sans-serif;
        }

        .top-bar {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 10px;
        }

        .view-toggle {
          display: flex;
          gap: 6px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .title {
          margin: 0;
          font-size: 22px;
        }

        .nav {
          display: flex;
          gap: 6px;
        }

        .nav-btn {
          width: 30px;
          height: 30px;
          border: 1px solid var(--border);
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .viewport {
          overflow: hidden;
          width: 100%;
          position: relative;
        }

        .track {
          display: flex;
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
        }

        .page {
          min-width: 100%;
          flex-shrink: 0;
        }

        .card {
          min-height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          background: var(--card-bg);
          border: 1px solid var(--border);
          padding: 12px;
          margin-bottom: 10px;
          box-sizing: border-box;
        }

        .image-placeholder {
          width: 80px;
          height: 80px;
          background: #ddd;
          border-radius: 4px;
          flex-shrink: 0;
        }

        .product-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 4px;
          flex-shrink: 0;
        }

        .info {
          flex: 1;
          margin-left: 12px;
        }

        .name {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 500;
        }

        .variant-select {
          margin-top: 8px;
        }

        .price-row {
          margin-top: 8px;
        }

        .price {
          color: var(--green);
          font-weight: bold;
          font-size: 14px;
        }

        .old-price {
          text-decoration: line-through;
          color: var(--muted);
          font-size: 11px;
          margin-left: 5px;
        }

        .add-btn {
          background: var(--btn-bg);
          color: var(--btn-text);
          border: none;
          padding: 8px 14px;
          font-size: 12px;
          cursor: pointer;
          font-weight: bold;
          border-radius: 2px;
          flex-shrink: 0;
        }

        .phone-frame {
          width: 360px;
          margin: 20px auto;
          border: 12px solid #000;
          border-radius: 36px;
          background: #000;
          position: relative;
          overflow: hidden;
        }

        .notch {
          width: 120px;
          height: 18px;
          background: #000;
          border-bottom-left-radius: 15px;
          border-bottom-right-radius: 15px;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
        }

        .screen {
          background: #fff;
          height: 600px;
          padding: 20px 15px;
          overflow-y: auto;
        }

        .preview-container {
          margin: 20px 0;
          opacity: 0.5;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .preview-container:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: 0.3s ease;
        }

        .header-box {
          width: 100%;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
        }

        .dark-box {
          background-color: #d1d1d1;
        }

        .light-box {
          background-color: #ffffff;
          border: 1px solid #e0e0e0;
        }

        .line {
          height: 6px;
          background-color: #f0f0f0;
          border-radius: 10px;
        }

        .long-line {
          width: 40%;
        }

        .short-line {
          width: 30%;
          background-color: #e0e0e0;
        }
      `}</style>
    </div>
  );
}
