interface CESMessage {
    /**
     * Opens the CES page for the specified instructor
     *
     * @param data - First and last name of the instructor
     */
    openCESPage: (data: { instructorFirstName: string; instructorLastName: string }) => chrome.tabs.Tab;
}

export default CESMessage;
