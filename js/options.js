var manifestData = chrome.runtime.getManifest();
$("#version").text(manifestData.version);

chrome.storage.sync.get("options", function (data) {
    if (data.options) {
        console.log(data.options);
        Object.keys(data.options).forEach(key => {
            let enabled = data.options[key];
            $("#options_container").append(Template.Options.options_row(key, enabled));
        });
    }
});

$("body").on("click", "button", function () {
    let key = $(this).attr("id");
    let old_status = $(this).val() === "true";
    let new_status = !old_status;
    chrome.runtime.sendMessage(
        {
            command: "setOptionsValue",
            key: key,
            value: new_status,
        },
        function (response) {
            console.log(response.value);
            toggle(key, response.value);
            updateAllTabsCourseList();
        }
    );
});

$.get("https://api.github.com/repos/sghsri/UT-Registration-Plus/stats/contributors", data => {
    data = data.sort((a, b) => b.total - a.total);
    console.log("data", data);
    for (var contributorData of data) {
        $.get(`https://api.github.com/users/${contributorData.author.login}`, userData => {
            let fullData = { ...contributorData, ...userData };
            let { login, avatar_url, html_url } = fullData;
            $("#contributor-list").append(Template.Options.contributor_card(login, "name", avatar_url, html_url));
        });
    }
});

$("body").on("click", ".contributor-card", function () {
    console.log("hello world");
    window.open($(this).data("url"), "_blank");
});

function toggle(key, value) {
    let button_text = value ? "Turn Off" : "Turn On";
    let button_color = value ? Colors.closed : Colors.open;
    $(`#${key}`).text(button_text);
    $(`#${key}`).css("background", button_color);
    $(`#${key}`).val(value);
}
