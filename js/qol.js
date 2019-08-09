if (document.querySelector('#fos_fl')) {
    let params = (new URL(document.location)).searchParams;
    let dep = params.get("fos_fl");
    let level = params.get("level");
    if (dep && level) {
        if (dep.length == 3 && (level == 'U' || level == 'L' || level == 'G')) {
            document.querySelector('#fos_fl').value = dep;
            document.querySelector('#level').value = level;
        }
    }
}