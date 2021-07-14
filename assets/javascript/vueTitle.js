Vue.component("mytitle", {
    props: {
        text: {
            type: String,
            required: true
        },
    },
    template:
        `<div class="container-fluid">
            <div class='row'>
                <div class='col pb-2 slider'>
                    <div class='sliding title'>{{text}}</div>
                </div>
            </div>
        </div>`
});

$(document).ready(function() {
    new Vue({
        el: "#title-container",
        data: {
            titleText: "RetroRoom",
        }
    });
});