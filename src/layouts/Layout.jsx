import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';

function Layout() {
  const [maincategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 대분류 카테고리 가져오기
    const fetchMainCategories = async () => {
      try {
        const response = await fetch('/mock/option-type-big.json');
        const data = await response.json();
        setMainCategories(data);
      } catch (error) {
        console.error('대분류 카테고리 로드 실패 ', error);
      }
    };

    // 소분류 카테고리 가져오기
    const fetchSubCategories = async () => {
      try {
        const response = await fetch('/mock/option-type.json');
        const data = await response.json();
        setSubCategories(data);
      } catch (error) {
        console.error('소분류 카테고리 로드 실패 ', error);
      }
    };

    fetchMainCategories();
    fetchSubCategories();
    setLoading(false);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        maincategories={maincategories} 
        subCategories={subCategories} 
        loading={loading} 
      />
      <main className="flex flex-grow mx-auto w-full max-w-[1300px] px-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;