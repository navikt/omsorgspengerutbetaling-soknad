import { SøknadFormData } from '../types/SøknadFormData';
import {
    arbeidssituasjonStepIsAvailable,
    dineBarnStepIsAvailable,
    fraværStepIsAvailable,
    fraværFraStepIsAvailable,
    medlemskapStepIsAvailable,
    summaryStepAvailable,
} from './stepUtils';
import { StepID } from '../søknad/soknadStepsConfig';
import { Barn } from '../types/Søkerdata';
import { harFraværPgaSmittevernhensyn, harFraværPgaStengBhgSkole } from './periodeUtils';

export const getAvailableSteps = (values: SøknadFormData, registrerteBarn: Barn[]): StepID[] => {
    const steps: StepID[] = [];

    const fraværPgaStengBhgSkole: boolean = harFraværPgaStengBhgSkole(values.fraværPerioder, values.fraværDager);
    const fraværPgaSmittevernhensyn: boolean = harFraværPgaSmittevernhensyn(values.fraværPerioder, values.fraværDager);

    if (dineBarnStepIsAvailable(values)) {
        steps.push(StepID.DINE_BARN);
    }

    if (fraværStepIsAvailable(values, registrerteBarn)) {
        steps.push(StepID.FRAVÆR);
    }

    if (arbeidssituasjonStepIsAvailable(values)) {
        steps.push(StepID.ARBEIDSSITUASJON);
    }

    if (fraværFraStepIsAvailable(values)) {
        steps.push(StepID.FRAVÆR_FRA);
    }

    if (fraværPgaStengBhgSkole) {
        steps.push(StepID.DOKUMENTER_STENGT_SKOLE_BHG);
    }
    if (fraværPgaSmittevernhensyn) {
        steps.push(StepID.DOKUMENTER_SMITTEVERNHENSYN);
    }

    if (medlemskapStepIsAvailable(values)) {
        steps.push(StepID.MEDLEMSKAP);
    }

    if (summaryStepAvailable(values)) {
        steps.push(StepID.OPPSUMMERING);
    }

    return steps;
};
