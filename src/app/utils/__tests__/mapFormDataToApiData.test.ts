import { Attachment } from 'common/types/Attachment';
import { YesOrNo } from 'common/types/YesOrNo';
import * as attachmentUtils from 'common/utils/attachmentUtils';
import { OmsorgspengesøknadApiData } from '../../types/OmsorgspengesøknadApiData';
import { AppFormField, OmsorgspengesøknadFormData } from '../../types/OmsorgspengesøknadFormData';
import { BarnReceivedFromApi } from '../../types/Søkerdata';
import { isFeatureEnabled } from '../featureToggleUtils';
import { mapFormDataToApiData } from '../mapFormDataToApiData';

const moment = require('moment');

jest.mock('./../featureToggleUtils.ts', () => ({
    isFeatureEnabled: jest.fn(),
    Feature: {}
}));

const todaysDate = moment()
    .startOf('day')
    .toDate();

const barnMock: BarnReceivedFromApi[] = [
    { fødselsdato: todaysDate, fornavn: 'Mock', etternavn: 'Mocknes', aktørId: '123' }
];

type AttachmentMock = Attachment & { failed: boolean };
const attachmentMock1: Partial<AttachmentMock> = { url: 'nav.no/1', failed: true };
const attachmentMock2: Partial<AttachmentMock> = { url: 'nav.no/2', failed: false };

const formDataMock: Partial<OmsorgspengesøknadFormData> = {
    [AppFormField.harBekreftetOpplysninger]: true,
    [AppFormField.harForståttRettigheterOgPlikter]: true,
    [AppFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo.YES,
    [AppFormField.utenlandsoppholdNeste12Mnd]: [],
    [AppFormField.utenlandsoppholdSiste12Mnd]: [],
    [AppFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo.NO,
    [AppFormField.legeerklæring]: [attachmentMock1 as AttachmentMock, attachmentMock2 as AttachmentMock]
};

jest.mock('common/utils/dateUtils', () => {
    return {
        formatDate: jest.fn((date: Date) => date.toDateString())
    };
});

jest.mock('common/utils/attachmentUtils', () => {
    return {
        attachmentUploadHasFailed: jest.fn((attachment: AttachmentMock) => attachment.failed)
    };
});

describe('mapFormDataToApiData', () => {
    let resultingApiData: OmsorgspengesøknadApiData;

    beforeAll(() => {
        (isFeatureEnabled as any).mockImplementation(() => false);
        resultingApiData = mapFormDataToApiData(formDataMock as OmsorgspengesøknadFormData, barnMock, 'nb');
    });

    it("should set 'medlemskap.skalBoIUtlandetNeste12Mnd' in api data correctly", () => {
        expect(resultingApiData.medlemskap.skalBoIUtlandetNeste12Mnd).toBe(false);
    });

    it("should set 'medlemskap.harBoddIUtlandetSiste12Mnd' in api data correctly", () => {
        expect(resultingApiData.medlemskap.harBoddIUtlandetSiste12Mnd).toBe(true);
    });

    it("should set 'vedlegg' in api data correctly by only including the urls of attachments that have been successfully uploaded", () => {
        expect(attachmentUtils.attachmentUploadHasFailed).toHaveBeenCalledWith(attachmentMock1);
        expect(attachmentUtils.attachmentUploadHasFailed).toHaveBeenCalledWith(attachmentMock2);
        expect(resultingApiData.legeerklæring).toHaveLength(1);
        expect(resultingApiData.legeerklæring[0]).toEqual(attachmentMock2.url);
    });

    it('should set harBekreftetOpplysninger to value of harBekreftetOpplysninger in form data', () => {
        expect(resultingApiData.harBekreftetOpplysninger).toBe(formDataMock[AppFormField.harBekreftetOpplysninger]);
    });

    it('should set har_forstått_rettigheter_og_plikter to value of harForståttRettigheterOgPlikter in form data', () => {
        expect(resultingApiData.harForståttRettigheterOgPlikter).toBe(
            formDataMock[AppFormField.harForståttRettigheterOgPlikter]
        );
    });
});
