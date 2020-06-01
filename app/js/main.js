$(function () {

   /* $('.decrement').click(function () {
        var $input = $(this).parent().find('input');
        var count = parseInt($input.val()) - 1;
        count = count < 1 ? 1 : count;
        $input.val(count);
        $input.change();
        return false;
    });
    $('.increment').click(function () {
        var $input = $(this).parent().find('input');
        $input.val(parseInt($input.val()) + 1);
        $input.change();
        return false;
    });*/
});


const input = document.querySelector('input[type=text]');

document.addEventListener('click', e => {
     const  up = e.target.closest('.increment');
        down = e.target.closest('.decrement');
        let count = input.value;
    if (!down || !up) {
        e.preventDefault()
    }

    if (down) {
      return --count;
    }

    if (up) {
      return   ++count;
    }


    /*increment(e);
    decrement(e);
*/
});

const increment = e => {
    const up = e.target.closest('.increment');
    /!*let count = input.value;*!/

    if (!up) {
        e.preventDefault();
    }

    return ++input.value;
};

const decrement = e => {
   const down = e.target.closest('.decrement');
   let count =  input.value;

   if (!down) {
       e.preventDefault();
   }


    return --input.value;
};

