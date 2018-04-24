function createBackground(options) {
    var backgroundCanvas = document.getElementById('background-canvas');
    var backgroundContext = backgroundCanvas.getContext('2d');
    var backgroundImg = document.getElementById('background');

    backgroundCanvas.height = options.height;
    backgroundCanvas.width = options.width;

    function render() {
        backgroundContext.drawImage(
            this.image,
            this.coordinates.x,
            0
        );

        backgroundContext.drawImage(
            this.image,
            this.image.width - Math.abs(this.coordinates.x),
            0
        );
    }

    function update() {
        this.coordinates.x -= this.speedX;
    }
    
    function endGame(coordinate) {
        return Math.abs(coordinate) < this.image.width - 700;
    }

    const background = {
        image: backgroundImg,
        speedX: options.speedX,
        coordinates: { x: 0, y: 0 },
        render,
        update,
        endGame
    };

    return background;
}
