import { History } from 'history';
import RouteConfig from '../config/routeConfig';
import { getRouteUrl } from '../config/routeConfig';
import { getEnvironmentVariable } from './envUtils';

const relocateTo = (url: string) => {
    window.location.assign(url);
};

export const navigateTo = (route: string, history: History) => history.push(route);

export const relocateToLoginPage = (): void => relocateTo(getEnvironmentVariable('LOGIN_URL'));
export const relocateToNavFrontpage = (): void => relocateTo('https://www.nav.no/');
export const relocateToSoknad = () => relocateTo(getRouteUrl(RouteConfig.SØKNAD_ROUTE_PREFIX));

export const navigateToSoknadFrontpage = (history: History): void =>
    navigateTo(RouteConfig.SØKNAD_ROUTE_PREFIX, history);
export const navigateToErrorPage = (history: History) => navigateTo(RouteConfig.ERROR_PAGE_ROUTE, history);
export const navigateToKvitteringPage = (history: History) => navigateTo(RouteConfig.SØKNAD_SENDT_ROUTE, history);
