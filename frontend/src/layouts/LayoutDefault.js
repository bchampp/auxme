import React from 'react';
// import Footer from '../components/layout/Footer';

const LayoutDefault = ({ children }) => (
  <>
    <main style={{height: "100vh"}} className="site-content">
      {children}
    </main>
    {/* <Footer /> */}
  </>
);

export default LayoutDefault; 