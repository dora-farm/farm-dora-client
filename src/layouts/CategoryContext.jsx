import { createContext, useState, useContext, useEffect } from 'react';
import { fetchWithAuth } from '../common/utils/fetchWithAuth';

const CategoryContext = createContext();

export function CategoryProvider({ children }) {
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchWithAuth(`${import.meta.env.VITE_SEARCH_REST_API_URL}/api/search/category`);
        const result = await response.json();
        
        if (result.status === 200 && result.data) {
          const mainCategoriesData = result.data.map(item => ({
            type_big_id: item.bigCategoryId,
            name: item.name
          }));
          setMainCategories(mainCategoriesData);
          
          const allSubCategories = [];
          result.data.forEach(mainCat => {
            const mappedSubCats = mainCat.categories.map(subCat => ({
              type_id: subCat.categoryId,
              type_big_id: mainCat.bigCategoryId,
              name: subCat.name
            }));
            allSubCategories.push(...mappedSubCats);
          });
          setSubCategories(allSubCategories);
        }
      } catch (error) {
        console.error('카테고리 데이터 로드 실패', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider 
      value={{ 
        mainCategories, 
        subCategories, 
        loading,
        getMainCategoryById: (id) => mainCategories.find(cat => cat.type_big_id === id),
        getSubCategoryById: (id) => subCategories.find(cat => cat.type_id === id),
        getSubCategoriesByMainId: (mainId) => subCategories.filter(cat => cat.type_big_id === mainId)
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

// Hook을 생성하여 다른 컴포넌트에서 쉽게 접근할 수 있도록 함
export function useCategory() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategory는 CategoryProvider 내부에서 사용해야 합니다');
  }
  return context;
}