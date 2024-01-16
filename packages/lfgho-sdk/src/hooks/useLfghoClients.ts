import React from 'react';
import { LfghoContext } from '..';

export const useLfghoClients = () => {
    const context = React.useContext(LfghoContext);
    if (!context) {
        throw new Error(
            'useLfghoClients must be used within a UserContextProvider'
        );
    }

    return context;
};
