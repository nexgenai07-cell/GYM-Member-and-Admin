// src/components/shop/ProductCard.jsx
import { motion } from 'framer-motion';

export default function ProductCard({ product, index, onAddToCart }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="flex flex-col bg-surface-container-low rounded-xl overflow-hidden shadow-lg group hover:bg-surface-container transition-all"
    >
      <div className="relative w-full h-72 overflow-hidden bg-surface-container-lowest">
        <img
          src={product.image_url || 'https://via.placeholder.com/400?text=No+Image'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-black/40 pointer-events-none" />

        <div className="absolute top-space-sm left-space-sm flex flex-col gap-space-2xs">
          {product.badge_top && (
            <span
              className={`px-space-xs py-1 rounded font-label-md text-label-md uppercase tracking-wider shadow-md ${
                product.badge_top_accent
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-lowest/90 text-on-surface'
              }`}
            >
              {product.badge_top}
            </span>
          )}
          {product.badge_secondary && (
            <span className="px-space-xs py-1 rounded bg-surface-container-lowest/90 text-on-surface font-label-md text-label-md uppercase tracking-wider">
              {product.badge_secondary}
            </span>
          )}
        </div>

        <div className="absolute top-space-sm right-space-sm flex items-center gap-1 px-space-xs py-1 rounded bg-surface-container-lowest/90 text-on-surface">
          <span
            className="material-symbols-outlined text-primary text-sm"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
          <span className="font-label-md text-label-md font-bold">
            {Number(product.rating).toFixed(1)}
          </span>
          <span className="font-label-md text-label-md text-outline">
            ({product.total_reviews})
          </span>
        </div>

        {Array.isArray(product.telemetry) && product.telemetry.length > 0 && (
          <div className="absolute bottom-space-sm left-space-sm right-space-sm">
            <div className="flex items-center gap-space-xs px-space-xs py-1 rounded bg-surface-container-highest/80 backdrop-blur-sm w-fit">
              {product.telemetry.map((t, i) => (
                <span key={t} className="flex items-center gap-1">
                  {i > 0 && <span className="text-outline">•</span>}
                  <span
                    className={`font-label-md text-label-md ${
                      i === 0 ? 'text-primary font-bold' : 'text-on-surface'
                    }`}
                  >
                    {t}
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-space-md flex flex-col flex-grow justify-between gap-space-md">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="font-label-md text-label-md uppercase text-outline tracking-wider">
              {product.category?.name}
            </span>
            <span
              className={`font-label-md text-label-md uppercase font-bold ${
                product.is_out_of_stock ? 'text-error' : 'text-emerald-400'
              }`}
            >
              {product.is_out_of_stock
                ? 'Out of Stock'
                : product.stock_label || `In Stock (${product.stock_quantity})`}
            </span>
          </div>
          <h3 className="font-title-lg text-title-lg text-on-surface tracking-wide group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 pt-space-xs">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-space-xs">
              <span className="font-headline-md text-headline-md text-on-surface">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.original_price && (
                <span className="font-label-md text-label-md text-outline line-through">
                  ${Number(product.original_price).toFixed(2)}
                </span>
              )}
            </div>
            <span
              className={`font-label-md text-label-md uppercase ${
                product.original_price
                  ? 'text-primary font-bold'
                  : 'text-outline'
              }`}
            >
              {product.price_note}
            </span>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onAddToCart(product)}
            disabled={product.is_out_of_stock}
            className={`font-label-lg text-label-lg uppercase px-space-md py-space-sm rounded transition-all flex items-center gap-space-2xs ${
              product.is_out_of_stock
                ? 'bg-surface-container-high text-outline cursor-not-allowed'
                : 'bg-primary-container hover:bg-secondary-container text-on-primary-container shadow-[0_0_16px_rgba(229,25,55,0.35)]'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-base">
              add_shopping_cart
            </span>
            <span>Add</span>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}