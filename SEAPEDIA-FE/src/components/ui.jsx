import React from "react";

export function Button({ children, variant = "primary", className = "", ...props }) {
  const base =
    "w-full py-2.5 rounded-lg font-semibold transition disabled:opacity-50";
  const variants = {
    primary: "bg-seapedia text-white hover:bg-seapedia-dark",
    accent: "bg-accent text-white hover:opacity-90",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export const Input = React.forwardRef(({ label, iconLeft, iconRight, error, className = "", ...props }, ref) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {iconLeft && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            {iconLeft}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full ${iconLeft ? 'pl-10' : 'px-3'} ${iconRight ? 'pr-10' : 'pr-3'} py-2.5 bg-white text-gray-900 border ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-seapedia focus:border-seapedia'} rounded-lg focus:outline-none focus:ring-2 text-sm transition-colors`}
          {...props}
        />
        {iconRight && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer">
            {iconRight}
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1.5 font-medium">{error}</p>}
    </div>
  );
});
Input.displayName = "Input";

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      {children}
    </div>
  );
}