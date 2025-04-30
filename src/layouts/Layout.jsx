import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import { CategoryProvider, useCategory } from './CategoryContext';

// Header 내부에서 사용할 HeaderWithCategories 컴포넌트
function HeaderWithCategories() {
  const { mainCategories, subCategories, loading } = useCategory();
  
  return (
    <Header 
      maincategories={mainCategories} 
      subCategories={subCategories} 
      loading={loading} 
    />
  );
}

function Layout() {
  return (
    <CategoryProvider>
      <div className="flex flex-col min-h-screen">
        <HeaderWithCategories />
        <main className="flex flex-grow mx-auto w-full max-w-[1300px] px-4">
          <Outlet />
        </main>
        <Footer />
      </div>
    </CategoryProvider>
  );
}

export default Layout;