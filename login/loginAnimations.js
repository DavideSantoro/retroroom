$(document).ready(() => {
    // gestisce l'animazione per scambiare la posizione del form di login e quello di registrazione
    $('.link').click(function() {
        $('form').animate({height: "toggle", opacity:"toggle"},"slow"); // sposta un form verso l'alto e uno verso il basso
        $('.phpMessage').html(""); // serve per rimuovere il messaggio di errore
    });
    // gestisce l'animazione che scuote le immagini
    $('.img-shake').mouseover(function() {
        $('.img-shake').css("animation","shake 0.5s");
        $('.img-shake').css("animation-iteration-count","infinite");
    });
    $('.img-shake').mouseleave(function() {
        $('.img-shake').css("animation","none");
    });
});