import {NETWORK_FAILED} from './ActionTypes';

export const networkFailed = error => ({
  type: NETWORK_FAILED,
  payload: error,
});
