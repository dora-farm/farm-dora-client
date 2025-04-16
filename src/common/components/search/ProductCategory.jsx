import React from 'react';

const ProductCategory = ({category, setCategory, subCategory, setSubCategory, bigCategories, smallCategoriesFiltered}) => {
    return (
        <div className="flex items-center mb-5">
          <div className="w-24 font-medium">카테고리</div>
          <div className="w-48 mr-3">
            <select
              className="w-full border rounded px-3 py-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">대분류 선택</option>
              {bigCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <div className="w-48">
            <select
              className="w-full border rounded px-3 py-2"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              disabled={!category}
            >
              <option value="">소분류 선택</option>
              {smallCategoriesFiltered.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
    );
};

export default ProductCategory;