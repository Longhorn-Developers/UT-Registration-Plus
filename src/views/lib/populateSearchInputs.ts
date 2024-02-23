/**
 * The course schedule page has a search form that allows users to search for courses by department and course level.
 * The problem is that once the user triggers a search and refreshes the page,
 * for some reason the search form is cleared and the user has to re-enter their search parameters. This fixes that lol
 */
export function populateSearchInputs() {
    let params = new URL(window.location.href).searchParams;
    let department = params.get('fos_fl');
    let courseLevel = params.get('level');
    if (!department || !courseLevel) return;

    const depInput = document.querySelector<HTMLInputElement>('#fos_fl');
    const levelInput = document.querySelector<HTMLInputElement>('#level');

    if (!depInput || !levelInput) return;

    depInput.value = department;
    levelInput.value = courseLevel;
}
