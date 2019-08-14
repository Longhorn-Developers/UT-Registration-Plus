class Template {
    static Main = class Main {
        static modal() {
            return `<div class=modal id=myModal>
                        <div class=modal-content>
                        <span class=close>×</span>
                        <div class=card>
                                <div class=cardcontainer>
                                <h2 class=title id="title">Computer Fluency (C S 302)</h2>
                                <h2 class=profname id="profname">with Bruce Porter</h2>
                                <div id="topbuttons" class=topbuttons>
                                        <button class=matbut id="rateMyProf" style="background: #4CAF50;"> RMP </button>
                                        <button class=matbut id="eCIS" style="background: #CDDC39;"> eCIS </button>
                                        <button class=matbut id="textbook" style="background: #FFC107;"> Textbook </button>
                                        <button class=matbut id="Syllabi"> Past Syllabi </button>
                                        <button class=matbut id="saveCourse" style="background: #F44336;"> Save Course +</button>
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
                    </div>`
        }
        static extension_button() {
            return `<td data-th="Plus"><input type="image" class="distButton" id="distButton" width="20" height="20" src='${chrome.extension.getURL('images/disticon.png')}'/></td>`
        }
    }

    static Catalog = class Catalog {
        static loading() {
            return `<div style="text-align:center">
                            <div class="loader" id='loader'></div>
                            <br>
                            <h1 id="nextlabel"style="color: #FF9800;display:none;">Loading Courses</h1>
                            <h1 id="retrylabel"style="color: #F44336;display:none;">Failed to Load Courses</h1>
                            <br>
                            <button class=matbut id="retry" style="background: #F44336;display:none;">Retry</button>
                    </div>`
        }
    }


    static Calendar = class Calendar {
        static line(line) {
            let {
                days,
                start_time,
                end_time,
                location_link,
                location_full
            } = line;
            return `<p class='time' style='font-size:large;'>
                        <span style='display:inline-block;'>${days}:</span>
                        <span style='margin-left:10px;display:inline-block;text-align:center;'>${start_time} to ${end_time}</span>
                        <span style='float:right;display:inline-block;text-align:right;width: 25%;'>
                            <a target='_blank' style='color:#3c87a3;text-decoration:none;'href='${location_link}'>${location_full}</a>
                        </span>
                    </p>`
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
                    </div>`
        }
    }

    static Popup = class Popup {
        static list_item(i, list_tile_color, unique, department, number, profname, list_sub_color, line) {
            return `<li id='${i}'style='padding: 0px 5px 5px 5px; overflow-y: auto;max-height:400px;'>
                                    <div class='card'>
                                        <div class='container' style='background:${list_tile_color}'>
                                        <button class='copybut' title='Copy Unique #' id='copybut' value='${unique}'>
                                            <i style='color:white;float:left;text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.16);font-size:x-large;' id='copyicon' class="material-icons copy">content_copy
                                            </i>
                                      </button>
                                            <h4 class='truncate' style='color:white;margin:5px; display:inline-block;font-size:large;align-items:center;'>
                                                <b>${department} ${number} <span style='font-size:medium'> with <span style='font-size:medium'>${profname} (${unique})</span></b>
                                            </h4>
                                            <p id='arrow' style='float:right;font-size:small;display:inline-block;margin-top:10px;color:white;font-family: sans-serif'>&#9658;</p>
                                        </div>
                                    </div>
                                    <div id='moreInfo' style='display: none;'>
                                        <p style='font-weight:bold;padding:10px;margin:0px 5px 0px 15px;font-size:small;background-color:${list_sub_color};'>${line}</p>
                                        <div id='infoButtons' style='border-radius:0px;'>
                                            <button class='matbut' id='listRemove'style='float:right;background:#F44336; margin:5px;'>Remove</button>
                                            <button class='matbut' id='register' style='float:right;background:#4CAF50; margin:5px;'>Register</button>
                                            <button class='matbut' id='listMoreInfo' style='float:right;background:#2196F3; margin:5px;'>More Info</button>
                                        </div>
                                    </div>
                                </li>`;
        }

        static conflict_message(conflict_message) {
            return `<p id='conflict' style='font-size:small; font-weight:bold; color:red; margin:5px 5px 5px 10px'>${conflict_message}</>`
        }

        static line(line) {
            let {
                days,
                start_time,
                end_time,
                location_link,
                location_full
            } = line;

            return `<span style='display:inline-block;width: 20%;'>${days}:</span>
                    <span style='margin-left:10px;display:inline-block;width: 50%;text-align:center;'>${start_time} to ${end_time}</span>
                    <span style='float:right;display:inline-block;text-align:right;width: 25%;'>
                        <a target='_blank' style='color:#3c87a3;text-decoration:none;'href='${location_link}'>${location_full}</a>
                    </span>
                    <br>`
        }
    }


    static Import = class Import {

        static button_text_default = "<span style='font-size:small'>Import to </span><b>UT Reg +<b>";
        static waitlist_button_text_default = "<span style='font-size:small'>Import Waitlists to </span><b>UT Reg +<b>";
        static button_success = "Courses Saved!";
        static import_button() {
            return `<button class='matbut' id='import' style='margin:15px 0px;'>${this.button_text_default}</button><br>`;
        }

        static waitlist_import_button() {
            return `<button class='matbut' id='import_waitlist' style='margin:0px'>${this.waitlist_button_text_default}</button><br>`;
        }
    }

}