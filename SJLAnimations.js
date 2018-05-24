new (function () {
    SJL.extend("fadeIn", function (milisseconds) {
        this.setProperty("style.opacity", 0);
        this.show();
        this.animate(0, 1, milisseconds, function (currValue) {
            this.setProperty("style.opacity", currValue);
        });

        return this;
    });

    SJL.extend("fadeOut", function (milisseconds) {
        this.animate(1, 0, milisseconds, function (currValue) {
            this.setProperty("style.opacity", currValue);
        }, function () { this.hide(); });

        return this;
    });

    SJL.extend("slide", function (startLeft, endLeft, milisseconds) {
        this.animate(startLeft, endLeft, milisseconds, function (currValue) {
            this.setProperty("style.left", currValue + "px");
        });

        return this;
    });

    SJL.extend("slideSpeedUp", function (startLeft, endLeft, milisseconds) {
        this.upAni(startLeft, endLeft, milisseconds, function (currValue) {
            this.setProperty("style.left", currValue + "px");
        });

        return this;
    });
})();