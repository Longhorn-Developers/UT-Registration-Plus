class Template {}

Template.Main = class {
    static modal() {
        return `<div class=modal id=myModal>
                    <div class=modal-content>
                    <span class=close>×</span>
                    <div class=card>
                            <div class=cardcontainer>
                            <h2 class=title id="title">Computer Fluency (C S 302)</h2>
                            <h2 class=profname id="profname">with <a id="professor_link">Bruce Porter</a></h2>
                            <div id="topbuttons" class=topbuttons>
                                    <button class=material-button id="rateMyProf" style="background: #4CAF50;"> RMP </button>
                                    <button class=material-button id="eCIS" style="background: #CDDC39;"> eCIS </button>
                                    <button class=material-button id="textbook" style="background: #FFC107;"> Textbook </button>
                                    <button class=material-button id="Syllabi"> Past Syllabi </button>
                                    <button class=material-button id="saveCourse" value="add" style="background: #F44336;"> Save Course +</button>
                                </div>
                            </div>
                        </div>
                        <div class=card>
                            <div class=cardcontainer style="">
                                <div class="chartloader">
                                    <div class="loader" id='descload'></div>
                                </div>
                                <ul class=description id="description" style="list-style-type:disc"></ul>
                            </div>
                        </div>
                        <div class=card style='text-align:center'>
                            <select id="semesters" style='text-align-last:center;color:#666666;fill:#666666;'>
                            </select>
                            <div class="chartloader">
                                <div class="loader" id='chartload'></div>
                            </div>
                            <div id="chartcontainer" class=cardcontainer>
                                <div id=chart></div>
                            </div>
                        </div>
                    </div>
                </div>`;
    }
    static extension_button() {
        return `<td data-th="Plus"><input type="image" class="distButton" id="distButton" width="20" height="20" src='${chrome.extension.getURL("images/disticon.png")}'/></td>`;
    }
};
Template.Catalog = class {
    static loading() {
        return `<div style="text-align:center">
                        <div class="loader" id='loader'></div>
                        <br>
                        <h1 id="nextlabel"style="color: #FF9800;display:none;">Loading Courses</h1>
                        <h1 id="retrylabel"style="color: #F44336;display:none;">Failed to Load Courses</h1>
                        <br>
                        <button class=material-button id="retry" style="background: #F44336;display:none;">Retry</button>
                </div>`;
    }
};
Template.UTPlanner = class {
    static modal() {
        return `<div class=modal id=myModal>
                    <div class=modal-content>
                    <span class=close>×</span>
                    <div class=card>
                            <div class=cardcontainer>
                            <h2 class=title id="title">Computer Fluency (C S 302)</h2>
                            <h2 class=profname id="profname" style="margin-bottom:0px;">with Bruce Porter</h2>
                            <div id="topbuttons" class=topbuttons>
                                    <button class=material-button id="moreInfo" style="background: #2196F3;"> More Info </button>
                                    <button class=material-button id="textbook" style="background: #FFC107;"> Textbook </button>
                                    <button class=material-button id="Syllabi"> Past Syllabi </button>
                                    <button class=material-button id="saveCourse" value="add" style="background: #F44336;opacity:.4;"> Unable to Save</button>
                                </div>
                            </div>
                        </div>
                        <div class=card style='text-align:center'>
                            <select id="semesters" style='text-align-last:center;color:#666666;fill:#666666;'>
                            </select>
                            <div class="chartloader">
                                <div class="loader" id='chartload'></div>
                            </div>
                            <div id="chartcontainer" class=cardcontainer>
                                <div id=chart></div>
                            </div>
                        </div>
                    </div>
                </div>`;
    }
};
Template.Calendar = class {
    static line(line) {
        let { days, start_time, end_time, location_link, location_full } = line;
        return `<p class='time' style='font-size:large;'>
                    <span style='display:inline-block;'>${days}:</span>
                    <span style='margin-left:10px;display:inline-block;text-align:center;'>${start_time} to ${end_time}</span>
                    <span style='float:right;display:inline-block;text-align:right;width: 25%;'>
                        <a target='_blank' style='color:#3c87a3;text-decoration:none;'href='${location_link}'>${location_full}</a>
                    </span>
                </p>`;
    }
    static modal() {
        return `<div id="myModal" class="modal">
                    <div class="modal-content">
                    <span class="close">&times;</span>
                    <div class="card">
                        <div id="colorStrip" style="height:10px;"></div>
                        <div class="cardcontainer">
                            <div id='header'>
                                <div style="display:flex;">
                                    <h2 id="classname">Classname</h2>
                                </div>
                                <p id="prof">Prof</p>
                            </div>
                            <button id="info" class="matbut" style="font-size:medium; margin-right: auto; margin-left:auto; background: #2196F3;">More Info</button>
                            <button id="register" class="matbut" style="font-size:medium; margin-right: auto; margin-left:10px; background: #4CAF50;">Register</button>
                            <button id="remove" class="matbut" style="font-size:medium;margin:10px;background: #FF0000;">Remove</button>
                        </div>
                    </div>
                </div>`;
    }
};
Template.Popup = class {
    static list_item(i, list_tile_color, unique, department, number, profname, list_sub_color, line) {
        return `<li id='${i}' class='course_list_item'>
                                <div class='card course_list_card'>
                                    <div class='container' style='background:${list_tile_color}'>
                                        <button class='moveUp_button' id='moveUpButton' title='Move Up' value='moveUp'>
                                            <i id='moveUpicon' class="material-icons moveUp_button_icon">move_up</i>
                                        </button>
                                        <button class='copy_button' title='Copy Unique #' value='${unique}'>
                                            <i id='copyicon' class="material-icons copy_button_icon">content_copy</i>
                                        </button>
                                        <h4 class='course_name_truncate_box'>
                                            <b>${department} ${number} <span class='course_list_item_subtext'> with ${profname} (${unique})</span></b>
                                        </h4>
                                        <p id='arrow' class='arrow'>&#9658;</p>
                                    </div>
                                </div>
                                <div id='moreInfo' class='course_list_item_options'>
                                    <p style='background-color:${list_sub_color};' class='course_list_item_time_box'>${line}</p>
                                    <div id='infoButtons' class='course_list_item_options_button_container'>
                                        <button class='material_button course_list_item_options_buttons remove_button' id='listRemove'>Remove</button>
                                        <button class='material_button course_list_item_options_buttons register_button' id='register'>Register</button>
                                        <button class='material_button course_list_item_options_buttons more_info_button' id='listMoreInfo'>More Info</button>
                                    </div>
                                </div>
                            </li>`;
    }

    static conflict_message(conflict_message) {
        return `<p id='conflict' class='conflict_message'>${conflict_message}</>`;
    }

    static line(line) {
        let { days, start_time, end_time, location_link, location_full } = line;

        return `<span class='time_line_days'>${days}:</span>
                <span class='time_line_hours'>${start_time} to ${end_time}</span>
                <span class='time_line_location'>
                    <a target='_blank' class= 'time_line_location_link' href='${location_link}'>${location_full}</a>
                </span>
                <br>`;
    }
};
Template.Import = class {
    static import_button() {
        return `<button class='material-button' id='import' style='margin:15px 0px;'>${Text.button_text_default}</button><br>`;
    }

    static waitlist_import_button() {
        return `<button class='material-button' id='import_waitlist' style='margin:0px'>${Text.waitlist_button_text_default}</button><br>`;
    }

    static store_waitlist_message() {
        return `<h1 id="nextlabel"style="color: #FF9800;display:none;"></h1>`;
    }
};

Template.Options = class {
    static options_row(key, enabled) {
        let button_text = enabled ? "Turn Off" : "Turn On";
        let button_color = enabled ? Colors.closed : Colors.open;
        let label_text = capitalizeString(key.replace(/([A-Z]+)*([A-Z][a-z])/g, "$1 $2"));
        return `<h2 style="padding: 5px 16px 5px 16px; font-weight: normal;display: inline-block;text-align:left;">
                    ${label_text}
                </h2>
                <button id="${key}" value=${enabled} class="material-button" style="display:inline-block;font-size:medium; float:right; background:${button_color}">
                    ${button_text}
                </button>
                <br>`;
    }

    static contributor_card(username, name, image_url, profile_url) {
        return `<div class='card contributor-card' id="${username}" data-url="${profile_url}">
                    <img class='contributor-image' src="${image_url}"></img>
                    ${name ? `<p class='contributor-name'>${name}</p>` : ""}
                    <p class='contributor-username'>${username}</p>
                </div>`;
    }
};
