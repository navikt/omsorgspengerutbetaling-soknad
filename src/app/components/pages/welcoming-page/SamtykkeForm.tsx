import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { Hovedknapp } from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import FormBlock from 'common/components/form-block/FormBlock';
import bemHelper from 'common/utils/bemUtils';
import { commonFieldErrorRenderer } from 'common/utils/commonFieldErrorRenderer';
import intlHelper from 'common/utils/intlUtils';
import { AppFormField, OmsorgspengesøknadFormData } from '../../../types/OmsorgspengesøknadFormData';
import LegeerklæringInformationPanel from 'common/components/legeerklæring-information-panel/LegeerklæringInformationPanel';
import Box from 'common/components/box/Box';

interface Props {
    onConfirm: () => void;
    onOpenDinePlikterModal: () => void;
    openBehandlingAvPersonopplysningerModal: () => void;
}

const AppForm = getTypedFormComponents<AppFormField, OmsorgspengesøknadFormData>();

const bem = bemHelper('welcomingPage');

const SamtykkeForm: React.FunctionComponent<Props> = ({
    onConfirm,
    onOpenDinePlikterModal,
    openBehandlingAvPersonopplysningerModal
}) => {
    // const { values: formValues } = useFormikContext<OmsorgspengesøknadFormData>();

    const intl = useIntl();
    return (
        <AppForm.Form
            onValidSubmit={onConfirm}
            includeButtons={false}
            fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
            {/*<FormBlock>*/}
            {/*    <AppForm.YesOrNoQuestion*/}
            {/*        name={AppFormField.kroniskEllerFunksjonshemming}*/}
            {/*        legend={intlHelper(intl, 'introPage.spm.kroniskEllerFunksjonshemmende')}*/}
            {/*        validate={validateYesOrNoIsAnswered}*/}
            {/*    />*/}
            {/*</FormBlock>*/}
            <FormBlock>
                {/*{formValues.kroniskEllerFunksjonshemming === YesOrNo.NO && (*/}

                <Box margin={'xl'}>
                    <LegeerklæringInformationPanel text={intlHelper(intl, 'welcomingPage.legeerklæring')} />
                </Box>
                {/*)}*/}
                {/*{formValues.kroniskEllerFunksjonshemming === YesOrNo.YES && (*/}
                <>
                    {/*<CounsellorPanel>*/}
                    {/*    <FormattedHTMLMessage id={`introPage.legeerklæring.html`} />*/}
                    {/*</CounsellorPanel>*/}
                    <FormBlock>
                        <AppForm.ConfirmationCheckbox
                            label={intlHelper(intl, 'welcomingPage.samtykke.tekst')}
                            name={AppFormField.harForståttRettigheterOgPlikter}
                            validate={(value) => {
                                let result;
                                if (value !== true) {
                                    result = intlHelper(intl, 'welcomingPage.samtykke.harIkkeGodkjentVilkår');
                                }
                                return result;
                            }}>
                            <FormattedMessage
                                id="welcomingPage.samtykke.harForståttLabel"
                                values={{
                                    plikterLink: (
                                        <Lenke href="#" onClick={onOpenDinePlikterModal}>
                                            {intlHelper(intl, 'welcomingPage.samtykke.harForståttLabel.lenketekst')}
                                        </Lenke>
                                    )
                                }}
                            />
                        </AppForm.ConfirmationCheckbox>
                    </FormBlock>
                    <FormBlock>
                        <Hovedknapp className={bem.element('startApplicationButton')}>
                            {intlHelper(intl, 'welcomingPage.begynnsøknad')}
                        </Hovedknapp>
                    </FormBlock>
                    <FormBlock>
                        <div className={bem.element('personopplysningModalLenke')}>
                            <Lenke href="#" onClick={openBehandlingAvPersonopplysningerModal}>
                                <FormattedMessage id="welcomingPage.personopplysninger.lenketekst" />
                            </Lenke>
                        </div>
                    </FormBlock>
                </>
                {/*)}*/}
            </FormBlock>
        </AppForm.Form>
    );
};
export default SamtykkeForm;
