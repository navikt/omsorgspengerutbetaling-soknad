import React from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormattedHtmlMessage from '@navikt/sif-common-core/lib/components/formatted-html-message/FormattedHtmlMessage';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import TextareaSummary from '@navikt/sif-common-core/lib/components/textarea-summary/TextareaSummary';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { VirksomhetApiData } from '@navikt/sif-common-forms/lib';
import { harFiskerNæringstype } from '@navikt/sif-common-forms/lib/virksomhet/virksomhetUtils';
import SummarySection from '../../../components/summary-section/SummarySection';
import { prettifyApiDate } from './DatoSvar';
import IntlLabelValue from './IntlLabelValue';
import JaNeiSvar from './JaNeiSvar';
import Sitat from './Sitat';
import SummaryBlock from './SummaryBlock';

interface Props {
    selvstendigVirksomheter?: VirksomhetApiData[];
}

const renderVirksomhetSummary = (virksomhet: VirksomhetApiData, intl: IntlShape) => {
    const land = virksomhet.registrertIUtlandet ? virksomhet.registrertIUtlandet.landnavn : 'Norge';
    const næringstyper = virksomhet.næringstyper.map((næring) => intlHelper(intl, `næringstype.${næring}`)).join(', ');
    const fiskerinfo =
        harFiskerNæringstype(virksomhet.næringstyper) && virksomhet.fiskerErPåBladB !== undefined
            ? {
                  erPåBladB: virksomhet.fiskerErPåBladB !== undefined && virksomhet.fiskerErPåBladB === true,
              }
            : undefined;

    const tidsinfo = virksomhet.tilOgMed
        ? intlHelper(intl, 'summary.virksomhet.tidsinfo.avsluttet', {
              fraOgMed: prettifyApiDate(virksomhet.fraOgMed),
              tilOgMed: prettifyApiDate(virksomhet.tilOgMed),
          })
        : intlHelper(intl, 'summary.virksomhet.tidsinfo.pågående', {
              fraOgMed: prettifyApiDate(virksomhet.fraOgMed),
          });

    return (
        <SummaryBlock header={virksomhet.navnPåVirksomheten}>
            <IntlLabelValue labelKey="summary.virksomhet.næringstype">{næringstyper}. </IntlLabelValue>
            {fiskerinfo && (
                <>
                    {fiskerinfo.erPåBladB === false ? (
                        <FormattedMessage id="summary.virksomhet.fisker.ikkePåBladB" />
                    ) : (
                        <FormattedMessage id="summary.virksomhet.fisker.påBladB" />
                    )}
                </>
            )}

            <p>
                <FormattedMessage id="summary.virksomhet.registrertILand" values={{ land }} />
                {virksomhet.registrertINorge && (
                    <FormattedMessage
                        id="summary.virksomhet.registrertILand.orgnr"
                        values={{ orgnr: virksomhet.organisasjonsnummer }}
                    />
                )}
                . <br />
                {tidsinfo}
                {virksomhet.næringsinntekt !== undefined && (
                    <>
                        <br />
                        <FormattedMessage
                            id="summary.virksomhet.næringsinntekt"
                            values={{ næringsinntekt: virksomhet.næringsinntekt }}
                        />
                    </>
                )}
            </p>
            {virksomhet.varigEndring?.dato && (
                <Box padBottom="l">
                    <FormattedHtmlMessage
                        id="summary.virksomhet.varigEndring.html"
                        value={{
                            dato: prettifyApiDate(virksomhet.varigEndring.dato),
                            inntekt: intl.formatNumber(virksomhet.varigEndring.inntektEtterEndring),
                        }}
                    />
                    <Sitat>
                        <TextareaSummary text={virksomhet.varigEndring.forklaring} />
                    </Sitat>
                </Box>
            )}
            {virksomhet.yrkesaktivSisteTreFerdigliknedeÅrene?.oppstartsdato !== undefined && (
                <FormattedMessage
                    tagName="p"
                    id="summary.virksomhet.yrkesaktivSisteTreFerdigliknedeÅrene"
                    values={{
                        dato: prettifyApiDate(virksomhet.yrkesaktivSisteTreFerdigliknedeÅrene.oppstartsdato),
                    }}
                />
            )}

            {/* Regnskapsfører */}
            {virksomhet.regnskapsfører && (
                <FormattedMessage
                    tagName="p"
                    id="summary.virksomhet.regnskapsfører"
                    values={{ ...virksomhet.regnskapsfører }}
                />
            )}
            {/** Har ikke regnskapsfører */}
            {virksomhet.registrertINorge === true && virksomhet.regnskapsfører === undefined && (
                <FormattedMessage tagName="p" id="summary.virksomhet.ikkeRegnskapsfører" />
            )}
        </SummaryBlock>
    );
};

const SelvstendigSummary: React.FunctionComponent<Props> = ({ selvstendigVirksomheter = [] }) => {
    const intl = useIntl();
    const harSelvstendigVirksomheter = selvstendigVirksomheter.length > 0;
    return (
        <SummarySection header={intlHelper(intl, 'summary.virksomhet.header')}>
            <SummaryBlock header={intlHelper(intl, 'selvstendig.summary.harDuHattInntekt.header')}>
                <JaNeiSvar harSvartJa={harSelvstendigVirksomheter} />
            </SummaryBlock>
            {harSelvstendigVirksomheter && (
                <SummaryBlock header="Virksomheter:">
                    <SummaryList
                        items={selvstendigVirksomheter}
                        itemRenderer={(virksomhet) => renderVirksomhetSummary(virksomhet, intl)}
                    />
                </SummaryBlock>
            )}
        </SummarySection>
    );
};

export default SelvstendigSummary;
