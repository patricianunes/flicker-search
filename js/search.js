let currentPage = 1;
let maxPages;

//nested aka helper function returnks a thumbnail url for given a photo obj
//create url for the photo
const generateURL = p => {
  return [
    'http://farm',
    p.farm,
    '.static.flickr.com/',
    p.server,
    '/',
    p.id,
    '_',
    p.secret,
    '_q.jpg'
  ].join('');
}


//process the results
const showImages = results => {
  results.photos.photo.forEach(photo => {
    const thumbnailURL  = generateURL(photo);
    const photoURL = generateFlickrURL(photo, 'b');
    const owner = photo.owner;
    const id = photo.id;

    //create an image that display that photos
    const $img = $(`
      <a href="#ex1" rel="modal:open" class="item">
        <img src="${thumbnailURL}" data-photo="${photoURL}" data-id="${id}" data-owner="${owner}">
      </a>
    `);

    //shove that image into the page
    $img.appendTo('#images');
  });

};

const generateFlickrURL = function(photo, size='q') {
  return `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_${size}.jpg`
}


const searchFlickr = function (terms) {

  //JSONP
  //set url
  const flickrURL = 'https://api.flickr.com/services/rest?jsoncallback=?';

  //make request
  $.getJSON(flickrURL, {
    method: 'flickr.photos.search',
    api_key: '2f5ac274ecfac5a455f38745704ad084', //not secret key
    text: terms,
    format: 'json',
    page: currentPage,
  }).done(function(data) {

    showImages(data)
    console.log(data);

    $('.item').on('click', e => {
      e.preventDefault();
      const photo = $(e.target).data('photo');
      const owner = $(e.target).data('owner');
      const id = $(e.target).data('id');
      $('#ex1').html(`<a href="https://www.flickr.com/photos/${owner}/${id}"><img src="${photo}" /></a>`);
      
    });

    maxPages = data.photos.pages;
    currentPage++;

  })

};

$(document).ready(function () {
  $('#search').on('submit', function (event) {
    event.preventDefault(); //stay on this page

    //find the search term
    const query = $('#query').val();
    $('#images').empty();
    currentPage = 1

    searchFlickr(query);
  });

  $(window).on('scroll', function () {

    const scrollBottom = $(document).height() - ($(window).height() + $(window).scrollTop());

    if (scrollBottom <= 500 && scrollBottom % 500 === 0) {
      if (currentPage > maxPages && currentPage > 1) {
        console.log('no more results')
        
        return;
      };
      //more results
      const query = $('#query').val();
      searchFlickr(query);
    }
  })
});
