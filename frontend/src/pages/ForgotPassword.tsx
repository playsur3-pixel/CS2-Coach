import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // ✅ On marque la fonction async
  const handleForgotPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://cs2-coaching.netlify.app/reset-password", // 👈 redirection correcte
    });

    if (error) setMessage("❌ Erreur : " + error.message);
    else setMessage("📩 Un e-mail de réinitialisation a été envoyé !");
  };

  return (
    <div style={{ maxWidth: 400, margin: "60px auto", textAlign: "center" }}>
      <h2>Mot de passe oublié</h2>
      <input
        type="email"
        placeholder="Votre adresse e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />
      <button onClick={handleForgotPassword} style={{ marginTop: 20 }}>
        Réinitialiser le mot de passe
      </button>
      <p style={{ marginTop: 15 }}>{message}</p>
    </div>
  );
}
