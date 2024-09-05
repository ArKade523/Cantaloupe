import React from "react";
import Pages from "../../types/Pages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faFileWaveform, faGear, faGears, faWaveSquare } from "@fortawesome/free-solid-svg-icons";
import { faUsb } from "@fortawesome/free-brands-svg-icons";

function Sidebar({ setCurrentPage }: { setCurrentPage: (page: Pages) => void }) {
    return (
        <div className="sidebar">
            <h2>Cantaloupe</h2>
            <hr />
            <button onClick={() => setCurrentPage(Pages.LIVE_TRAFFIC)}><FontAwesomeIcon icon={faWaveSquare} /> Live Traffic</button>
            <button onClick={() => setCurrentPage(Pages.DBCEDITOR)}><FontAwesomeIcon icon={faFileWaveform} /> DBCEditor</button>
            <button onClick={() => setCurrentPage(Pages.SETUP_DEVICES)}><FontAwesomeIcon icon={faUsb} /> Setup Devices</button>
            <button onClick={() => setCurrentPage(Pages.SCRIPTING)}><FontAwesomeIcon icon={faGears} /> Scripting</button>
            <div className="margin-top-auto">
                <button onClick={() => setCurrentPage(Pages.PROFILE)}><FontAwesomeIcon icon={faCircleUser} /></button>
                <button onClick={() => setCurrentPage(Pages.SETTINGS)}><FontAwesomeIcon icon={faGear} /></button>
            </div>
        </div>
    );
}

export default Sidebar;