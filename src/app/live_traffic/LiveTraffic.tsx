import React, { useState } from "react";
import Toggle from "../components/Toggle";
import { faChartBar, faChartLine, faChartPie, faCircle, faFile, faFilter, faGauge, faList,
         faNetworkWired, faPlay, faRecordVinyl, faSatelliteDish, faSave, faSearch, faShare, 
         faStar, faStop, faTable, faTrash, 
         faXmarkCircle} 
    from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function LiveTraffic() {
    const [isRecording, setIsRecording] = useState(false);
    const [viewCount, setViewCount] = useState(1);
    const [view, setView] = useState(0);
    const [activeBuses, setActiveBuses] = useState([0, 1]);
    const [activeDBCs, setActiveDBCs] = useState(["test_dbc1.dbc", "test_dbc2.dbc"]);

    return (
        <div className="inner-application">
            <div className="toolbar">
                <div className="tool-section">
                    <div className="tool" style={{maxWidth: "6rem"}}>
                        <Toggle onSVG={faPlay} 
                            offSVG={faStop} 
                            onToggle={() => {
                                setIsRecording(!isRecording);
                            }} 
                            isToggled={!isRecording} 
                            color={isRecording ? "#e56" : "#485"}
                            fontSize="2rem" 
                            id="live-traffic-toggle"
                        />
                        <label htmlFor="#live-traffic-toggle">{isRecording ? "Stop " : "Start "} Live Capture</label>
                    </div>
                    <div className="tool-section-subgroup-column">
                        <div className="tool">
                            <button id="live-traffic-clear">
                                <FontAwesomeIcon icon={faTrash} color="#666" fixedWidth />
                                Clear
                            </button>
                        </div>
                        <div className="tool">
                            <button id="live-traffic-clear">
                                <FontAwesomeIcon icon={faSave} color="#666" fixedWidth />
                                Save
                            </button>
                        </div>
                        <div className="tool">
                            <button id="live-traffic-clear">
                                <FontAwesomeIcon icon={faShare} color="#666" fixedWidth />
                                Share
                            </button>
                        </div>
                    </div>
                </div>
                <div className="divider"></div>
                <div className="tool-section">
                    <div className="toolbar-section-subsection-column">
                        <div className="tool" id="live-traffic-filter">
                            <FontAwesomeIcon icon={faSearch} color="#666" fixedWidth />
                            <input type="text" placeholder="Search"/>
                        </div>
                        <div className="tool">
                            <button>
                                <FontAwesomeIcon icon={faList} color="#666" fixedWidth />
                                Advanced Search
                            </button>
                        </div>
                        <div className="tool">
                            <button>
                                <FontAwesomeIcon icon={faFilter} color="#666" fixedWidth />
                                Filter
                            </button>
                        </div>
                    </div>
                </div>
                <div className="divider"></div>
                <div className="tool-section">
                    <div className="tool" style={{maxWidth: "6rem"}}>
                        <button id="live-traffic-view-configuration">
                            <FontAwesomeIcon icon={faTable} color="#666" fontSize="2rem" fixedWidth />
                        </button>
                        <label htmlFor="live-traffic-view-configuration">View Configuration</label>
                    </div>
                    <div className="tool-section-subgroup-column">
                        <div className="tool">
                            <label htmlFor="live-traffic-view-mode">View mode: </label>
                            <select id="live-traffic-view-mode">
                                <option value="1">Stack</option>
                                <option value="2">Grouped</option>
                                <option value="3">Raw</option>
                            </select>
                        </div>
                        <div className="flex-row">
                            <div className="tool">
                                <button id="live-traffic-bus-config">
                                    <FontAwesomeIcon icon={faNetworkWired} color="#666" fontSize="1rem" fixedWidth />
                                </button>
                                <label htmlFor="live-traffic-bus-config">Bus Config</label>
                            </div>
                            <div className="tool">
                                <button id="live-traffic-dbc-config">
                                    <FontAwesomeIcon icon={faFile} color="#666" fontSize="1rem" fixedWidth />
                                </button>
                                <label htmlFor="live-traffic-dbc-config">DBC Config</label>
                            </div>
                        </div>
                    </div>
                    <div className="tool" style={{maxWidth: "6rem"}}>
                        <button id="live-traffic-scanning-tools">
                            <FontAwesomeIcon icon={faSatelliteDish} color="#666" fontSize="2rem" fixedWidth />
                        </button>
                        <label htmlFor="live-traffic-scanning-tools">Scanning Tools</label>
                    </div>
                </div>
                <div className="divider"></div>
                <div className="tool-section">
                    <div className="tool" style={{maxWidth: "6rem"}}>
                        <button id="live-traffic-recommended-charts">
                            <FontAwesomeIcon icon={faStar} color="#ec6" fontSize="2rem" fixedWidth />
                        </button>
                        <label htmlFor="live-traffic-recommended-charts">Recommended Charts</label>
                    </div>
                    <div className="tool-section-subgroup">
                        <div className="tool">
                            <button>
                                <FontAwesomeIcon icon={faChartLine} fontSize="1.25rem" color="#666" fixedWidth />
                            </button>
                        </div>
                        <div className="tool">
                            <button>
                                <FontAwesomeIcon icon={faGauge} fontSize="1.25rem" color="#666" fixedWidth />
                            </button>
                        </div>
                        <div className="tool">
                            <button>
                                <FontAwesomeIcon icon={faChartPie} fontSize="1.25rem" color="#666" fixedWidth />
                            </button>
                        </div>
                        <div className="tool">
                            <button>
                                <FontAwesomeIcon icon={faChartBar} fontSize="1.25rem" color="#666" fixedWidth />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="view-selector">
                {Array(viewCount).fill(0).map((_, i) => (
                    <button 
                        key={i} 
                        onClick={() => setView(i)}
                        className={view === i ? "active" : ""}
                    >
                        View {i + 1}
                    </button>
                ))}
                <button onClick={() => setViewCount(viewCount + 1)}>+</button>
            </div>
            <div className="traffic">
                <div className="status">
                    {isRecording && (
                        <div>
                            <FontAwesomeIcon icon={faRecordVinyl} color="#e56" fixedWidth />
                            <span style={{fontWeight: "bold"}}>Showing Live Capture Data</span>
                        </div>
                    )}
                    <div>
                        <span><em>Data from Buses: </em></span>
                        {activeBuses.map((bus, i) => (
                            <span className="bus" key={i}>Bus {bus + 1}
                                <button className="bus-list-item" onClick={() => {
                                    setActiveBuses(activeBuses.filter(b => b !== bus));
                                }}>
                                    <FontAwesomeIcon icon={faXmarkCircle} />
                                </button>
                            </span>
                        ))}
                        <span className="bus">
                            <button onClick={() => {
                                setActiveBuses([...activeBuses, activeBuses.length]);
                            }}>
                                +
                            </button>
                        </span>
                    </div>
                    <div>
                        <span><em>DBC Interpretation from: </em></span>
                        {activeDBCs.map((dbc, i) => (
                            <span className="bus" key={i}>{dbc}
                                <button className="bus-list-item" onClick={() => {
                                    setActiveDBCs(activeDBCs.filter(d => d !== dbc));
                                }}>
                                    <FontAwesomeIcon icon={faXmarkCircle} />
                                </button>
                            </span>
                        ))}
                        <span className="bus">
                            <button onClick={() => {
                                setActiveDBCs([...activeDBCs, `test_dbc${activeDBCs.length + 1}.dbc`]);
                            }}>+</button>
                        </span>
                    </div>
                </div>
                <div className="message-list">

                </div>
            </div>
        </div>
    );
}

export default LiveTraffic;
