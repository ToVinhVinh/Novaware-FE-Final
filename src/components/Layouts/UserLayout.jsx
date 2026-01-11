import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Header from '../Header.jsx';
import Footer from '../Footer.jsx';
import CartPreview from '../Drawer/CartPreview.jsx';
import Chat from '../Drawer/Chat.jsx';
import SnackbarMessage from '../SnackbarMessage.jsx';
import ChatAi from '../Drawer/ChatAi.jsx';
import LoginModal from '../Modal/LoginModal.jsx';
import RegisterModal from '../Modal/RegisterModal.jsx';
import ForgotPasswordModal from '../Modal/ForgotPasswordModal.jsx';
import ResetPasswordModal from '../Modal/ResetPasswordModal.jsx';
import FavoritePreview from '../Drawer/FavoritePreview.jsx';

const UserLayout = ({ children, setHasNewMessageRef }) => {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [resetToken, setResetToken] = useState(null);
  const userVerifyCode = useSelector((state) => state.userVerifyCode);
  const { success: verifySuccess, resetToken: verifyResetToken } = userVerifyCode;

  useEffect(() => {
    if (verifySuccess) {
      setResetToken(verifyResetToken);
      setForgotPasswordModalOpen(false);
      setResetPasswordModalOpen(true);
    }
  }, [verifySuccess, verifyResetToken]);

  return (
    <>
      <Header
        setLoginModalOpen={() => setLoginModalOpen(true)}
        setRegisterModalOpen={() => setRegisterModalOpen(true)}
        setForgotPasswordModalOpen={() => setForgotPasswordModalOpen(true)}
      />
      <main className="main">{children}</main>
      <CartPreview />
      <FavoritePreview />
      <ChatAi />
      <Chat setHasNewMessageRef={setHasNewMessageRef} />
      <SnackbarMessage />
      <LoginModal
        open={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        setRegisterModalOpen={() => setRegisterModalOpen(true)}
        setForgotPasswordModalOpen={() => setForgotPasswordModalOpen(true)}
      />
      <RegisterModal
        open={isRegisterModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        setLoginModalOpen={() => setLoginModalOpen(true)}
      />
      <ForgotPasswordModal
        open={isForgotPasswordModalOpen}
        onClose={() => setForgotPasswordModalOpen(false)}
      />
      <ResetPasswordModal
        open={isResetPasswordModalOpen}
        onClose={() => setResetPasswordModalOpen(false)}
        resetTokenFromProp={resetToken}
      />
      <Footer />
    </>
  );
};

export default UserLayout;

