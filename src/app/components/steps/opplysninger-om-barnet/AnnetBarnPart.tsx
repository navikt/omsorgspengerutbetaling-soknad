import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common/lib/common/components/box/Box';
import FormikCheckbox from '@navikt/sif-common/lib/common/formik/formik-checkbox/FormikCheckbox';
import FormikDatepicker from '@navikt/sif-common/lib/common/formik/formik-datepicker/FormikDatepicker';
import FormikInput from '@navikt/sif-common/lib/common/formik/formik-input/FormikInput';
import FormikSelect from '@navikt/sif-common/lib/common/formik/formik-select/FormikSelect';
import { dateToday } from '@navikt/sif-common/lib/common/utils/dateUtils';
import intlHelper from '@navikt/sif-common/lib/common/utils/intlUtils';
import { validateFødselsnummer } from '@navikt/sif-common/lib/common/validation/fieldValidations';
import { CustomFormikProps } from '../../../types/FormikProps';
import { AppFormField, SøkersRelasjonTilBarnet } from '../../../types/OmsorgspengesøknadFormData';
import { validateFødselsdato, validateNavn, validateRelasjonTilBarnet } from '../../../validation/fieldValidations';

interface Props {
    formikProps: CustomFormikProps;
}

const AnnetBarnPart: React.FunctionComponent<Props> = ({ formikProps: { values, setFieldValue } }) => {
    const intl = useIntl();
    const { barnetHarIkkeFåttFødselsnummerEnda } = values;
    return (
        <>
            <Box margin="xl">
                <FormikInput<AppFormField>
                    label={intlHelper(intl, 'steg.omBarnet.fnr.spm')}
                    name={AppFormField.barnetsFødselsnummer}
                    validate={(fnr) => {
                        if (!barnetHarIkkeFåttFødselsnummerEnda) {
                            return validateFødselsnummer(fnr);
                        }
                        return undefined;
                    }}
                    disabled={barnetHarIkkeFåttFødselsnummerEnda}
                    bredde="XL"
                    type="tel"
                    maxLength={11}
                />
            </Box>
            <Box margin="m">
                <FormikCheckbox<AppFormField>
                    label={intlHelper(intl, 'steg.omBarnet.fnr.ikkeFnrEnda')}
                    name={AppFormField.barnetHarIkkeFåttFødselsnummerEnda}
                    afterOnChange={(newValue) => {
                        if (newValue) {
                            setFieldValue(AppFormField.barnetsFødselsnummer, '');
                        }
                    }}
                />
            </Box>
            {barnetHarIkkeFåttFødselsnummerEnda && (
                <Box margin="xl">
                    <FormikDatepicker<AppFormField>
                        name={AppFormField.barnetsFødselsdato}
                        dateLimitations={{ maksDato: dateToday }}
                        label={intlHelper(intl, 'steg.omBarnet.fødselsdato')}
                        validate={(dato) => {
                            if (barnetHarIkkeFåttFødselsnummerEnda) {
                                return validateFødselsdato(dato);
                            }
                            return undefined;
                        }}
                    />
                </Box>
            )}
            <Box margin="xl">
                <FormikInput<AppFormField>
                    label={intlHelper(intl, 'steg.omBarnet.navn')}
                    name={AppFormField.barnetsNavn}
                    validate={(navn) => {
                        if (barnetHarIkkeFåttFødselsnummerEnda) {
                            return validateNavn(navn, false);
                        } else {
                            return validateNavn(navn, true);
                        }
                    }}
                    bredde="XL"
                />
            </Box>
            <Box margin="xl">
                <FormikSelect<AppFormField>
                    bredde="xl"
                    label={intlHelper(intl, 'steg.omBarnet.relasjon')}
                    name={AppFormField.søkersRelasjonTilBarnet}
                    validate={validateRelasjonTilBarnet}>
                    <option />
                    {Object.keys(SøkersRelasjonTilBarnet).map((key) => (
                        <option key={key} value={SøkersRelasjonTilBarnet[key]}>
                            {intlHelper(intl, `relasjonTilBarnet.${SøkersRelasjonTilBarnet[key]}`)}
                        </option>
                    ))}
                </FormikSelect>
            </Box>
        </>
    );
};

export default AnnetBarnPart;
