import React, { useState, useEffect } from "react";
import Pages from "../../types/Pages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faFileWaveform, faGear, faGears, faWaveSquare } from "@fortawesome/free-solid-svg-icons";
import { faUsb } from "@fortawesome/free-brands-svg-icons";

const MIN_WIDTH = 150;
const MAX_WIDTH = 400;
const DEFAULT_WIDTH = 250;
const COLLAPSED_WIDTH = 50;

function Sidebar({ currentPage, setCurrentPage }: { currentPage: Pages, setCurrentPage: (page: Pages) => void }) {
    const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH);
    const [isResizing, setIsResizing] = useState(false); 
    const [collapsed, setCollapsed] = useState(false);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsResizing(true);
        document.body.style.userSelect = 'none'; // Disable text selection
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing) return;
        const newWidth = e.clientX; 
        if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
            setSidebarWidth(newWidth);
            setCollapsed(false);
        } else if (newWidth < MIN_WIDTH) {
            setSidebarWidth(COLLAPSED_WIDTH); 
            setCollapsed(true);
        }

        if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
            document.documentElement.style.setProperty('--sidebar-width', `${newWidth}px`);
        } else if (newWidth < MIN_WIDTH) {
            document.documentElement.style.setProperty('--sidebar-width', `${COLLAPSED_WIDTH}px`);
        } else {
            document.documentElement.style.setProperty('--sidebar-width', `${MAX_WIDTH}px`);
        }
    };

    const handleMouseUp = () => {
        setIsResizing(false);
        document.body.style.userSelect = ''; // Re-enable text selection
    };

    // Add event listeners to track mouse movement while resizing
    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    return (
        <div className="sidebar">
            <h2>{!collapsed && 'Cantaloupe'}</h2>
            <hr />
            <button 
                className={currentPage == Pages.LIVE_TRAFFIC ? 'active' : ''} 
                onClick={() => setCurrentPage(Pages.LIVE_TRAFFIC)}
                title="Live Traffic"
            >
                <FontAwesomeIcon icon={faWaveSquare} />{!collapsed && ' Live Traffic'}
            </button>
            <button 
                className={currentPage == Pages.DBCEDITOR ? 'active' : ''} 
                onClick={() => setCurrentPage(Pages.DBCEDITOR)}
                title="DBC Editor"
            >
                <FontAwesomeIcon icon={faFileWaveform} />{!collapsed && ' DBC Editor'}
            </button>
            <button 
                className={currentPage == Pages.SETUP_DEVICES ? 'active' : ''} 
                onClick={() => setCurrentPage(Pages.SETUP_DEVICES)}
                title="Setup Devices"
            >
                <FontAwesomeIcon icon={faUsb} />{!collapsed && ' Setup Devices'}
            </button>
            <button 
                className={currentPage == Pages.SCRIPTING ? 'active' : ''} 
                onClick={() => setCurrentPage(Pages.SCRIPTING)}
                title="Scripting"
            >
                <FontAwesomeIcon icon={faGears} />{!collapsed && ' Scripting'}
            </button>
            <div className={`margin-top-auto ${collapsed && 'flex-column'}`}>
                <button 
                    className={currentPage == Pages.PROFILE ? 'active' : ''} 
                    onClick={() => setCurrentPage(Pages.PROFILE)}
                    title="Profile"
                >
                    <FontAwesomeIcon icon={faCircleUser} />
                </button>
                <button 
                    className={currentPage == Pages.SETTINGS ? 'active' : ''} 
                    onClick={() => setCurrentPage(Pages.SETTINGS)}
                    title="Settings"
                >
                    <FontAwesomeIcon icon={faGear} />
                </button>
            </div>
            <div className={`resizer ${isResizing && 'active'}`} onMouseDown={handleMouseDown}></div>
        </div>
    );
}

export default Sidebar;