import React from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import Box from 'common/components/box/Box';
import DatoSvar, { prettifyApiDate } from './DatoSvar';
import IntlLabelValue from './IntlLabelValue';
import JaNeiSvar from './JaNeiSvar';
import SummaryBlock from './SummaryBlock';
import { SøknadApiData, VirksomhetApiData } from '../../../types/SøknadApiData';
import { getCountryName } from 'common/utils/countryUtils';
import intlHelper from 'common/utils/intlUtils';
import { harFiskerNæringstype } from '../../../utils/formToApiMaps/mapVirksomhetToApiData';
import TextareaSummary from 'common/components/textarea-summary/TextareaSummary';
import SummaryList from 'common/components/summary-list/SummaryList';
import TallSvar from './TallSvar';
import Sitat from './Sitat';

interface Props {
    apiValues: SøknadApiData;
}

const renderVirksomhetSummary = (virksomhet: VirksomhetApiData, intl: IntlShape) => {
    const land = getCountryName(virksomhet.registrertILand || 'NO', intl.locale);
    const næringstyper = virksomhet.næringstyper.map((næring) => intlHelper(intl, `næringstype.${næring}`)).join(', ');
    const fiskerinfo = harFiskerNæringstype(virksomhet.næringstyper)
        ? {
              erPåPlaneB: virksomhet.fiskerErPåBladB === true
          }
        : undefined;
    const tidsinfo = `Startet ${prettifyApiDate(virksomhet.fraOgMed)}${
        virksomhet.tilOgMed ? `, avsluttet ${prettifyApiDate(virksomhet.fraOgMed)}.` : ' (pågående).'
    }`;

    return (
        <SummaryBlock header={virksomhet.navnPåVirksomheten}>
            <IntlLabelValue labelKey="summary.virksomhet.næringstype">{næringstyper}</IntlLabelValue>
            {fiskerinfo && (
                <IntlLabelValue labelKey="summary.virksomhet.fiskerErPåBladB">
                    <JaNeiSvar harSvartJa={fiskerinfo.erPåPlaneB} />
                </IntlLabelValue>
            )}
            <p>
                Registrert i {land}
                {virksomhet.registrertINorge ? ` (organisasjonsnummer ${virksomhet.organisasjonsnummer})` : ``}. <br />
                {tidsinfo}
            </p>
            {virksomhet.varigEndring?.dato && (
                <Box padBottom="l">
                    Har hatt varig endring i arbeidsforholdet, virksomheten eller arbeidssituasjonen de siste fire
                    årene. Dato for endring var <DatoSvar apiDato={virksomhet.varigEndring?.dato} />, og næringsinntekt
                    etter endringen er {` `}
                    <TallSvar verdi={virksomhet.varigEndring.inntektEtterEndring} />. Beskrivelse av endringen:{` `}
                    <Sitat>
                        <TextareaSummary text={virksomhet.varigEndring.forklaring} />
                    </Sitat>
                </Box>
            )}
            {virksomhet.yrkesaktivSisteTreFerdigliknedeÅrene?.oppstartsdato !== undefined && (
                <p>
                    Ble yrkesaktiv <DatoSvar apiDato={virksomhet.yrkesaktivSisteTreFerdigliknedeÅrene?.oppstartsdato} />
                </p>
            )}

            {/* Regnskapsfører */}
            {virksomhet.regnskapsfører && (
                <p>
                    Regnskapsfører er
                    <FormattedMessage
                        tagName="span"
                        id="summary.virksomhet.revisorEllerRegnskapsførerDetaljer"
                        values={{ ...virksomhet.regnskapsfører }}
                    />
                </p>
            )}
            {/* Revisor */}
            {virksomhet.revisor && (
                <p>
                    Revisor er
                    <FormattedMessage
                        tagName="span"
                        id="summary.virksomhet.revisorEllerRegnskapsførerDetaljer"
                        values={{ ...virksomhet.revisor }}
                    />
                    {virksomhet.revisor.kanInnhenteOpplysninger === true && (
                        <>
                            <br />
                            Nav har fullmakt til å innhente opplysninger direkte fra revisor.
                        </>
                    )}
                </p>
            )}
            {/** Har hverken revisor eller regnskapsfører */}
            {!virksomhet.regnskapsfører && !virksomhet.revisor && <p>Har ikke regnskapsfører eller revisor.</p>}
        </SummaryBlock>
    );
};

const SelvstendigSummary: React.FunctionComponent<Props> = (props) => {
    const { selvstendigVirksomheter } = props.apiValues;
    const intl = useIntl();
    const harSelvstendigVirksomheter = selvstendigVirksomheter.length > 0;
    return (
        <>
            <Box margin="l">
                <SummaryBlock header={intlHelper(intl, 'selvstendig.summary.harDuHattInntekt.header')}>
                    <JaNeiSvar harSvartJa={harSelvstendigVirksomheter} />
                </SummaryBlock>
            </Box>
            {harSelvstendigVirksomheter && (
                <SummaryList
                    items={selvstendigVirksomheter}
                    itemRenderer={(virksomhet) => renderVirksomhetSummary(virksomhet, intl)}
                />
            )}
        </>
    );
};

export default SelvstendigSummary;
