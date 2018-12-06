new (function () {
    SJL.extend("fadeIn", function (milisseconds, _onEnd_,_context_) {
        this.setProperty("style.opacity", 0);
        this.show();
        this.animate(0, 1, milisseconds, function (currValue) {
            this.setProperty("style.opacity", currValue);
        }, function(){if (typeof(_onEnd_) != "undefined") _onEnd_.call(_context_ || this);});

        return this;
    });

    SJL.extend("fadeOut", function (milisseconds, _onEnd_, _context_) {
        this.animate(1, 0, milisseconds, function (currValue) {
            this.setProperty("style.opacity", currValue);
        }, function(){this.hide(); if (typeof(_onEnd_) != "undefined") _onEnd_.call(_context_ || this);});

        return this;
    });

    SJL.extend("slide", function (startLeft, endLeft, milisseconds, _onEnd_, _context_) {
        this.animate(startLeft, endLeft, milisseconds, function (currValue) {
            this.setProperty("style.left", currValue + "px");
        }, function(){if (typeof(_onEnd_) != "undefined") _onEnd_.call(_context_ || this);});

        return this;
    });

    SJL.extend("slideSpeedUp", function (startLeft, endLeft, milisseconds, _onEnd_, _context_) {
        this.upAni(startLeft, endLeft, milisseconds, function (currValue) {
            this.setProperty("style.left", currValue + "px");
        }, function(){if (typeof(_onEnd_) != "undefined") _onEnd_.call(_context_ || this);});

        return this;
    });
})();