import React from 'react'
import DBCEditor from './dbcgen/DBCEditor'
import Sidebar from './components/Sidebar'
import Pages from '../types/Pages'
import LiveTraffic from './live_traffic/LiveTraffic'

function App() {
    const [currentPage, setCurrentPage] = React.useState(Pages.DBCEDITOR)

    return (
        <>
            <Sidebar setCurrentPage={setCurrentPage} currentPage={currentPage}/>
            { currentPage === Pages.DBCEDITOR && <DBCEditor /> }
            { currentPage === Pages.LIVE_TRAFFIC && <LiveTraffic /> }
        </>
    )
}

export default App
