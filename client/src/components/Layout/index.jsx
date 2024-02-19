import React from 'react'
import Navbar from './Navbar'
import { Toaster } from 'react-hot-toast'

export default function Layout() {
    return (
        <>
            <Navbar />
            <Toaster />
        </>
    )
}
