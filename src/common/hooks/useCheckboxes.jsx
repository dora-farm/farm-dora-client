// src/hooks/useCheckboxes.js
import { useState, useCallback } from 'react';

export function useCheckboxes(initialItems = [], itemIdKey = 'id') { // 전해져 온 값이 있는 경우 id 대신 해당 값으로 사용
  const [items, setItems] = useState(initialItems);
  const [isAllChecked, setIsAllChecked] = useState(false);
  
  // 전체 선택/해제 핸들러
  const handleAllCheck = useCallback((event) => {
    const checked = event.target.checked;
    setIsAllChecked(checked);
    
    // 모든 상품의 체크박스 상태 업데이트
    const updatedItems = items.map(item => ({
      ...item, 
      isChecked: checked
    }));
    
    setItems(updatedItems);
  }, [items]);

  // 개별 상품 체크박스 핸들러
  const handleItemCheck = useCallback((id) => {
    const updatedItems = items.map(item => 
      item[itemIdKey] === id 
        ? { ...item, isChecked: !item.isChecked } 
        : item
    );
    
    setItems(updatedItems);
    
    // 전체 선택 상태 업데이트
    const allChecked = updatedItems.every(item => item.isChecked);
    setIsAllChecked(allChecked);
  }, [items, itemIdKey]);

  // 선택된 항목 ID 배열 가져오기
  const getSelectedIds = useCallback(() => {
    return items
      .filter(item => item.isChecked)
      .map(item => item[itemIdKey]);
  }, [items, itemIdKey]);

  // 외부에서 아이템 목록 업데이트
  const updateItems = useCallback((newItems) => {
    setItems(newItems);
    setIsAllChecked(false);
  }, []);
  
  return {
    items,
    setItems: updateItems,
    isAllChecked,
    handleAllCheck,
    handleItemCheck,
    getSelectedIds
  };
}