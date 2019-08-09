function mainModal() {
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
                    <ul class=description id="description" style="list-style-type:disc"></ul>
                </div>
            </div>
            <div class=card style='text-align:center'>
                <select id="semesters" style='text-align-last:center;color:#666666;fill:#666666;'>
                </select>
                <div id="chartcontainer" class=cardcontainer>
                    <div id=chart></div>
                </div>
            </div>
        </div>
    </div>`
}