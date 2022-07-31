import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { AnnetBarn } from '@navikt/sif-common-forms/lib/annet-barn/types';
import { Barn } from '../../types/Søkerdata';
import { SøknadFormData } from '../../types/SøknadFormData';
import dayjs from 'dayjs';
import { CheckboksPanelProps } from 'nav-frontend-skjema';

export const minstEtBarn12årIårellerYngre = (barn: Barn[], andreBarn: AnnetBarn[]): boolean | undefined => {
    if (barn.length > 0 || andreBarn.length > 0) {
        const barn12ellerYngre = barn.some((barn) => dayjs().year() - dayjs(barn.fødselsdato).year() <= 12);
        const andreBarn12ellerYngre = andreBarn.some((barn) => dayjs().year() - dayjs(barn.fødselsdato).year() <= 12);
        return barn12ellerYngre || andreBarn12ellerYngre;
    }
    return undefined;
};

export const cleanupDineBarnStep = (values: SøknadFormData, barn: Barn[], andreBarn: AnnetBarn[]): SøknadFormData => {
    if (minstEtBarn12årIårellerYngre(barn, andreBarn)) {
        return {
            ...values,
            harUtvidetRett: YesOrNo.UNANSWERED,
            harUtvidetRettFor: [],
        };
    }

    if (minstEtBarn12årIårellerYngre(barn, andreBarn) === false) {
        if (barn.length + andreBarn.length === 1) {
            const barnId = barn.length === 1 ? barn[0].aktørId : andreBarn[0].fnr;
            const harUtvidetRett = values.harUtvidetRett === YesOrNo.YES;
            return {
                ...values,
                harDekketTiFørsteDagerSelv: undefined,
                harUtvidetRettFor: harUtvidetRett ? [barnId] : [],
            };
        }

        return {
            ...values,
            harDekketTiFørsteDagerSelv: undefined,
        };
    }
    return values;
};

export const getBarnOptions = (barn: Barn[] = [], andreBarn: AnnetBarn[] = []): CheckboksPanelProps[] => {
    return [
        ...barn.map((barnet) => ({
            label: `${formatName(barnet.fornavn, barnet.etternavn)} ${prettifyDate(barnet.fødselsdato)}`,
            value: barnet.aktørId,
        })),
        ...andreBarn.map((barnet) => ({
            label: `${barnet.navn} ${prettifyDate(barnet.fødselsdato)} `,
            value: barnet.fnr,
        })),
    ];
};
