// Messages.jsx
import React, { useEffect, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { StoreContext } from '@/stores/Store';
import { Section } from '@/components/Section';
import Dialogues from './Dialogues';
import Dialogue from './Dialogue';

const Messages = () => {
    return (
        <Routes>
            <Route path={`/`} element={<Dialogues />} />

            {/* <Route path="*" element={<Navigate to="/" />} /> */}
        </Routes>
    );
};

export default Messages;
