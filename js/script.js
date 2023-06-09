import Slide from './slide.js';

const slide = new Slide('.slide' , '.slide-wrapper');
console.log(slide)
slide.init();
slide.changeSlide(4)