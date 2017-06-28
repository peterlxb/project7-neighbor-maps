var initialCats = [{
    clickCount: 0,
    name: 'Tabby',
    imgSrc: 'img/cat1.jpg',
    nickname: ['Tabby']
},
{
    clickCount: 0,
    name: 'Shabby',
    imgSrc: 'img/cat2.jpg',
    nickname: ['Shabby']
},
{
    clickCount: 0,
    name: 'Tiger',
    imgSrc: 'img/cat3.jpg',
    nickname: ['Toger']
},
{
    clickCount: 0,
    name: 'Hoop',
    imgSrc: 'img/cat4.jpg',
    nickname: ['Hoop']
},
{
    clickCount: 0,
    name: 'Zzzzz',
    imgSrc: 'img/cat5.jpg',
    nickname: ['Zzzzz']
},
]

var Cat = function(data) {

  this.name = ko.observable(data.name);
  this.clickCount = ko.observable(data.clickCount);
  this.imgSrc = ko.observable(data.imgSrc);
  this.nicknames = ko.observableArray(data.nickname);

  this.title = ko.computed(function() {
    var title;
    var clicks = this.clickCount();
    if(clicks < 5){
      title = 'newBorn';
    } else if(clicks < 10){
      title = 'infant';
    } else if( clicks < 15) {
      title = 'young';
    }
    return title;
  },this);

};

var ViewModel = function() {
  var self = this;
  this.catList = ko.observableArray([]);

  initialCats.forEach(function(item){
    self.catList().push(new Cat(item));
  });

  this.currentCat = ko.observable(this.catList()[0]);

  this.incrementCount = function() {
    self.currentCat().clickCount(self.currentCat().clickCount() + 1);
  };

  this.setcat = function(clickedcat) {
    self.currentCat(clickedcat);
  }

};

ko.applyBindings(new ViewModel());
