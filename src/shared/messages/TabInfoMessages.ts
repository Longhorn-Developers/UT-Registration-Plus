type TabInfo = {
    url: string;
    title: string;
};

interface TabInfoMessages {
    /**
     * Gets the info for the tab receiving the message
     *
     * @returns The info for the tab receiving the message
     */
    getTabInfo: () => TabInfo;
}

export default TabInfoMessages;
