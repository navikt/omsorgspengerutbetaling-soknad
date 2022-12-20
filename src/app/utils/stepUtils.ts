import { SøknadFormData } from '../types/SøknadFormData';
import {
    arbeidssituasjonStepIsValid,
    dineBarnStepIsValid,
    fraværStepIsValid,
    medlemskapStepIsValid,
    viseFravæFraSteg,
    welcomingPageIsValid,
} from '../validation/stepValidations';
import { Barn } from '../types/Søkerdata';

export const dineBarnStepIsAvailable = (formData: SøknadFormData) => welcomingPageIsValid(formData);

export const fraværStepIsAvailable = (formData: SøknadFormData, registrerteBarn: Barn[]) =>
    dineBarnStepIsValid(formData, registrerteBarn);

export const legeerklæringStepIsAvailable = (formData: SøknadFormData) => fraværStepIsValid(formData);

export const arbeidssituasjonStepIsAvailable = (formData: SøknadFormData) => legeerklæringStepIsAvailable(formData);

export const fraværFraStepIsAvailable = (formData: SøknadFormData) =>
    arbeidssituasjonStepIsAvailable(formData) && viseFravæFraSteg(formData);

export const medlemskapStepIsAvailable = (formData: SøknadFormData) =>
    arbeidssituasjonStepIsAvailable(formData) && arbeidssituasjonStepIsValid(formData);

export const summaryStepAvailable = (formData: SøknadFormData) => medlemskapStepIsValid(formData);
