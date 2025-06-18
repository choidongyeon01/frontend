import React, { createContext, useContext, useState, useEffect } from 'react';

const MyListContext = createContext();

const STORAGE_KEY = 'myListsByProfile';

export const MyListProvider = ({ children, currentProfileId }) => {
  // 프로필별로 myList를 저장
  const [myListsByProfile, setMyListsByProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(myListsByProfile));
  }, [myListsByProfile]);

  // 현재 프로필의 myList만 제공
  const myList = currentProfileId ? (myListsByProfile[currentProfileId] || []) : [];

  // 추가
  const addToMyList = (item) => {
    if (!currentProfileId) return;
    setMyListsByProfile(prev => {
      const currentList = prev[currentProfileId] || [];
      if (currentList.some(i => i.id === item.id && i.type === item.type)) return prev;
      return {
        ...prev,
        [currentProfileId]: [...currentList, item]
      };
    });
  };

  // 삭제
  const removeFromMyList = (id, type) => {
    if (!currentProfileId) return;
    setMyListsByProfile(prev => {
      const currentList = prev[currentProfileId] || [];
      return {
        ...prev,
        [currentProfileId]: currentList.filter(item => !(item.id === id && item.type === type))
      };
    });
  };

  return (
    <MyListContext.Provider value={{ myList, addToMyList, removeFromMyList }}>
      {children}
    </MyListContext.Provider>
  );
};

export const useMyList = () => useContext(MyListContext);
