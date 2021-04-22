import React from 'react';
import { useIntl } from 'react-intl';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import {
    getDateValidator,
    getRequiredFieldValidator,
    getYesOrNoValidator,
} from '@navikt/sif-common-formik/lib/validation';
import { validateAll } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import { SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';
import SøknadFormComponents from '../../SøknadFormComponents';
import FrilansEksempeltHtml from './FrilansEksempelHtml';

interface Props {
    formValues: SøknadFormData;
}

const FrilansFormPart: React.FunctionComponent<Props> = ({
    formValues: { frilans_erFrilanser, frilans_jobberFortsattSomFrilans, frilans_startdato },
}) => {
    const erFrilanser = frilans_erFrilanser === YesOrNo.YES;
    const harSluttetSomFrilanser = frilans_jobberFortsattSomFrilans === YesOrNo.NO;
    const intl = useIntl();
    return (
        <>
            <SøknadFormComponents.YesOrNoQuestion
                name={SøknadFormField.frilans_erFrilanser}
                legend={intlHelper(intl, 'frilanser.erFrilanser.spm')}
                description={
                    <ExpandableInfo title="Hva er en frilanser?">
                        <FrilansEksempeltHtml />
                    </ExpandableInfo>
                }
                validate={getYesOrNoValidator()}
            />
            {erFrilanser && (
                <FormBlock margin="l">
                    <ResponsivePanel className={'responsivePanel'}>
                        <FormBlock margin="none">
                            <SøknadFormComponents.DatePicker
                                name={SøknadFormField.frilans_startdato}
                                label={intlHelper(intl, 'frilanser.nårStartet.spm')}
                                showYearSelector={true}
                                maxDate={dateToday}
                                validate={(value) =>
                                    validateAll([
                                        () => getRequiredFieldValidator()(value),
                                        () =>
                                            getDateValidator({
                                                required: true,
                                                max: dateToday,
                                            })(value),
                                    ])
                                }
                            />
                        </FormBlock>
                        <FormBlock>
                            <SøknadFormComponents.YesOrNoQuestion
                                name={SøknadFormField.frilans_jobberFortsattSomFrilans}
                                legend={intlHelper(intl, 'frilanser.jobberFortsatt.spm')}
                                validate={getYesOrNoValidator()}
                            />
                        </FormBlock>
                        {harSluttetSomFrilanser && (
                            <FormBlock>
                                <SøknadFormComponents.DatePicker
                                    name={SøknadFormField.frilans_sluttdato}
                                    label={intlHelper(intl, 'frilanser.nårSluttet.spm')}
                                    showYearSelector={true}
                                    minDate={datepickerUtils.getDateFromDateString(frilans_startdato)}
                                    maxDate={dateToday}
                                    validate={(value) =>
                                        validateAll([
                                            () => getRequiredFieldValidator()(value),
                                            () =>
                                                getDateValidator({
                                                    required: true,
                                                    min: datepickerUtils.getDateFromDateString(frilans_startdato),
                                                    max: dateToday,
                                                })(value),
                                        ])
                                    }
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
