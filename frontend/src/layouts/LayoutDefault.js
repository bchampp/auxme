import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const LayoutDefault = ({ children }) => (
  <>
    <Header navPosition="right" className="reveal-from-bottom" />
    <main className="site-content">
      {children}
    </main>
    aws cognito-idp admin-confirm-sign-up \
    --region ca-central-1 \
    --user-pool-id ca-central-1_GTccCETrZ \
    --username admin@example.com
    <Footer />
  </>
);

export default LayoutDefault; 