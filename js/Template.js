class Template {
    static mainModal() {
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
    static catalogLoading() {
        return `<div style="text-align:center">
						<div class="loader" id='loader'></div>
						<br>
						<h1 id="nextlabel"style="color: #FF9800;display:none;">Loading Courses</h1>
						<h1 id="retrylabel"style="color: #F44336;display:none;">Failed to Load Courses</h1>
						<br>
						<button class=matbut id="retry" style="background: #F44336;display:none;">Retry</button>
				</div>`
    }
    static extensionButton() {
        return `<td data-th="Plus"><input type="image" class="distButton" id="distButton" width="20" height="20" src='${chrome.extension.getURL('images/disticon.png')}'/></td>`
    }

    static calendarLine(line) {
        return `<p class='time' style='font-size:large;'>
                    <span style='display:inline-block;'>${line[0]}:</span>
                    <span style='margin-left:10px;display:inline-block;text-align:center;'>${line[1]} to ${line[2]}</span>
                    <span style='float:right;display:inline-block;text-align:right;width: 25%;'>
                        <a target='_blank' style='color:#3c87a3;text-decoration:none;'href='${line[3]}'>${line[4]}</a>
                    </span>
                </p>`
    }


    static calendarModal() {
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