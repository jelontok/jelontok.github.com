$(document).ready(function(){
    // http://css-tricks.com/snippets/jquery/smooth-scrolling/
    // Select all links with hashes
    $('a[href*="#"]')
      // Remove links that don't actually link to anything
      .not('[href="#"]')
      .not('[href="#0"]')
      .click(function(event) {
        // On-page links
        if (
          location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
          && 
          location.hostname == this.hostname
        ) {
          // Figure out element to scroll to
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
          // Does a scroll target exist?
          if (target.length) {
            // Only prevent default if animation is actually gonna happen
            event.preventDefault();
            $('html, body').animate({
              scrollTop: target.offset().top
            }, 1000, function() {
              // Callback after animation
              // Must change focus!
              var $target = $(target);
              $target.focus();
              if ($target.is(":focus")) { // Checking if the target was focused
                return false;
              } else {
                $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
                $target.focus(); // Set focus again
              };
            });
          }
        }
      });
    
    $('#top button').click(function(){
        if ($('.fa', this).hasClass('fa-bars')) {
            $('#top #nav').fadeIn();
            $('.fa', this).removeClass('fa-bars').addClass('fa-times');
            $('#top button').css({color: '#fff'})
        } else {
            $('#top #nav').fadeOut();
            $('.fa', this).removeClass('fa-times').addClass('fa-bars');                    
        }
    });
    
    $(window).scroll(function() {
       if($(window).scrollTop() > $(window).height() && $('#top button .fa').hasClass('fa-bars')) {
           $('#top button').css({color: '#333'})
       } else {
           $('#top button').css({color: '#fff'})
       }
    });            
});