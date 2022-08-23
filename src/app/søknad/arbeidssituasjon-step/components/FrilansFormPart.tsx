import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { getDateValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../../lenker';
import SoknadFormComponents from '../../../søknad/SoknadFormComponents';

interface Props {
    formValues: SøknadFormData;
}

const FrilansFormPart: React.FC<Props> = ({
    formValues: { frilans_erFrilanser, frilans_jobberFortsattSomFrilans, frilans_startdato },
}) => {
    const erFrilanser = frilans_erFrilanser === YesOrNo.YES;
    const harSluttetSomFrilanser = frilans_jobberFortsattSomFrilans === YesOrNo.NO;
    const intl = useIntl();
    return (
        <>
            <SoknadFormComponents.YesOrNoQuestion
                name={SøknadFormField.frilans_erFrilanser}
                legend={intlHelper(intl, 'frilanser.erFrilanser.spm')}
                description={
                    <ExpandableInfo title={intlHelper(intl, 'step.arbeidssituasjon.frilanser.hjelpetekst.tittel')}>
                        <>
                            {intlHelper(intl, 'step.arbeidssituasjon.frilanser.hjelpetekst')}{' '}
                            <Lenke href={getLenker(intl.locale).skatteetaten} target="_blank">
                                <FormattedMessage id="step.arbeidssituasjon.frilanser.hjelpetekst.skatteetatenLenke" />
                            </Lenke>
                        </>
                    </ExpandableInfo>
                }
                validate={getYesOrNoValidator()}
            />
            {erFrilanser && (
                <FormBlock margin="l">
                    <ResponsivePanel className={'responsivePanel'}>
                        <FormBlock margin="none">
                            <SoknadFormComponents.DatePicker
                                name={SøknadFormField.frilans_startdato}
                                label={intlHelper(intl, 'frilanser.nårStartet.spm')}
                                showYearSelector={true}
                                maxDate={dateToday}
                                validate={getDateValidator({
                                    required: true,
                                    max: dateToday,
                                })}
                            />
                        </FormBlock>
                        <FormBlock>
                            <SoknadFormComponents.YesOrNoQuestion
                                name={SøknadFormField.frilans_jobberFortsattSomFrilans}
                                legend={intlHelper(intl, 'frilanser.jobberFortsatt.spm')}
                                validate={getYesOrNoValidator()}
                            />
                        </FormBlock>
                        {harSluttetSomFrilanser && (
                            <FormBlock>
                                <SoknadFormComponents.DatePicker
                                    name={SøknadFormField.frilans_sluttdato}
                                    label={intlHelper(intl, 'frilanser.nårSluttet.spm')}
                                    showYearSelector={true}
                                    minDate={datepickerUtils.getDateFromDateString(frilans_startdato)}
                                    maxDate={dateToday}
                                    validate={getDateValidator({
                                        required: true,
                                        min: datepickerUtils.getDateFromDateString(frilans_startdato),
                                        max: dateToday,
                                    })}
                                />
                            </FormBlock>
                        )}
                    </ResponsivePanel>
                </FormBlock>
            )}
        </>
    );
};

export default FrilansFormPart;
