import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAppContext } from '../context/AppContext';

const defaultHex = '#dcd0ff';

/**
 * DropModal
 * Opens as an overlay window when a category ("drop") card is clicked on the
 * Home page. It fetches the category's products and renders them in a grid,
 * with size selection and add-to-cart, mirroring the CategoryPage experience.
 */
export default function DropModal({ category, onClose }) {
  const { handleAddToCart } = useAppContext();

  const [products, setProducts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  useEffect(() => {
    if (!category) return;
    const catId = category.slug || category.categoryId;

    setLoading(true);
    setProducts([]);
    setSubCategories([]);

    const fetchData = async () => {
      try {
        const res = await api.get(`/categories/${catId}`);
        const cat = res.data;

        if (cat.children && cat.children.length > 0) {
          const childRes = await Promise.allSettled(
            cat.children.map((id) => api.get(`/categories/${id}`))
          );
          setSubCategories(
            childRes.filter((r) => r.status === 'fulfilled').map((r) => r.value.data)
          );
        }

        if (cat.products && cat.products.length > 0) {
          const prodRes = await Promise.allSettled(
            cat.products.map((id) => api.get(`/products/${id}`))
          );
          setProducts(
            prodRes.filter((r) => r.status === 'fulfilled').map((r) => r.value.data)
          );
        }
      } catch (err) {
        console.error('Failed to load drop products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!category) return null;

  const catId = category.slug || category.categoryId;

  return (
    <div className="product-modal-backdrop" onClick={onClose}>
      <motion.div
        className="product-modal-content drop-modal-content"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          ×
        </button>

        {/* Drop header */}
        <div className="drop-modal-header">
          <div className="header-meta">
            <span className="marker-circle"></span>
            <span>DROP // {category.name?.toUpperCase()}</span>
          </div>
          <h2 className="header-graffiti" style={{ fontFamily: 'var(--font-wireframe)', margin: 0 }}>
            {category.name?.toUpperCase()}
          </h2>
        </div>

        <div className="drop-modal-body">
          {loading ? (
            <div className="drop-modal-loading">
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ fontFamily: 'var(--font-wireframe)', letterSpacing: '4px', color: 'var(--wire-glow)' }}
              >
                LOADING DROP...
              </motion.span>
            </div>
          ) : (
            <>
              {/* Sub-categories, if any */}
              {subCategories.length > 0 && (
                <div className="drop-modal-subcats">
                  {subCategories.map((sub) => (
                    <Link
                      key={sub.categoryId}
                      to={`/category/${sub.slug || sub.categoryId}`}
                      className="drop-subcat-chip"
                      onClick={onClose}
                    >
                      {sub.name}
                      {sub.products?.length > 0 && (
                        <span className="drop-subcat-count">{sub.products.length}</span>
                      )}
                    </Link>
                  ))}
                </div>
              )}

              {/* Products grid */}
              {products.length > 0 ? (
                <div className="products-grid">
                  {products.map((prod) => {
                    const images =
                      prod.images && prod.images.length > 0
                        ? prod.images
                        : [`https://placehold.co/400x500/111111/dcd0ff?text=${prod.name?.replace(/ /g, '+')}`];
                    const currentImg = images[imgIdx[prod.product_id] || 0];
                    const firstSize =
                      prod.sizes && Object.keys(prod.sizes).length > 0
                        ? Object.entries(prod.sizes)[0]
                        : null;

                    return (
                      <motion.div
                        key={prod.product_id}
                        className="product-card"
                        style={{ '--accent-color': defaultHex }}
                        layout
                      >
                        <div className="product-card-wire"></div>
                        <div className="product-image-container" style={{ position: 'relative' }}>
                          <div className="product-glow-bg" style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: '8px' }}>
                            <img src={currentImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(35px)', opacity: 0.65, transform: 'scale(1.15)' }} />
                          </div>
                          <div className="product-wireframe-placeholder" style={{ position: 'relative' }}>
                            <img
                              src={currentImg}
                              alt={prod.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85, borderRadius: '8px' }}
                            />
                          </div>
                        </div>
                        <div className="product-info">
                          <div className="product-info-top">
                            <h4 className="product-name">{prod.name}</h4>
                            <span className="product-price">₹{firstSize ? firstSize[1].price : '—'}</span>
                          </div>
                          <div className="product-sizes-row">
                            {prod.sizes &&
                              Object.entries(prod.sizes).map(([size, details]) => {
                                const isOutOfStock = details.stock === 0;
                                const isSelected = selectedSizes[prod.product_id] === size;
                                return (
                                  <button
                                    key={size}
                                    className={`size-btn ${isSelected ? 'selected' : ''} ${isOutOfStock ? 'out-of-stock' : ''}`}
                                    onClick={() => !isOutOfStock && handleSizeSelect(prod.product_id, size)}
                                    disabled={isOutOfStock}
                                    title={isOutOfStock ? 'Out of Stock' : `₹${details.price}`}
                                  >
                                    {size}
                                  </button>
                                );
                              })}
                          </div>
                          <div className="product-info-bottom">
                            <span className="product-color" style={{ color: '#aaa', fontSize: '12px' }}>
                              {prod.description?.substring(0, 30)}...
                            </span>
                            <button
                              onClick={() => {
                                const size = selectedSizes[prod.product_id];
                                if (!size) {
                                  alert('Please select a size first.');
                                  return;
                                }
                                handleAddToCart({
                                  ...prod,
                                  price: prod.sizes[size].price,
                                  maxStock: prod.sizes[size].stock,
                                  size: size,
                                  color: defaultHex,
                                  productId: prod.product_id,
                                });
                              }}
                              className={`flex-it-btn ${!selectedSizes[prod.product_id] ? 'disabled' : ''}`}
                            >
                              <span>{selectedSizes[prod.product_id] ? 'Flex It' : 'Select Size'}</span>
                              <span className="btn-arrow-glyph">→</span>
                            </button>
                          </div>
                          {prod.tagline && (
                            <div className="product-tagline-strip">
                              <span className="product-tagline-quote">"</span>
                              <span className="product-tagline-text">{prod.tagline}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                subCategories.length === 0 && (
                  <div className="drop-modal-empty">
                    <p style={{ fontFamily: 'var(--font-wireframe)', letterSpacing: '3px' }}>NO ITEMS YET</p>
                    <p style={{ fontSize: '14px', marginTop: '8px', color: '#666' }}>Check back later for drops in this category.</p>
                  </div>
                )
              )}
            </>
          )}
        </div>

        {/* Footer link to full category page */}
        <div className="drop-modal-footer">
          <Link to={`/category/${catId}`} className="drop-view-all-link" onClick={onClose}>
            View full collection →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
