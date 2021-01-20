import { Locale } from '@navikt/sif-common-core/lib/types/Locale';

export interface AppState {
    locale: Locale;
    harGodkjentVilkår: boolean;
}
