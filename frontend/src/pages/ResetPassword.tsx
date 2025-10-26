import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleReset() {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setMessage("❌ Erreur : " + error.message);
    else setMessage("✅ Mot de passe modifié avec succès !");
  }

  return (
    <div style={{ maxWidth: 400, margin: "60px auto", textAlign: "center" }}>
      <h2>Réinitialiser votre mot de passe</h2>
      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />
      <button onClick={handleReset} style={{ marginTop: 20 }}>
        Modifier le mot de passe
      </button>
      <p style={{ marginTop: 15 }}>{message}</p>
    </div>
  );
}
