import axios from 'axios';
import { axiosMultipartConfig } from '../../config/axiosConfig';
import { ResourceType } from '../../types/ResourceType';
import { getApiUrlByResourceType, sendMultipartPostRequest } from '../apiUtils';

const mockedApiUrl = 'mockedApiUrl';
jest.mock('./../envUtils.ts', () => {
    return { getEnvironmentVariable: () => mockedApiUrl };
});

describe('apiUtils', () => {
    describe('sendMultipartPostRequest', () => {
        it('should use axios to send a multipart post request', () => {
            const formData = new FormData();
            formData.set('foo', 'bar');
            sendMultipartPostRequest('nav.no', formData);
            expect(axios.post).toHaveBeenCalledWith('nav.no', formData, axiosMultipartConfig);
        });
    });

    describe('getApiUrlByResourceType', () => {
        it('should return correct URL for ResourceType.SEND_SØKNAD', () => {
            expect(getApiUrlByResourceType(ResourceType.SEND_SØKNAD)).toEqual(
                `${mockedApiUrl}/${ResourceType.SEND_SØKNAD}`
            );
        });

        it('should return correct URL for ResourceType.SØKER', () => {
            expect(getApiUrlByResourceType(ResourceType.SØKER)).toEqual(`${mockedApiUrl}/${ResourceType.SØKER}`);
        });

        it('should return correct URL for ResourceType.VEDLEGG', () => {
            expect(getApiUrlByResourceType(ResourceType.VEDLEGG)).toEqual(`${mockedApiUrl}/${ResourceType.VEDLEGG}`);
        });
    });
});
