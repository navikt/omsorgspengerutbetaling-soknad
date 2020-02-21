import { render, RenderResult } from '@testing-library/react';
import * as React from 'react';
import { MemoryRouter } from 'react-router';
import IntlProvider from 'app/components/intl-provider/IntlProvider';
import { StepID } from '../../../config/stepConfig';
import { initialValues } from '../../../types/OmsorgspengesøknadFormData';
import Step from '../Step';

jest.mock('../../../utils/featureToggleUtils', () => {
    return {
        isFeatureEnabled: () => false,
        Feature: {}
    };
});

const renderWrappedInMemoryRouter = (child: React.ReactNode) =>
    render(
        <IntlProvider locale="nb" onError={() => null}>
            <MemoryRouter>{child}</MemoryRouter>
        </IntlProvider>
    );

const handleSubmit = jest.fn();

describe('<Step>', () => {
    const stepID: StepID = StepID.OPPLYSNINGER_OM_BARNET;

    let renderResult: RenderResult;

    beforeAll(() => {
        renderResult = renderWrappedInMemoryRouter(
            <Step id={stepID} handleSubmit={handleSubmit} formValues={initialValues} />
        );
    });

    it('should render common <Step> content', () => {
        const { getByText } = renderResult;
        expect(getByText('Søknad om ekstra omsorgsdager')).toBeTruthy();
        expect(getByText('Barn')).toBeTruthy();
        expect(getByText('Fortsett')).toBeTruthy();
        expect(getByText('Tilbake')).toBeTruthy();
    });
});
