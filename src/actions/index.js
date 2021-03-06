import { fromJS } from 'immutable';
import { fromJSON, toJSON } from 'transit-immutable-js';

import EvolutionWorker from '../genetic/evolution.worker.js';

export const addInputCode = code => ({
  type: 'ADD_INPUT_CODE',
  code
});

export const showCode = code => ({
  type: 'SHOW_CODE',
  code
});

export const hideCode = () => ({
  type: 'HIDE_CODE'
});

export const showInfo = () => ({
  type: 'SHOW_INFO'
});

export const hideInfo = () => ({
  type: 'HIDE_INFO'
});

export const evolveGenotypeStart = id => ({
  type: 'EVOLVE_GENOTYPE_START',
  id
});

export const evolveGenotypeDone = (population, history) => ({
  type: 'EVOLVE_GENOTYPE_DONE',
  population,
  history
});

export const evolveGenotype = id =>
  (dispatch, getState) => {
    dispatch(evolveGenotypeStart(id));

    const evolutionWorker = new EvolutionWorker();

    evolutionWorker.postMessage(
      toJSON(
        fromJS({
          evolveId: id,
          history: getState().get('history'),
          population: getState().get('population')
        })
      )
    );

    evolutionWorker.addEventListener('message', event => {
      const data = fromJSON(event.data);

      dispatch(evolveGenotypeDone(data.get('population'), data.get('history')));

      evolutionWorker.terminate();
    });
  };

export const resetApp = () => ({
  type: 'RESET_APP'
});
