import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBonkoo } from '../../state/context';
import { systemBehaviors } from '../../data/seed';
import { Check, Plus, Trash2, ArrowRight, Sparkles } from 'lucide-react';

const AVATARS = ['🦁','🦊','🐼','🐯','🐸','🐰','🐨','🦄','🐶','🐱','🐵','🐧'];

type Step = 1 | 2 | 3 | 4;

export default function P2Onboarding() {
  const { state, dispatch } = useBonkoo();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [draftChild, setDraftChild] = useState<{ prénom: string; avatar: string; mode_interface: 'texte' | 'visuel' }>({ prénom: '', avatar: AVATARS[0], mode_interface: 'texte' });

  // Étape 3 : sélection de comportements à activer
  const [picked, setPicked] = useState<string[]>([
    'sb-brosser','sb-habiller','sb-repas','sb-lit','sb-école',
  ]);

  // Étape 4 : récompenses
  const [rNom, setRNom] = useState('30 min d’écran');
  const [rIcon, setRIcon] = useState('📱');
  const [rCost, setRCost] = useState(50);

  // NIP (étape 4 fin)
  const [nip, setNip] = useState('1234');

  const enfants = state.enfants;
  const stepOk = useMemo(() => {
    if (step === 1) return enfants.length > 0;
    if (step === 2) return picked.length >= 3;
    if (step === 3) return state.récompenses.length >= 1;
    if (step === 4) return nip.length >= 4;
    return false;
  }, [step, enfants.length, picked.length, state.récompenses.length, nip]);

  const addChild = () => {
    if (!draftChild.prénom.trim()) return;
    dispatch({ type: 'ADD_CHILD', child: draftChild });
    setDraftChild({ prénom: '', avatar: AVATARS[(enfants.length + 1) % AVATARS.length], mode_interface: 'texte' });
  };

  const next = () => {
    if (step === 2) {
      picked.forEach(id => dispatch({ type: 'ACTIVATE_SYSTEM_BEHAVIOR', sysBehaviorId: id }));
    }
    if (step === 4) {
      dispatch({ type: 'SET_NIP', nip });
      // V2 : FINISH_ONBOARDING fait l'auto-assignation et génère les occurrences du jour
      // de façon synchrone dans le reducer. Plus de setTimeout.
      dispatch({ type: 'FINISH_ONBOARDING' });
      navigate('/parent/dashboard');
      return;
    }
    setStep((s) => (s + 1) as Step);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <Sparkles className="text-bk-primary" />
        <div>
          <h1 className="text-2xl font-bold">Mise en route</h1>
          <p className="text-bk-mute text-sm">Étape {step} sur 4 — ton foyer opérationnel en moins de 2 minutes.</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {[1,2,3,4].map(n => (
          <div key={n} className={`h-2 flex-1 rounded-full ${n <= step ? 'bg-bk-primary' : 'bg-bk-line'}`} />
        ))}
      </div>

      {step === 1 && (
        <section className="card p-6">
          <h2 className="font-bold text-lg mb-1">Ajoute tes enfants</h2>
          <p className="text-bk-mute text-sm mb-4">
            Prénom + avatar uniquement. Aucun courriel, aucune date de naissance — conformité Loi 25 (minimisation des données).
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {enfants.map(c => (
              <div key={c.id} className="card p-3 flex items-center gap-3">
                <div className="text-3xl">{c.avatar}</div>
                <div className="flex-1">
                  <div className="font-semibold">{c.prénom}</div>
                  <div className="text-xs text-bk-mute capitalize">{c.mode_interface}</div>
                </div>
                <button className="text-bk-mute hover:text-rose-500" onClick={() => dispatch({ type: 'REMOVE_CHILD', childId: c.id })}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-bk-line pt-4 space-y-3">
            <div>
              <label className="label">Prénom</label>
              <input className="input" value={draftChild.prénom} onChange={e => setDraftChild({ ...draftChild, prénom: e.target.value })} placeholder="Léo" />
            </div>
            <div>
              <label className="label">Avatar</label>
              <div className="flex flex-wrap gap-2">
                {AVATARS.map(a => (
                  <button
                    key={a}
                    onClick={() => setDraftChild({ ...draftChild, avatar: a })}
                    className={`text-3xl w-12 h-12 rounded-xl grid place-items-center border ${draftChild.avatar === a ? 'border-bk-primary bg-bk-sand' : 'border-bk-line bg-white'}`}
                  >{a}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Niveau d'interface</label>
              <div className="flex gap-2">
                <button
                  className={`btn ${draftChild.mode_interface === 'visuel' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setDraftChild({ ...draftChild, mode_interface: 'visuel' })}
                >Visuel (pré-lecteur)</button>
                <button
                  className={`btn ${draftChild.mode_interface === 'texte' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setDraftChild({ ...draftChild, mode_interface: 'texte' })}
                >Texte court (5 ans +)</button>
              </div>
            </div>
            <button className="btn-soft w-full" onClick={addChild} disabled={!draftChild.prénom.trim()}>
              <Plus size={16} /> Ajouter cet enfant
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="card p-6">
          <h2 className="font-bold text-lg mb-1">Choisis les comportements de départ</h2>
          <p className="text-bk-mute text-sm mb-4">
            La bibliothèque fournie te fait gagner du temps. Coche au moins 3 routines clés.
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {systemBehaviors.map(b => {
              const on = picked.includes(b.id);
              return (
                <button
                  key={b.id}
                  onClick={() => setPicked(on ? picked.filter(x => x !== b.id) : [...picked, b.id])}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left ${on ? 'border-bk-primary bg-bk-sand' : 'border-bk-line bg-white'}`}
                >
                  <div className="text-3xl">{b.icône}</div>
                  <div className="flex-1">
                    <div className="font-semibold">{b.nom}</div>
                    <div className="text-xs text-bk-mute capitalize">{b.type} · {b.taille} · {b.valeur_points} pts</div>
                  </div>
                  {on && <Check className="text-bk-primary" size={20} />}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="card p-6">
          <h2 className="font-bold text-lg mb-1">Crée au moins une récompense</h2>
          <p className="text-bk-mute text-sm mb-4">
            L'objectif rend la boucle motivante. Tu pourras en ajouter d'autres plus tard.
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-3">
              <div>
                <label className="label">Nom</label>
                <input className="input" value={rNom} onChange={e => setRNom(e.target.value)} />
              </div>
              <div>
                <label className="label">Icône</label>
                <div className="flex gap-2">
                  {['📱','🛝','🎁','🎬','🍦','🎨','⚽','🎮'].map(i => (
                    <button key={i} onClick={() => setRIcon(i)}
                      className={`text-2xl w-10 h-10 rounded-xl grid place-items-center border ${rIcon === i ? 'border-bk-primary bg-bk-sand' : 'border-bk-line bg-white'}`}>{i}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Coût en points</label>
                <input className="input" type="number" value={rCost} min={1} onChange={e => setRCost(Number(e.target.value))} />
              </div>
              <button
                className="btn-primary w-full"
                onClick={() => dispatch({ type: 'CREATE_REWARD', reward: { nom: rNom, icône: rIcon, type: 'écran', coût_points: rCost, niveau_requis: 1 } })}
                disabled={!rNom.trim() || rCost <= 0}
              >
                <Plus size={16} /> Ajouter
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-bk-mute mb-1">Catalogue actuel</div>
              {state.récompenses.length === 0 && (
                <div className="text-bk-mute text-sm italic">Aucune récompense.</div>
              )}
              {state.récompenses.map(r => (
                <div key={r.id} className="card p-3 flex items-center gap-3">
                  <div className="text-2xl">{r.icône}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{r.nom}</div>
                    <div className="text-xs text-bk-mute">{r.coût_points} pts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {step === 4 && (
        <section className="card p-6">
          <h2 className="font-bold text-lg mb-1">Choisis le NIP du mode parent</h2>
          <p className="text-bk-mute text-sm mb-4">
            Il verrouille les écrans de configuration et empêche l'enfant de s'auto-approuver. 4 à 6 chiffres.
          </p>
          <input
            className="input text-center text-3xl font-mono tracking-[0.5em]"
            inputMode="numeric"
            maxLength={6}
            value={nip}
            onChange={e => setNip(e.target.value.replace(/\D/g, ''))}
            placeholder="••••"
          />
          <p className="text-xs text-bk-mute mt-2">Tu pourras le modifier dans les réglages plus tard.</p>
        </section>
      )}

      <div className="flex justify-between mt-6">
        <button
          className="btn-ghost"
          disabled={step === 1}
          onClick={() => setStep((s) => (s - 1) as Step)}
        >Retour</button>
        <button className="btn-primary" disabled={!stepOk} onClick={next}>
          {step === 4 ? 'Terminer' : 'Continuer'} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
