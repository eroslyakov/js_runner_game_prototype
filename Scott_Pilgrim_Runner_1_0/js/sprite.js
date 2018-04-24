
function createSprite(options) {
    function render(drawCoordinates, clearCoordinates) {
        this.context.clearRect(
            clearCoordinates.x,
            clearCoordinates.y,
            this.width,
            this.height
        );

        this.context.drawImage(
            this.spritesheet,
            this.frameIndex * this.width,
            0,
            this.width,
            this.height,
            drawCoordinates.x,
            drawCoordinates.y,
            this.width,
            this.height
        );
    }

    function update() {
        this.loopTicksCount += 1;
        if (this.loopTicksCount >= this.loopTicksPerFrame) {
            this.loopTicksCount = 0;
            this.frameIndex += 1;
            if (this.frameIndex >= this.numberOfFrames) {
                this.frameIndex = 0;
            }
        }
    }

    var sprite = {
        spritesheet: options.spritesheet,
        context: options.context,
        width: options.width,
        height: options.height,
        numberOfFrames: options.numberOfFrames,
        loopTicksPerFrame: options.loopTicksPerFrame,
        frameIndex: 0,
        loopTicksCount: 0,
        render,
        update
    };

    return sprite;
}
