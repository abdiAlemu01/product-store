import { useState } from "react";
import { LogInIcon, UserPlusIcon, XIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

function AuthModal() {
  const { registerCustomer, loginWithPhone, loading } = useAuthStore();
  const [mode, setMode] = useState("login");
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    phoneNumber: "",
    password: "",
  });

  const closeModal = () => {
    document.getElementById("auth_modal")?.close();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    await loginWithPhone(loginPhone, loginPassword);
    closeModal();
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    await registerCustomer(registerForm);
    closeModal();
  };

  return (
    <dialog id="auth_modal" className="modal">
      <div className="modal-box max-w-xl">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            <XIcon className="size-4" />
          </button>
        </form>

        <div className="flex items-center gap-3 mb-6">
          <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            {mode === "login" ? (
              <LogInIcon className="size-6 text-primary" />
            ) : (
              <UserPlusIcon className="size-6 text-primary" />
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold">
              {mode === "login" ? "Sign IN" : "Kara galmee maamiltoota"}
            </h3>
          </div>
        </div>

        <div className="tabs tabs-boxed mb-6">
          <button
            type="button"
            className={`tab ${mode === "login" ? "tab-active" : ""}`}
            onClick={() => setMode("login")}
          >
            SEENA
          </button>
          <button
            type="button"
            className={`tab ${mode === "register" ? "tab-active" : ""}`}
            onClick={() => setMode("register")}
          >
            GALMA'A
          </button>
        </div>

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Lakk.Bilbila</span>
              </label>
              <input
                type="tel"
                className="input input-bordered w-full"
                placeholder="Lakk.Bilbila galcha...."
                value={loginPhone}
                onChange={(e) => setLoginPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <input
                type="password"
                className="input input-bordered w-full"
                placeholder="password galcha...."
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              SEENA
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Maqaa keessan</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Maqaa keessan galcha...."
                value={registerForm.fullName}
                onChange={(e) =>
                  setRegisterForm((currentForm) => ({
                    ...currentForm,
                    fullName: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Lakk.Bilbila</span>
              </label>
              <input
                type="tel"
                className="input input-bordered w-full"
                placeholder="Lakk.Bilbila galcha...."
                value={registerForm.phoneNumber}
                onChange={(e) =>
                  setRegisterForm((currentForm) => ({
                    ...currentForm,
                    phoneNumber: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <input
                type="password"
                className="input input-bordered w-full"
                placeholder="password galcha...."
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm((currentForm) => ({
                    ...currentForm,
                    password: e.target.value,
                  }))
                }
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              GALMA'A
            </button>
          </form>
        )}
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default AuthModal;
