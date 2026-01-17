import { useState } from 'react';

const defaultAnswers = {
  jawRest: 'Oui',
  painLevel: 'Aucune',
  activity: 'Travail'
};

export default function Questions({ onSave }) {
  const [answers, setAnswers] = useState(defaultAnswers);

  const updateAnswer = (field, value) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(answers);
  };

  return (
    <section className="card">
      <h2>Mini-questionnaire</h2>
      <p className="muted">
        Prenez 10 secondes pour sentir la position de votre mâchoire et votre
        activité.
      </p>

      <form className="stack" onSubmit={handleSubmit}>
        <fieldset className="fieldset">
          <legend>La mâchoire est-elle relâchée ?</legend>
          <div className="choice-row">
            {['Oui', 'Non'].map((value) => (
              <button
                key={value}
                type="button"
                className={`choice ${answers.jawRest === value ? 'is-selected' : ''}`}
                onClick={() => updateAnswer('jawRest', value)}
              >
                {value}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="fieldset">
          <legend>Douleur ou tension ?</legend>
          <div className="choice-row">
            {['Aucune', 'Légère', 'Modérée', 'Forte'].map((value) => (
              <button
                key={value}
                type="button"
                className={`choice ${answers.painLevel === value ? 'is-selected' : ''}`}
                onClick={() => updateAnswer('painLevel', value)}
              >
                {value}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="fieldset">
          <legend>Activité en cours</legend>
          <div className="choice-grid">
            {['Travail', 'Écrans', 'Repas', 'Sport', 'Repos', 'Autre'].map(
              (value) => (
                <button
                  key={value}
                  type="button"
                  className={`choice ${
                    answers.activity === value ? 'is-selected' : ''
                  }`}
                  onClick={() => updateAnswer('activity', value)}
                >
                  {value}
                </button>
              )
            )}
          </div>
        </fieldset>

        <button className="primary" type="submit">
          Enregistrer l’observation
        </button>
      </form>
    </section>
  );
}
