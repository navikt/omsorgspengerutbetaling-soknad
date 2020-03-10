import * as React from 'react';
import FormBlock from "common/components/form-block/FormBlock";
import Box from "common/components/box/Box";

interface Props {
    putPropsHere?: string
}

const PeriodeForm: React.FC<Props> = (props: Props) => {
    return (
        <FormBlock>
            <Box>
                <div>
                    SPESIFISERING AV PERIODE KOMMER HER.
                </div>
            </Box>
        </FormBlock>
    )
};

export default PeriodeForm;