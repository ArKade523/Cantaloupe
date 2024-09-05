import React from 'react'
import DBCEditor from './dbcgen/DBCEditor'
import Sidebar from './components/Sidebar'
import Pages from '../types/Pages'

function App() {
    const [currentPage, setCurrentPage] = React.useState(Pages.DBCEDITOR)

    return (
        <>
            <Sidebar setCurrentPage={setCurrentPage}/>
            {
                currentPage === Pages.DBCEDITOR && <DBCEditor />
            }
        </>
    )
}

export default App
