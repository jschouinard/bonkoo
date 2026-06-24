import { useState } from 'react';
import { useBonkoo } from '../../state/context';
import { clearState } from '../../utils/persistence';
import { useNavigate } from 'react-router-dom';
import { Settings, Lock, Moon, Bell, RotateCcw } from 'lucide-react';

// P8 — Réglages du foyer (D8 heure_coucher, NIP, plancher, notifs, reset)
export default function P8Settings() {
  const { state, dispatch } = useBonkoo();
  const navigate = useNavigate();
  const f = state.famille;
  const [editNip, setEditNip] = useState(false);
  const [nipDraft, setNipDraft] = useState(f.nip);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="max-w-2xl mx-auto text-white">
      <div className="flex items-center gap-3 mb-1">
        <Settings className="text-bk-primary" />
        <h1 className="font-display font-extrabold text-3xl">Réglages</h1>
      </div>
      <p className="text-bk-parentMute text-sm font-semibold mb-5">
        Configure ton foyer et le rythme de la journée Bonkoo.
      </p>

      {/* Heure de coucher (D8) */}
      <div className="card p-4 mb-3">
        <div className="flex items-center gap-3 mb-2">
          <Moon className="text-bk-level" />
          <div className="flex-1">
            <div className="font-display font-bold text-base">Heure de coucher</div>
            <div className="text-[11px] uppercase tracking-techno font-bold text-bk-parentMute mt-0.5">
              Bascule de la « journée Bonkoo » (D8)
            </div>
          </div>
        </div>
        <input
          type="time"
          className="input"
          value={f.heure_coucher}
          onChange={e => dispatch({ type: 'UPDATE_FAMILY', patch: { heure_coucher: e.target.value } })}
        />
      </div>

      {/* NIP */}
      <div className="card p-4 mb-3">
        <div className="flex items-center gap-3 mb-2">
          <Lock className="text-bk-primary" />
          <div className="flex-1">
            <div className="font-display font-bold text-base">NIP du mode parent</div>
            <div className="text-[11px] uppercase tracking-techno font-bold text-bk-parentMute mt-0.5">
              {editNip ? 'Tape un nouveau code' : '•••• · 4 à 6 chiffres'}
            </div>
          </div>
          {!editNip && (
            <button className="btn-ghost text-sm" onClick={() => { setNipDraft(f.nip); setEditNip(true); }}>
              Modifier
            </button>
          )}
        </div>
        {editNip && (
          <div className="flex gap-2 mt-2">
            <input
              autoFocus
              inputMode="numeric"
              maxLength={6}
              className="input text-center text-2xl font-display font-extrabold tracking-[0.5em]"
              value={nipDraft}
              onChange={e => setNipDraft(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
            />
            <button className="btn-ghost" onClick={() => setEditNip(false)}>Annuler</button>
            <button
              className="btn-primary"
              disabled={nipDraft.length < 4}
              onClick={() => { dispatch({ type: 'SET_NIP', nip: nipDraft }); setEditNip(false); }}
            >Enregistrer</button>
          </div>
        )}
      </div>

      {/* Plancher solde + solde négatif */}
      <div className="card p-4 mb-3">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="font-display font-bold text-base">Plancher du solde</div>
            <div className="text-[11px] uppercase tracking-techno font-bold text-bk-parentMute mt-0.5">
              Le solde ne descend pas en dessous
            </div>
          </div>
          <input
            type="number"
            className="input w-20 text-center font-display font-extrabold"
            value={f.plancher_solde}
            onChange={e => dispatch({ type: 'UPDATE_FAMILY', patch: { plancher_solde: Number(e.target.value) } })}
          />
        </div>
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <div className="font-display font-bold text-base">Solde négatif autorisé</div>
            <div className="text-[11px] uppercase tracking-techno font-bold text-bk-parentMute mt-0.5">
              Déconseillé pour les jeunes
            </div>
          </div>
          <input
            type="checkbox"
            className="w-10 h-6 accent-bk-primary"
            checked={f.solde_négatif_autorisé}
            onChange={e => dispatch({ type: 'UPDATE_FAMILY', patch: { solde_négatif_autorisé: e.target.checked } })}
          />
        </label>
      </div>

      {/* Notifications */}
      <div className="card p-4 mb-3">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-3 flex-1">
            <Bell className="text-bk-streak" />
            <div>
              <div className="font-display font-bold text-base">Notifications in-app</div>
              <div className="text-[11px] uppercase tracking-techno font-bold text-bk-parentMute mt-0.5">
                Déclarations, jeux à valider, réclamations
              </div>
            </div>
          </div>
          <input
            type="checkbox"
            className="w-10 h-6 accent-bk-primary"
            checked={f.notifications_actives}
            onChange={e => dispatch({ type: 'UPDATE_FAMILY', patch: { notifications_actives: e.target.checked } })}
          />
        </label>
      </div>

      {/* Reset */}
      <div className="card p-4 mb-3 border-bk-warn">
        <div className="flex items-center gap-3 mb-2">
          <RotateCcw className="text-bk-warn" />
          <div className="flex-1">
            <div className="font-display font-bold text-base">Réinitialiser le foyer</div>
            <div className="text-[11px] uppercase tracking-techno font-bold text-bk-parentMute mt-0.5">
              Recharge le seed de démo (Léo, Mia, jeu en cours)
            </div>
          </div>
        </div>
        {!confirmReset ? (
          <button className="btn-ghost w-full" onClick={() => setConfirmReset(true)}>
            Réinitialiser…
          </button>
        ) : (
          <div className="flex gap-2">
            <button className="btn-ghost flex-1" onClick={() => setConfirmReset(false)}>Annuler</button>
            <button
              className="btn-warn flex-1"
              onClick={() => {
                clearState();
                sessionStorage.removeItem('bk:unlocked');
                dispatch({ type: 'LOAD_SEED' });
                navigate('/');
              }}
            >Confirmer</button>
          </div>
        )}
      </div>
    </div>
  );
}
