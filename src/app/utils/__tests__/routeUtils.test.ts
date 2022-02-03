import RouteConfig from '../../config/routeConfig';
import { StepID } from '../../config/stepConfig';
import { SøknadFormField } from '../../types/SøknadFormData';
import { getSøknadRoute, isAvailable } from '../routeUtils';
import * as stepUtils from '../stepUtils';

jest.mock('../featureToggleUtils', () => {
    return {
        isFeatureEnabled: () => false,
        Feature: {},
    };
});

jest.mock('./../stepUtils', () => {
    return {
        legeerklæringStepAvailable: jest.fn(() => 'legeerklæring step available'),
        medlemskapStepAvailable: jest.fn(() => 'medlemskap step available'),
        summaryStepAvailable: jest.fn(() => 'summary step available'),
    };
});

const formValues = {} as any;

describe('routeUtils', () => {
    describe('getSøknadRoute', () => {
        it('should prefix provided string with a common prefix for routes', () => {
            const s2 = StepID.OPPSUMMERING;
            expect(getSøknadRoute(s2)).toEqual(`${RouteConfig.SØKNAD_ROUTE_PREFIX}/${s2}`);
        });
    });

    describe('isAvailable', () => {
        it('should return result from calling summaryStepAvailable if route=StepID.SUMMARY', () => {
            const result = isAvailable(StepID.OPPSUMMERING, formValues);
            expect(stepUtils.summaryStepAvailable).toHaveBeenCalledWith(formValues);
            expect(result).toEqual(stepUtils.summaryStepAvailable(formValues));
        });

        it('should return true if route=RouteConfig.SØKNAD_SENDT_ROUTE and harBekreftetOpplysninger is true', () => {
            const result = isAvailable(RouteConfig.SØKNAD_SENDT_ROUTE, {
                ...formValues,
                [SøknadFormField.harBekreftetOpplysninger]: true,
            });
            expect(result).toBe(true);
        });

        it('should return false if route=RouteConfig.SØKNAD_SENDT_ROUTE and harBekreftetOpplysninger is false', () => {
            const result = isAvailable(RouteConfig.SØKNAD_SENDT_ROUTE, {
                ...formValues,
                [SøknadFormField.harBekreftetOpplysninger]: false,
            });
            expect(result).toBe(false);
        });
    });
});
