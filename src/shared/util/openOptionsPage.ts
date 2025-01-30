/**
 * Handles the opening of the options page.
 * Uses the browser runtime API to open the options page and logs the result.
 */
export const handleOpenOptions = async () => {
    // const url = browser.runtime.getURL('/options.html');
    // background.openNewTab({ url });
    browser.runtime.openOptionsPage().then(
        () => {
            console.log('Options page opened');
        },
        onError => {
            console.log('Error opening options page');
            console.error(onError);
        }
    );
};
