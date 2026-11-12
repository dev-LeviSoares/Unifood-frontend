import { useId, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";
import "../../styles/logout-confirmation.css";

export function LogoutConfirmation({ children, ...props }) {
  const dialog = useRef(null);
  const titleId = useId();
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <>
      <button
        type="button"
        {...props}
        onClick={() => dialog.current.showModal()}
      >
        {children}
      </button>
      {createPortal(
        <dialog
          ref={dialog}
          className="logout-confirmation"
          aria-labelledby={titleId}
        >
          <h2 id={titleId}>Sair da conta?</h2>
          <p>Tem certeza de que deseja sair da sua conta?</p>
          <div className="logout-confirmation-actions">
            <button
              type="button"
              autoFocus
              onClick={() => dialog.current.close()}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="logout-confirmation-primary"
              onClick={() => {
                dialog.current.close();
                logout();
                navigate(ROUTES.LOGIN, { replace: true });
              }}
            >
              Sair
            </button>
          </div>
        </dialog>,
        document.body,
      )}
    </>
  );
}
