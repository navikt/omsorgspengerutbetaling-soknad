import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import FormikCheckbox from '@navikt/sif-common/lib/common/formik/formik-checkbox/FormikCheckbox';
import FormikRadioPanelGroup from '@navikt/sif-common/lib/common/formik/formik-radio-panel-group/FormikRadioPanelGroup';
import { resetFieldValue, resetFieldValues } from '@navikt/sif-common/lib/common/formik/formikUtils';
import { prettifyDate } from '@navikt/sif-common/lib/common/utils/dateUtils';
import intlHelper from '@navikt/sif-common/lib/common/utils/intlUtils';
import { formatName } from '@navikt/sif-common/lib/common/utils/personUtils';
import { CustomFormikProps } from '../../../types/FormikProps';
import { AppFormField, initialValues } from '../../../types/OmsorgspengesøknadFormData';
import { BarnReceivedFromApi } from '../../../types/Søkerdata';
import { validateValgtBarn } from '../../../validation/fieldValidations';

interface Props {
    formikProps: CustomFormikProps;
    søkersBarn: BarnReceivedFromApi[];
}

const RegistrertBarnPart: React.FunctionComponent<Props> = ({
    søkersBarn = [],
    formikProps: { values, setFieldValue }
}) => {
    const intl = useIntl();
    const { søknadenGjelderEtAnnetBarn } = values;

    return (
        <>
            <FormikRadioPanelGroup<AppFormField>
                legend={intlHelper(intl, 'steg.omBarnet.hvilketBarn.spm')}
                description={intlHelper(intl, 'steg.omBarnet.hvilketBarn.info')}
                name={AppFormField.barnetSøknadenGjelder}
                radios={søkersBarn.map((barn) => {
                    const { fornavn, mellomnavn, etternavn, fødselsdato, aktørId } = barn;
                    const barnetsNavn = formatName(fornavn, etternavn, mellomnavn);
                    return {
                        value: aktørId,
                        key: aktørId,
                        label: (
                            <>
                                <Normaltekst>{barnetsNavn}</Normaltekst>
                                <Normaltekst>
                                    <FormattedMessage
                                        id="steg.omBarnet.hvilketBarn.født"
                                        values={{ dato: prettifyDate(fødselsdato) }}
                                    />
                                </Normaltekst>
                            </>
                        ),
                        disabled: søknadenGjelderEtAnnetBarn
                    };
                })}
                validate={(value) => {
                    if (søknadenGjelderEtAnnetBarn) {
                        return undefined;
                    }
                    return validateValgtBarn(value);
                }}
            />
            <FormikCheckbox<AppFormField>
                label={intlHelper(intl, 'steg.omBarnet.gjelderAnnetBarn')}
                name={AppFormField.søknadenGjelderEtAnnetBarn}
                afterOnChange={(newValue) => {
                    if (newValue) {
                        resetFieldValue(AppFormField.barnetSøknadenGjelder, setFieldValue, initialValues);
                    } else {
                        resetFieldValues(
                            [
                                AppFormField.barnetsFødselsnummer,
                                AppFormField.barnetHarIkkeFåttFødselsnummerEnda,
                                AppFormField.barnetsFødselsdato,
                                AppFormField.barnetsNavn,
                                AppFormField.søkersRelasjonTilBarnet
                            ],
                            setFieldValue,
                            initialValues
                        );
                    }
                }}
            />
        </>
    );
};

export default RegistrertBarnPart;
