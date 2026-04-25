import React, { useState } from "react";

const products = [
  { id: 1, name: "Product 1", price: 90, oldPrice: 100 },
  { id: 2, name: "Product 2", price: 94.5, oldPrice: 105 },
  { id: 3, name: "Product 3", price: 99, oldPrice: 110 },
  { id: 4, name: "Product 4", price: 88, oldPrice: 120 },
  { id: 5, name: "Product 5", price: 70, oldPrice: 95 },
  { id: 6, name: "Product 6", price: 120, oldPrice: 150 },
];

export default function YouMayAlsoLike() {
  const [page, setPage] = useState(0);
  const [view, setView] = useState("desktop");

  const visibleCount = 3;
  const totalPages = Math.ceil(products.length / visibleCount);

  const next = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const prev = () => {
    if (page > 0) setPage(page - 1);
  };

  const pages = [];
  for (let i = 0; i < totalPages; i++) {
    const start = i * visibleCount;
    pages.push(products.slice(start, start + visibleCount));
  }

  const Header = () => (
    <div className="header">
      <h2 className="title">You may also like</h2>
      <div className="nav">
        <button className="nav-btn" onClick={prev} disabled={page === 0}>◀</button>
        <button className="nav-btn" onClick={next} disabled={page === totalPages - 1}>▶</button>
      </div>
    </div>
  );

  const Slider = () => (
    <div className="viewport">
      <div
        className="track"
        style={{ transform: `translate3d(-${page * 100}%, 0, 0)` }}
      >
        {pages.map((group, i) => (
          <div key={i} className="page">
            {group.map((product) => (
              <div key={product.id} className="card">
                <div className="image-placeholder" />
                <div className="info">
                  <p className="name">{product.name}</p>
                  <div className="price-row">
                    <span className="price">${product.price.toFixed(2)}</span>
                    <span className="old-price">${product.oldPrice.toFixed(2)}</span>
                  </div>
                </div>
                <button className="add-btn">+ Add</button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container">
      <div className="top-bar">
        <div className="view-toggle">
          <button className={`icon-btn desktop-icon ${view === "desktop" ? "active" : ""}`} onClick={() => setView("desktop")}>🖥️</button>
          <button className={`icon-btn mobile-icon ${view === "mobile" ? "active" : ""}`} onClick={() => setView("mobile")}>📱</button>
        </div>
      </div>

      {view === "desktop" ? (
        <div className="desktop-wrapper">
          <Header />
          <Slider />
        </div>
      ) : (
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

        .container { background: var(--bg); padding: 20px; max-width: 900px; margin: auto; font-family: Arial; }

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
          height: 72px;
          display: flex; 
          align-items: center; 
          justify-content: space-between;
          background: var(--card-bg);
          border: 1px solid var(--border);
          padding: 12px;
          margin-bottom: 10px;
          box-sizing: border-box; /* Ensure padding doesn't overflow */
        }

        .top-bar { display: flex; justify-content: flex-end; margin-bottom: 10px; }
        .view-toggle { display: flex; gap: 6px; }

        .icon-btn { border: 1px solid var(--border); background: white; cursor: pointer; padding: 5px; }
        .icon-btn.active { border-color: black; background: #eee; }

        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .nav { display: flex; gap: 6px; }
        .nav-btn { width: 30px; height: 30px; border: 1px solid var(--border); background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .phone-frame { width: 360px; margin: 20px auto; border: 12px solid #000; border-radius: 36px; background: #000; position: relative; overflow: hidden; }
        .notch { width: 120px; height: 18px; background: #000; border-bottom-left-radius: 15px; border-bottom-right-radius: 15px; position: absolute; top: 0; left: 50%; transform: translateX(-50%); z-index: 10; }
        .screen { background: #fff; height: 600px; padding: 20px 15px; overflow-y: auto; }

        .image-placeholder { width: 50px; height: 50px; background: #ddd; border-radius: 4px; flex-shrink: 0; }
        .info { flex: 1; margin-left: 12px; }
        .name { margin: 0 0 4px 0; font-size: 14px; font-weight: 500; }
        .price { color: var(--green); font-weight: bold; font-size: 14px; }
        .old-price { text-decoration: line-through; color: var(--muted); font-size: 11px; margin-left: 5px; }
        .add-btn { background: var(--btn-bg); color: var(--btn-text); border: none; padding: 8px 14px; font-size: 12px; cursor: pointer; font-weight: bold; border-radius: 2px; }
      `}</style>
    </div>
  );
}