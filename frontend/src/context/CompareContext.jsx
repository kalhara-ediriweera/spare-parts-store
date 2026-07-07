import React, { createContext, useState, useEffect, useContext } from 'react';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState(() => {
    const saved = localStorage.getItem('sparex_compare');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('sparex_compare', JSON.stringify(compareItems));
  }, [compareItems]);

  const toggleCompare = (product) => {
    setCompareItems(prev => {
      const exists = prev.find(item => item._id === product._id);
      if (exists) {
        return prev.filter(item => item._id !== product._id);
      }
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 items at a time.');
        return prev;
      }
      return [...prev, product];
    });
  };

  const isInCompare = (productId) => {
    return compareItems.some(item => item._id === productId);
  };

  const clearCompare = () => setCompareItems([]);

  return (
    <CompareContext.Provider value={{ compareItems, toggleCompare, isInCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);
export default CompareContext;
