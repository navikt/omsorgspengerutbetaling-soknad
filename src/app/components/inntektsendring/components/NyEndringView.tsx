import React, {useState} from "react";
import EndringsModal from "./EndringsModal";
import {Endring} from "../types";
import {Knapp} from "nav-frontend-knapper";

interface Props {
    onSaveNewEndring: (endring: Endring) => void;
}

const NyEndringView: React.FC<Props> = ({onSaveNewEndring}: Props): JSX.Element => {

    const [nyEndringModalIsOpen, setNyEndringModalIsOpen] = useState<boolean>(false);

    const handleSaveEndring = (endring: Endring): void => {
        onSaveNewEndring(endring);
    };

    return (
        <div>
            <Knapp title={'Ny endring'} onClick={() => setNyEndringModalIsOpen(true)}>Ny Endring</Knapp>

            <EndringsModal
                saveEndring={(endring: Endring) => handleSaveEndring(endring)}
                maybeEndring={undefined}
                isOpen={nyEndringModalIsOpen}
                onRequestClose={() => setNyEndringModalIsOpen(false)}
            />
        </div>
    )
};

export default NyEndringView;
