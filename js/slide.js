export default class Slide {
    constructor(slide , wrapper) {
        this.slide = document.querySelector(slide);
        this.wrapper = document.querySelector(wrapper);
        this.dist = {
            finalPosition: 0,
            starX: 0,
            movement: 0
        }
    }

    updatePosition(clientX) {
        this.dist.movement = (this.dist.starX - clientX) * 1.8;
        return this.dist.finalPosition - this.dist.movement;
    }

    moveSlide(distX) {
        this.dist.movePosition = distX;
        this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
    }

    onStart(event) {
        let moveType;
        if (event.type === 'mousedown') {
            event.preventDefault();
            this.dist.starX = event.clientX;
            moveType = 'mousemove';
        } else {
            this.dist.starX = event.changedTouches[0].clientX;
            moveType = 'touchmove'
        }
        this.wrapper.addEventListener(moveType, this.onMove);
    }

    onMove(event) {
        const pointerPosition = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX;
        const finalPosition = this.updatePosition(pointerPosition);
        this.moveSlide(finalPosition);
    }

    onEnd(event) {
        const moveType = (event.type === 'mouseup') ? 'mousemove' : 'touchmove'
        this.wrapper.removeEventListener(moveType, this.onMove); 
        this.dist.finalPosition = this.dist.movePosition;
    }

    addSlideEvents() {
        this.wrapper.addEventListener('mousedown', this.onStart);
        this.wrapper.addEventListener('touchstart', this.onStart);
        this.wrapper.addEventListener('mouseup', this.onEnd);        
        this.wrapper.addEventListener('touchend', this.onEnd);        
    }

    bindEvents() {
        this.onStart = this.onStart.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onEnd = this.onEnd.bind(this);
        this.updatePosition = this.updatePosition.bind(this);
        this.slidesConfig = this.slidesConfig.bind(this);
    }
    //slides config

    slidePosition(slide) {
        const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
        return -(slide.offsetLeft - margin);
    }

    slidesConfig() {
        this.slideArray = [...this.slide.children].map((element) => {
            const position = this.slidePosition(element);
            return { position, element };
        })
    }    

    slidesIndexNav(index) {
        const last = this.slideArray.length - 1;
        this.index = {
            prev: index ? index - 1 : undefined,
            active: index,
            next: index === last ? undefined : index +1,
        }
    }

    changeSlide(index) {
        const activeSlide = this.slideArray[index];
        this.moveSlide(this.slideArray[index].position);
        this.slidesIndexNav(index);
        this.dist.finalPosition = activeSlide.position;
    }

    init() {
        this.bindEvents();
        this.addSlideEvents();
        this.slidesConfig();
        return this;
    }
}