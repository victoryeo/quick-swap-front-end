import type { AppState } from '../../store/store'

export const selectUserAddress = (state: AppState) => state.user.userAddress;

export const selectGoerliUserAddress = (state: AppState) => state.user.goerliUserAddress;

export const selectGnosisUserAddress = (state: AppState) => state.user.gnosisUserAddress;

export const selectGoerliPlock = (state: AppState) => state.user.goerliPlock;

export const selectGnosisPlock = (state: AppState) => state.user.gnosisPlock;
