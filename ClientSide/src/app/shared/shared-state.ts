export interface IPhase {
    home: boolean;
    spawn: boolean;
    phase1: boolean;
    phase2: boolean;
    phase3: boolean;
    phase4: boolean;
    phase5: boolean;
}

export const INITIAL_STATE: IPhase = {
    home: true,
    spawn: false,
    phase1: false,
    phase2: false,
    phase3: false,
    phase4: false,
    phase5: false,
};