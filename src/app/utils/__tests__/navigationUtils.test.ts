import { History } from 'history';
import routeConfig from '../../config/routeConfig';
import { navigateTo, navigateToErrorPage } from '../navigationUtils';

const historyMock: Partial<History> = {
    push: jest.fn(),
};

jest.mock('./../envUtils.ts', () => {
    return { getEnvironmentVariable: () => '' };
});

// hacky workaround for this issue, which actually seems to be an issue
// with jsdom (not jest):
// https://github.com/facebook/jest/issues/5124

describe('navigationUtils', () => {
    describe('navigateTo', () => {
        it('should navigate user to the provided route', () => {
            const route = '/someRoute';
            navigateTo(route, historyMock as History);
            expect(historyMock.push).toHaveBeenCalledWith(route);
        });
    });

    describe('navigateToErrorPage', () => {
        it('should navigate user to the path specified by routeConfig.ERROR_PAGE_ROUTE', () => {
            navigateToErrorPage(historyMock as History);
            expect(historyMock.push).toHaveBeenCalledWith(routeConfig.ERROR_PAGE_ROUTE);
        });
    });
});
