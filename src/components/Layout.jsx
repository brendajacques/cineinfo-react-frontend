import Header from './Header.jsx';
import Footer from './Footer.jsx';

function Layout({ children, fullWidth = false }) {
  return (
    <div className="flex min-h-screen flex-col bg-cinema-black text-cinema-popcorn">
      <Header />
      {fullWidth ? (
        <main className="flex-1 w-full">
          {children}
        </main>
      ) : (
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      )}
      <Footer />
    </div>
  );
}

export default Layout;
