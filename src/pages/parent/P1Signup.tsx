import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBonkoo } from '../../state/context';
import { ArrowLeft } from 'lucide-react';

export default function P1Signup() {
  const { dispatch } = useBonkoo();
  const navigate = useNavigate();
  const [prénom, setPrénom] = useState('');
  const [courriel, setCourriel] = useState('');
  const [mdp, setMdp] = useState('');
  const [foyer, setFoyer] = useState('');

  const valid = prénom.trim() && courriel.includes('@') && mdp.length >= 6 && foyer.trim();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    // Réinitialise vers état vierge puis enregistre
    dispatch({ type: 'RESET' });
    setTimeout(() => {
      dispatch({ type: 'SIGNUP', parent: { prénom, courriel, rôle: 'admin' }, foyerNom: foyer });
      sessionStorage.setItem('bk:unlocked', '1');
      navigate('/parent/onboarding');
    }, 0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-bk-cream to-bk-sand/40">
      <div className="card p-6 md:p-8 max-w-md w-full">
        <button className="text-bk-mute text-sm mb-3 flex items-center gap-1" onClick={() => navigate('/')}>
          <ArrowLeft size={14} /> Retour
        </button>
        <h1 className="text-2xl font-bold mb-1">Créer ton compte</h1>
        <p className="text-bk-mute text-sm mb-6">Étape 1 sur 2 — ton compte et le nom du foyer.</p>
        <form className="space-y-3" onSubmit={submit}>
          <div>
            <label className="label">Ton prénom</label>
            <input className="input" value={prénom} onChange={e => setPrénom(e.target.value)} placeholder="Alex" />
          </div>
          <div>
            <label className="label">Courriel</label>
            <input className="input" type="email" value={courriel} onChange={e => setCourriel(e.target.value)} placeholder="parent@exemple.ca" />
          </div>
          <div>
            <label className="label">Mot de passe (6 caractères min)</label>
            <input className="input" type="password" value={mdp} onChange={e => setMdp(e.target.value)} />
          </div>
          <div>
            <label className="label">Nom du foyer</label>
            <input className="input" value={foyer} onChange={e => setFoyer(e.target.value)} placeholder="Famille Tremblay" />
          </div>
          <button type="submit" className="btn-primary w-full mt-4" disabled={!valid}>
            Continuer
          </button>
        </form>
        <p className="text-xs text-bk-mute mt-4">
          Aucune donnée n'est envoyée à l'extérieur. Proto en mémoire locale seulement.
        </p>
      </div>
    </div>
  );
}
