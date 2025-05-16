import React, { createContext, useContext, useState } from 'react';

const MyListContext = createContext();

export const useMyList = () => useContext(MyListContext);

export const MyListProvider = ({ children }) => {
  const [myList, setMyList] = useState([]);

  // 중복 방지
  const addToMyList = (item) => {
    setMyList(prev =>
      prev.find(i => i.id === item.id && i.type === item.type)
        ? prev
        : [...prev, item]
    );
  };

  const removeFromMyList = (id, type) => {
    setMyList(prev => prev.filter(i => !(i.id === id && i.type === type)));
  };

  return (
    <MyListContext.Provider value={{ myList, addToMyList, removeFromMyList }}>
      {children}
    </MyListContext.Provider>
  );
};
