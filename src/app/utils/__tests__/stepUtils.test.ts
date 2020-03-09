jest.mock('./../../validation/stepValidations', () => {
    return {
        welcomingPageIsValid: jest.fn(() => true),
        opplysningerOmBarnetStepIsValid: jest.fn(() => true),
        arbeidStepIsValid: jest.fn(() => true),
        medlemskapStepIsValid: jest.fn(() => true),
        legeerklæringStepIsValid: jest.fn(() => true)
    };
});
