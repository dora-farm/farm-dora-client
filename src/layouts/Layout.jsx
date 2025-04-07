import Footer from './Footer'
import Header from './Header'
import UserSidebar from "./UserSidebar.jsx";

function Layout({children}) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header/>
            <main className="flex-grow mx-auto w-full max-w-[1300px] px-4">
                {/*{children}*/}
                <UserSidebar></UserSidebar>
            </main>
            <Footer/>
        </div>
    );
}

export default Layout;