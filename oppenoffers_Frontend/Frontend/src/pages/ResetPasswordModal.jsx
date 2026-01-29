import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TextInput from "../components/FormElements/TextInput";
import { useResetPassword } from "../hooks/useLogin";
import { useToast } from '../hooks/useToast';


export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [localError, setLocalError] = useState("");
  const { showToast } = useToast();
  const adminId = localStorage.getItem('forgotAdminId');
  

  const [loading, setLoading] = useState(false);

  const { resetPassword, error, message } = useResetPassword();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      setResetToken(token);
      console.log("Reset Token:", token);
    } else {
      alert("Reset Token not found !");
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    
    if(!adminId){
      showToast('Vous devez être authentifié pour réinitialiser le mot de passe');
      localStorage.clear();
      navigate('/invalid');
      return;
    } 

    if (!password || !confirmPassword) {
      setLocalError("Tous les champs sont obligatoires");
      return;
    }

    if (password.length < 6) {
      setLocalError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Les mots de passe ne correspondent pas");
      return;
    }

    try{
      setLoading(true);
      await resetPassword (adminId, password);
      //REMOVE THE ADMIN ID AFTER THE PASSWORD RECOVER
      localStorage.clear();
      setLoading(false);
      if(!error) {
        showToast("Le mot de passe a été modifié avec succès");
        navigate("/");
      }
    } catch (err) {
       console.error(err);
    }
  };

  if (!resetToken) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
        <p className="text-red-600 text-center text-lg">
          Lien invalide ou expiré
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-center mb-4">
          Réinitialiser le mot de passe
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            type="password"
            label="Nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextInput
            type="password"
            label="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {localError && <p className="text-red-600 text-sm">{localError}</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {message && <p className="text-green-600 text-sm">{message}</p>}

          <div className="flex gap-3">
            <button
              type="reset"
              onClick={() => {
                setPassword("");
                setConfirmPassword("");
                setLocalError("");
              }}
              className="w-1/2 border rounded-lg py-2"
              disabled={loading}
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-1/2 bg-slate-700 text-white rounded-lg py-2"
            >
              {loading ? "En cours..." : "Réinitialiser"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
