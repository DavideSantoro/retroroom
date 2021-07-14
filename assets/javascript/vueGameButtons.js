Vue.component("buttonsheader", {
    props: {
        button1: {
            type: String,
            required: true
        },
        button2: {
            type: String,
            required: true
        },
    },
    template:
        `<div class="row pt-2 justify-content-center">
            <div class="col-md-2 pb-2">
                <a href="../index.php" class="btn btn-lg">
                    <span class="fas fa-home"></span>
                    {{button1}}
                </a>
            </div>
            <div class="col-md-2 pb-2">
                <a href="../leaderboards/index.php" class="btn btn-lg">
                    <span class="fas fa-trophy"></span>
                    {{button2}}
                </a>
            </div>
        </div>`
});

$(document).ready(function() {
    new Vue({
        el: "#buttons-container",
        data: {
            text1: "Home",
            text2: "Top-5",
        }
    });
});